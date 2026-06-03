export default async function handler(req, res) {
  // CORS Headers for API accessibility
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-canvas-url, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const canvasHost = req.headers['x-canvas-url'];
  const authHeader = req.headers['authorization'];

  if (!canvasHost) {
    return res.status(400).json({ error: 'Missing x-canvas-url header' });
  }

  // Parse path sub-routes from req.url (e.g. /api/canvas-proxy?endpoint=/api/v1/courses)
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const endpoint = urlObj.searchParams.get('endpoint');

  if (!endpoint) {
    return res.status(400).json({ error: 'Missing endpoint search parameter' });
  }

  // Normalize host URL
  let targetHost = canvasHost.trim();
  if (!targetHost.startsWith('http://') && !targetHost.startsWith('https://')) {
    targetHost = 'https://' + targetHost;
  }

  const destinationUrl = `${targetHost}${endpoint}`;

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        'Accept': 'application/json'
      }
    };

    if (authHeader) {
      fetchOptions.headers['Authorization'] = authHeader;
    }

    const canvasResponse = await fetch(destinationUrl, fetchOptions);
    
    if (!canvasResponse.ok) {
      const errText = await canvasResponse.text();
      return res.status(canvasResponse.status).send(errText);
    }

    const data = await canvasResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: `Server Proxy Error: ${error.message}` });
  }
}
