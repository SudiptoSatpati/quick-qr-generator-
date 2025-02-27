document.addEventListener("DOMContentLoaded", async () => {
  try {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.url) {
      console.error("Failed to get the active tab URL.");
      return;
    }

    generateQRCode(tab.url);
  } catch (error) {
    console.error("Error getting tab URL:", error);
  }
});

function generateQRCode(url) {
  let qrDiv = document.getElementById("qrcode");
  qrDiv.innerHTML = ""; // Clear any existing QR codes

  new QRCode(qrDiv, {
    text: url,
    width: 200,
    height: 200,
  });
}
