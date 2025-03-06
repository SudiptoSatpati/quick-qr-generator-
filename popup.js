// Global variables
let qrcode;
let currentUrl = "";
let qrSize = 150;
let darkMode = false;
let qrColor = "#000000";
let qrBackground = "#FFFFFF";
let errorCorrectionLevel = "H";

// Initialize when DOM content is loaded
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Load saved preferences
    loadSavedPreferences();

    // Set initial UI states
    updateUIFromPreferences();

    // Get the current tab's URL
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.url) {
      console.error("Failed to get the active tab URL.");
      document.getElementById("current-url").textContent = "Unable to get URL";
      return;
    }

    currentUrl = tab.url;
    document.getElementById("current-url").textContent = currentUrl;

    // Check if URL is too long
    updateURLWarning(currentUrl);

    // Initialize QR code
    generateQRCode(currentUrl, qrSize);

    // Set up event listeners
    document.getElementById("size").addEventListener("input", handleSizeChange);
    document
      .getElementById("error-correction")
      .addEventListener("change", handleErrorCorrectionChange);
    document
      .getElementById("download")
      .addEventListener("click", downloadQRCode);
    document.getElementById("copy").addEventListener("click", copyQRCode);
    document.getElementById("share").addEventListener("click", shareQRCode);
    document
      .getElementById("qr-color")
      .addEventListener("input", handleColorChange);
    document
      .getElementById("bg-color")
      .addEventListener("input", handleBgColorChange);
    document
      .getElementById("theme-toggle")
      .addEventListener("click", toggleTheme);

    document.getElementById("reset").addEventListener("click", resetSettings);
  } catch (error) {
    console.error("Error initializing extension:", error);
  }
});

// Load saved preferences from storage
function loadSavedPreferences() {
  try {
    const savedSize = localStorage.getItem("qrSize");
    const savedQrColor = localStorage.getItem("qrColor");
    const savedBgColor = localStorage.getItem("qrBackground");
    const savedErrorLevel = localStorage.getItem("errorLevel");
    const savedDarkMode = localStorage.getItem("darkMode");

    if (savedSize) qrSize = parseInt(savedSize);
    if (savedQrColor) qrColor = savedQrColor;
    if (savedBgColor) qrBackground = savedBgColor;
    if (savedErrorLevel) errorCorrectionLevel = savedErrorLevel;
    if (savedDarkMode) darkMode = savedDarkMode === "true";
  } catch (error) {
    console.error("Error loading preferences:", error);
  }
}

// Update UI to reflect current preferences
function updateUIFromPreferences() {
  document.getElementById("size").value = qrSize;
  document.getElementById("size-value").textContent = qrSize + "×" + qrSize;
  document.getElementById("qr-color").value = qrColor;
  document.getElementById("bg-color").value = qrBackground;
  document.getElementById("error-correction").value = errorCorrectionLevel;

  if (darkMode) {
    document.body.classList.add("dark-mode");
    document.getElementById("theme-toggle").textContent = "☀️";
  }
}

// Generate QR code with given URL and size
function generateQRCode(url, size) {
  // Clear previous QR code if it exists
  const qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = "";

  // Create new QR code
  qrcode = new QRCode(qrContainer, {
    text: url,
    width: size,
    height: size,
    colorDark: qrColor,
    colorLight: qrBackground,
    correctLevel: QRCode.CorrectLevel[errorCorrectionLevel],
  });
}

// Check if URL is too long and display warning
function updateURLWarning(url) {
  const urlLength = url.length;
  const warningElement = document.getElementById("url-warning");

  if (urlLength > 300) {
    warningElement.textContent = `Warning: Long URL (${urlLength} chars) may reduce QR code readability`;
    warningElement.style.display = "block";
  } else {
    warningElement.style.display = "none";
  }
}

// Handle size slider change
function handleSizeChange() {
  qrSize = parseInt(this.value);
  document.getElementById("size-value").textContent = qrSize + "×" + qrSize;

  // Save preference
  localStorage.setItem("qrSize", qrSize);

  // Regenerate QR code with new size
  generateQRCode(currentUrl, qrSize);
}

