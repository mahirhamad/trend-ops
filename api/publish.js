// Vercel Serverless Function: /api/publish
// Publishes updated travelData (and any new Base64 media files) directly to GitHub repository mahirhamad/trend-ops

const REPO_OWNER = process.env.GITHUB_OWNER || 'mahirhamad';
const REPO_NAME = process.env.GITHUB_REPO || 'trend-ops';
const BRANCH = process.env.GITHUB_BRANCH || 'main';

async function githubRequest(path, token, options = {}) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GitHub API Error (${res.status}): ${errText}`);
  }
  return res.json();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { travelData, githubToken, dataJsContent } = req.body || {};
    const token = githubToken || process.env.GITHUB_TOKEN;

    if (!token) {
      return res.status(400).json({
        error: 'MISSING_TOKEN',
        message: 'لم يتم إعداد رمز الربط السحابي (GitHub Token) بعد.'
      });
    }

    if (!travelData || !Array.isArray(travelData.services)) {
      return res.status(400).json({ error: 'Invalid travelData payload' });
    }

    // 1. Get latest commit SHA and base tree SHA on branch
    const refData = await githubRequest(`/git/ref/heads/${BRANCH}`, token);
    const latestCommitSha = refData.object.sha;
    const commitData = await githubRequest(`/git/commits/${latestCommitSha}`, token);
    const baseTreeSha = commitData.tree.sha;

    const treeItems = [];
    const cleanData = JSON.parse(JSON.stringify(travelData));
    cleanData._updatedAt = Date.now();

    // 2. Extract any inline Base64 media into assets/media/ blobs
    const uploadBase64Media = async (dataUrl, serviceId, index) => {
      const match = /^data:(image|video)\/([a-zA-Z0-9+.-]+);base64,(.+)$/.exec(dataUrl);
      if (!match) return dataUrl;
      const mediaKind = match[1];
      let ext = match[2].toLowerCase();
      if (ext === 'jpeg') ext = 'jpg';
      if (ext === 'quicktime') ext = 'mov';
      const base64Content = match[3];
      const fileName = `cloud-${serviceId}-${cleanData._updatedAt}-${index}.${ext}`;
      const filePath = `assets/media/${fileName}`;

      const blobRes = await githubRequest('/git/blobs', token, {
        method: 'POST',
        body: JSON.stringify({
          content: base64Content,
          encoding: 'base64'
        })
      });

      treeItems.push({
        path: filePath,
        mode: '100644',
        type: 'blob',
        sha: blobRes.sha
      });

      // Use raw.githubusercontent.com URL so it works immediately across all devices within 1 second
      return `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${filePath}`;
    };

    for (const s of cleanData.services) {
      const sid = String(s.id || 'item').replace(/[^a-zA-Z0-9_-]/g, '');
      if (Array.isArray(s.gallery)) {
        for (let i = 0; i < s.gallery.length; i++) {
          const g = s.gallery[i];
          const url = typeof g === 'string' ? g : (g && g.url);
          if (url && url.startsWith('data:')) {
            const cloudUrl = await uploadBase64Media(url, sid, i + 1);
            if (typeof g === 'string') {
              s.gallery[i] = { url: cloudUrl, type: 'image', isCover: i === 0 };
            } else {
              s.gallery[i].url = cloudUrl;
            }
          }
        }
      }
      if (s.image && s.image.startsWith('data:')) {
        const coverFromGallery = Array.isArray(s.gallery)
          ? (s.gallery.find(g => g && g.isCover && g.url && !g.url.startsWith('data:')) || s.gallery[0])
          : null;
        if (coverFromGallery && coverFromGallery.url && !coverFromGallery.url.startsWith('data:')) {
          s.image = coverFromGallery.url;
        } else {
          s.image = await uploadBase64Media(s.image, sid, 0);
        }
      }
    }

    // 3. Create blob for assets/js/live-data.json
    const liveJsonStr = JSON.stringify(cleanData, null, 2);
    const liveBlob = await githubRequest('/git/blobs', token, {
      method: 'POST',
      body: JSON.stringify({ content: liveJsonStr, encoding: 'utf-8' })
    });
    treeItems.push({
      path: 'assets/js/live-data.json',
      mode: '100644',
      type: 'blob',
      sha: liveBlob.sha
    });

    // 4. Create blob for assets/js/data.js if provided
    if (dataJsContent && typeof dataJsContent === 'string') {
      const updatedDataJs = dataJsContent.replace(
        /const DEFAULT_TRAVEL_DATA = [\s\S]*?;\n\n\/\/ Storage Key/,
        `const DEFAULT_TRAVEL_DATA = ${liveJsonStr};\n\n// Storage Key`
      );
      const dataJsBlob = await githubRequest('/git/blobs', token, {
        method: 'POST',
        body: JSON.stringify({ content: updatedDataJs, encoding: 'utf-8' })
      });
      treeItems.push({
        path: 'assets/js/data.js',
        mode: '100644',
        type: 'blob',
        sha: dataJsBlob.sha
      });
    }

    // 5. Create new Git Tree and Commit
    const newTree = await githubRequest('/git/trees', token, {
      method: 'POST',
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: treeItems
      })
    });

    const newCommit = await githubRequest('/git/commits', token, {
      method: 'POST',
      body: JSON.stringify({
        message: `Cloud Sync update from Admin Panel (${new Date().toISOString()})`,
        tree: newTree.sha,
        parents: [latestCommitSha]
      })
    });

    await githubRequest(`/git/refs/heads/${BRANCH}`, token, {
      method: 'PATCH',
      body: JSON.stringify({
        sha: newCommit.sha,
        force: true
      })
    });

    return res.status(200).json({
      ok: true,
      commitSha: newCommit.sha,
      updatedAt: cleanData._updatedAt,
      travelData: cleanData
    });
  } catch (err) {
    return res.status(500).json({
      error: 'PUBLISH_FAILED',
      message: err.message || 'حدث خطأ أثناء النشر السحابي'
    });
  }
}
