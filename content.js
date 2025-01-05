// Ensure the DOM is loaded before accessing the elements
document.addEventListener("DOMContentLoaded", async () => {
  const loader = document.getElementById("loader");
  const summaryElement = document.getElementById("summary");
try {
  // Get the active tab's URL
  loader.style.display = "block";
  summaryElement.style.display = "none";
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab?.url) {
    // Call the summarization function with the tab's URL
    const summaryContent = await summarizeWithGemini(tab.url);
    summaryElement.textContent = summaryContent;
    loader.style.display = "none";
    summaryElement.style.display = "block";
    // Display the summary in the DOM
    const preId = document.getElementById("summary");
    preId.textContent = summaryContent; // Set content as text

  } else {
    alert("Unable to get the current tab's URL.");
  }
} catch (error) {
  alert("An error occurred while processing the request.");
}
});


async function fetchBlogContent(url) {
  try {
      const response = await fetch(url);        
    if (!response.ok) {
      throw new Error(`Failed to fetch content. Status: ${response.status}`);
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Extract main content (adjust selector as per website structure)
    const content = doc.querySelector("article")?.innerText || doc.body.innerText;
    return content.trim();
  } catch (error) {
    return null;
  }
}


// Function to summarize content using Gemini API
async function summarizeWithGemini(url) {
  try {
    // Fetch blog content using the URL
    const content = await fetchBlogContent(url);

    const apiKey = "AIzaSyAgUTLCLeuI-meKuBseKyidtNTdw-zWni4"; // Replace with your valid Gemini API key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    // Send the content to Gemini API for summarization
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Summarize the following content: ${content}`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorResponse = await response.text();
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const completeResponseText= data?.candidates[0]?.content?.parts[0]?.text || "No summary generated.";
    return completeResponseText;
  } catch (error) {
    return "Error summarizing the blog content.";
  }
}

