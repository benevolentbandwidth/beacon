// Get the toggle and scan button elements
const scanToggle = document.getElementById('scan-toggle');
const scanButton = document.getElementById('scan-button');

// Load the toggle state from Chrome storage on page load
chrome.storage.local.get(['scanningEnabled'], (result) => {
  const isEnabled = result.scanningEnabled !== false; // Default to true
  scanToggle.checked = isEnabled;
  updateScanButtonState(isEnabled);
});

// Listen for toggle changes
scanToggle.addEventListener('change', (event) => {
  const isEnabled = event.target.checked;
  chrome.storage.local.set({ scanningEnabled: isEnabled });
  updateScanButtonState(isEnabled);
});

// Update the scan button's disabled state based on toggle
function updateScanButtonState(isEnabled) {
  scanButton.disabled = !isEnabled;
  if (!isEnabled) {
    scanButton.textContent = 'Scanning disabled';
  } else {
    scanButton.textContent = 'Check this page';
  }
}

// ...existing scan button logic...
