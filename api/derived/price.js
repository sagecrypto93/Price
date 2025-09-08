export default async function handler(req, res) {
  const token = "0d866412-d29c-41ed-a044-7be4fb52478a";

  const marketCapURL = `https://api.researchbitcoin.net/v1/marketcap/market_cap?token=${token}&date_field=2011-01-01&output_format=json`;
  const supplyURL = `https://api.researchbitcoin.net/v1/supply_distribution/supply_total?token=${token}&date_field=2011-01-01&output_format=json`;

  try {
    const [capRes, supplyRes] = await Promise.all([
      fetch(marketCapURL),
      fetch(supplyURL)
    ]);

    if (!capRes.ok || !supplyRes.ok) {
      return res.status(500).json({ error: "API fetch failed" });
    }

    const capJson = await capRes.json();
    const supplyJson = await supplyRes.json();

    const capData = capJson.data || [];
    const supplyData = supplyJson.data || [];

    if (!capData.length || !supplyData.length) {
      return res.status(500).json({ error: "Empty data arrays from API" });
    }

    // Match data by date
    const combined = capData.map(capItem => {
      const match = supplyData.find(s => s.date === capItem.date);
      if (!match || !match.supply_total || match.supply_total === 0) return null;

      return {
        date: capItem.date,
        price: capItem.market_cap / match.supply_total
      };
    }).filter(Boolean); // remove nulls

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ data: combined });
  } catch (err) {
    console.error("Error fetching derived price:", err);
    res.status(500).json({ error: "Server error" });
  }
}
