const API_KEY = "AIzaSyBPOwA3CdXHRHQuW4VZdsbZA7x7swm74y8";

document.addEventListener("DOMContentLoaded", () => {
    console.log("Safe Surf loaded successfully!");

    // Load phishing news
    loadNews();

    // Event listener for URL checking
    document.getElementById("check-btn").addEventListener("click", checkURL);
    
    // Event listener for reporting phishing sites
    document.getElementById("report-btn").addEventListener("click", reportPhishing);
});

const newsList = document.getElementById("news-list");

const phishingNews = [
    {
        title: "YouTube Deepfake Scam",
        message: "Scammers are using deepfake videos of YouTube CEO Neal Mohan to trick users.",
        link: "https://youtu.be/YYkrOFfBfog?si=xF2sRPpT4ppDRuKq"
    },
    {
        title: "Illinois Tollway Text Scam",
        message: "Fake messages claiming unpaid tolls are targeting Illinois residents.",
        link: "https://youtu.be/EWMYD32QTG4?si=lA0JJ9Ja9EaMZWLj"
    },
    {
        title: "Bank Phone Scam",
        message: "Scammers posing as bank officials are calling users for personal info.",
        link: "https://youtu.be/qMj6A0Edlrk?si=YdfdyjTKL6j0yNvS"
    }
];

function loadNews() {
    newsList.innerHTML = "";
    phishingNews.forEach(news => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${news.title}</strong>: ${news.message} <br> <a href="${news.link}" target="_blank">Watch Video</a>`;
        newsList.appendChild(listItem);
    });
}

// Function to check if a URL is safe using Google Safe Browsing API
function checkURL() {
    const urlInput = document.getElementById("urlInput").value.trim();
    const resultText = document.getElementById("result");
    
    if (!urlInput) {
        resultText.textContent = "Please enter a URL.";
        resultText.style.color = "red";
        return;
    }
    
    const requestBody = {
        client: { clientId: "safeSurf", clientVersion: "1.0" },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url: urlInput }]
        }
    };
    
    fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        if (data.matches && data.matches.length > 0) {
            resultText.textContent = "⚠ This URL is NOT safe! It may contain malware or phishing attempts.";
            resultText.style.color = "red";
        } else {
            resultText.textContent = "✅ This URL is safe! No threats detected.";
            resultText.style.color = "green";
        }
    })
    .catch(error => {
        console.error("Error checking URL:", error);
        resultText.textContent = "Error checking URL. Please try again later.";
        resultText.style.color = "orange";
    });
}

// Function to report a phishing site
function reportPhishing() {
    const reportedURL = document.getElementById("report-url").value.trim();
    if (reportedURL) {
        alert(`Thank you for reporting! The URL "${reportedURL}" will be reviewed.`);
        document.getElementById("report-url").value = ""; // Clear input
    } else {
        alert("Please enter a URL to report.");
    }
}
