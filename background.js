// Log a message when the service worker is loaded
console.log("Background script loaded successfully!");

// Listen for a message from the popup or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background script:", message);

  if (message.action === "summarize") {
    // Example: Log or handle the summarize action
    console.log("Summarizing the content of the blog...");

    // Example response
    sendResponse({ status: "success", summary: "This is a summary of the blog content." });
  }
});

// Example: Action when the extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  console.log("Extension icon clicked!", tab);

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: extractText
  });

  // Example: Sending a message to the current tab
  chrome.tabs.sendMessage(tab.id, { action: "startSummarize" }, (response) => {
    console.log("Response from content script:", response);
  });
});


function extractText() {
  debugger
  // Extracts the text of the entire page (you can customize this to extract specific elements)
  const pageContent = document.body.innerText;
  console.log(pageContent);
  return chrome.runtime.sendMessage({ text: pageContent });
}