require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Enhanced chatbot responses
function chatbotResponse(message) {
    const lower = message.toLowerCase();

    if (lower.includes("phishing")) {
        return "Phishing is a scam where attackers trick you into revealing personal info. Avoid clicking suspicious links!";
    } else if (lower.includes("malware")) {
        return "Malware is software that can harm your device. Always keep antivirus updated!";
    } else if (lower.includes("safe browsing")) {
        return "Google Safe Browsing helps identify dangerous websites. You can test URLs with our bot!";
    } else if (lower.includes("check") || lower.includes("is this site safe")) {
        return "Enter a website URL to check if it's safe (e.g., https://example.com).";
    } else {
        return "That's an interesting topic! Could you provide more details so I can help better?";
    }
}

// Safe Browsing API call
async function checkUrlSafety(url) {
    const key = process.env.SAFE_BROWSING_API_KEY;

    const requestBody = {
        client: {
            clientId: "safe-surf-bot",
            clientVersion: "1.0"
        },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }]
        }
    };

    try {
        const response = await axios.post(
            `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${key}`,
            requestBody
        );

        if (response.data && response.data.matches) {
            return "⚠ Warning: This website may be unsafe!";
        } else {
            return "✅ This website appears to be safe!";
        }
    } catch (error) {
        console.error("Safe Browsing error:", error.message);
        return "❌ Error checking the site. Try again later.";
    }
}

// Main chatbot route
app.post('/chatbot', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    if (message.startsWith("http://") || message.startsWith("https://")) {
        const safetyMessage = await checkUrlSafety(message);
        return res.json({ response: safetyMessage });
    }

    const botReply = chatbotResponse(message);
    res.json({ response: botReply });
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