// Handle error correction level change
function handleErrorCorrectionChange() {
  errorCorrectionLevel = this.value;

  // Save preference
  localStorage.setItem("errorLevel", errorCorrectionLevel);

  // Regenerate QR code
  generateQRCode(currentUrl, qrSize);
}

// Handle QR color change
function handleColorChange() {
  qrColor = this.value;

  // Save preference
  localStorage.setItem("qrColor", qrColor);

  // Regenerate QR code
  generateQRCode(currentUrl, qrSize);
}

// Handle background color change
function handleBgColorChange() {
  qrBackground = this.value;

  // Save preference
  localStorage.setItem("qrBackground", qrBackground);

  // Regenerate QR code
  generateQRCode(currentUrl, qrSize);
}

function switchTab(tabId) {
  console.log(`Switching to tab: ${tabId}`); // Debug log
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
  });
  document.getElementById(tabId).classList.add("active");
  document.querySelector(`[data-tab=${tabId}]`).classList.add("active");
}

// Toggle dark mode
function toggleTheme() {
  darkMode = !darkMode;
  document.body.classList.toggle("dark-mode");

  // Update button icon
  this.textContent = darkMode ? "☀️" : "🌙";

  // Save preference
  localStorage.setItem("darkMode", darkMode);
}

// Reset all settings to default
function resetSettings() {
  // Clear saved preferences
  localStorage.clear();

  // Reset variables to defaults
  qrSize = 150;
  qrColor = "#000000";
  qrBackground = "#FFFFFF";
  errorCorrectionLevel = "H";
  darkMode = false;

  // Update UI
  updateUIFromPreferences();

  // Remove dark mode if active
  document.body.classList.remove("dark-mode");
  document.getElementById("theme-toggle").textContent = "🌙";

  // Regenerate QR code
  generateQRCode(currentUrl, qrSize);

  showNotification("Settings reset to default");
}

// Download QR code as image
function downloadQRCode() {
  // Get the QR code image
  const img = document.querySelector("#qrcode img");
  if (!img) return;

  // Create an invisible anchor element
  const a = document.createElement("a");
  a.href = img.src;
  a.download = "qrcode-" + new URL(currentUrl).hostname + ".png";
  document.body.appendChild(a);

  // Trigger download and cleanup
  a.click();
  document.body.removeChild(a);

  showNotification("QR code downloaded");
}

// Copy QR code image to clipboard
function copyQRCode() {
  // Get the QR code image
  const img = document.querySelector("#qrcode img");
  if (!img) return;

  // Create a canvas to manipulate the image
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  // Draw the image on the canvas
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);

  // Convert the canvas to a blob and copy to clipboard
  canvas.toBlob(function (blob) {
    navigator.clipboard
      .write([new ClipboardItem({ "image/png": blob })])
      .then(function () {
        showNotification("Copied to clipboard!");
      })
      .catch(function (err) {
        console.error("Could not copy image: ", err);
        showNotification("Failed to copy", true);
      });
  });
}

// Share QR code (using Web Share API if available)
async function shareQRCode() {
  try {
    // Get the QR code image
    const img = document.querySelector("#qrcode img");
    if (!img) return;

    // Convert the image to a blob
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve));
    const file = new File([blob], "qrcode.png", { type: "image/png" });

    // Use Web Share API
    if (navigator.share) {
      await navigator.share({
        title: "QR Code for " + new URL(currentUrl).hostname,
        text: "QR Code for: " + currentUrl,
        files: [file],
      });
      showNotification("QR code shared successfully");
    } else {
      // Fallback if Web Share API is not available
      copyQRCode();
      showNotification("Web Share not supported. Copied to clipboard instead.");
    }
  } catch (error) {
    console.error("Error sharing QR code:", error);
    showNotification("Failed to share QR code", true);
  }
}

// Show notification with optional error styling
function showNotification(message, isError = false) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.add("show");

  if (isError) {
    notification.classList.add("error");
  } else {
    notification.classList.remove("error");
  }

  setTimeout(function () {
    notification.classList.remove("show");
  }, 2000);
}
