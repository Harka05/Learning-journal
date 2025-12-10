// browser.js

// Function to show a browser notification
function showNotification(message) {
  // Check if the browser supports notifications
  if (!("Notification" in window)) return;

  // If permission is already granted, show notification
  if (Notification.permission === "granted") {
    new Notification(message);
  } 
  // If permission is not denied, request it
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(message);
      }
    });
  } 
  // If denied, fallback to alert
  else {
    alert(message);
  }
}

// Optional: Copy journal entry to clipboard
const copyBtn = document.getElementById('copyEntry'); // Add a button with this ID in HTML if you want
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    const entryText = document.getElementById('entryText').value;
    if (entryText) {
      navigator.clipboard.writeText(entryText)
        .then(() => showNotification("Copied to clipboard!"))
        .catch(err => console.error("Clipboard copy failed:", err));
    }
  });
}
