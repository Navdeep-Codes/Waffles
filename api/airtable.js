export default async function handler(req, res) {
  // Check for API key authentication
  const apiKeyHeader = req.headers['auth'];
  const validApiKey = process.env.API_KEY;
  
  if (!apiKeyHeader || apiKeyHeader !== validApiKey) {
    return res.status(401).json({ error: 'Unauthorized - Invalid or missing API key' });
  }
  
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME;

  const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });

  if (!response.ok) {
    return res.status(response.status).json({ error: 'Failed to fetch from Airtable' });
  }

  const data = await response.json();
  res.status(200).json(data);
}