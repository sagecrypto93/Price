export default async function handler(req, res) {
  const token = "0d866412-d29c-41ed-a044-7be4fb52478a"; 
  const endpoint = `https://api.researchbitcoin.net/v1/realizedprice/realized_price_lth?token=${token}&date_field=2011-01-01&output_format=json`;
  // Change title to CATEGORY name .js
  // Change NAME to CATEGORY name and 2NDNAME to data_field name

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch API data" });
    }
    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}


