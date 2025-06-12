export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
    const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
      return res.status(500).json({ error: 'Server missing configuration' });
    }

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Airtable API error:', await response.text());
      return res.status(response.status).json({ 
        error: `Airtable API error: ${response.statusText}` 
      });
    }

    const data = await response.json();
    
    const filteredRecords = data.records.map(record => {
      const fields = record.fields;
      
      return {
        id: record.id,
        fields: {
          "First Name": fields["First Name"] || null,
          "Playable URL": fields["Playable URL"] || null,
          "Review Status": fields["Review Status"] || null,
          "Code URL": fields["Code URL"] || null,
          "Screenshot": fields["Screenshot"] || null
        }
      };
    });

    return res.status(200).json({ records: filteredRecords });
    
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}