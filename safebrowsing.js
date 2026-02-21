require('dotenv').config();
const axios = require('axios');

const API_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.GOOGLE_SAFE_BROWSING_API_KEY}`;

async function checkUrlSafety(urlToCheck) {
  const body = {
    client: { clientId: "phishing-bot", clientVersion: "1.0" },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url: urlToCheck }]
    }
  };

  try {
    const res = await axios.post(API_URL, body);
    if (res.data && res.data.matches) return { safe: false, threats: res.data.matches };
    return { safe: true };
  } catch (error) {
    console.error("Safe Browsing API error:", error.message);
    return { safe: false, error: 'API call failed' };
  }
}

module.exports = { checkUrlSafety };
