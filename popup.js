let isExtensionEnabled = false;

const sendMessageToActiveTab = function(message, callback) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(
        tabs[0].id,
        message,
        callback
    )
  });
}

let enableButton = document.getElementById('enableButton');
enableButton.onclick = function() {
  if (isExtensionEnabled) {
    isExtensionEnabled = false;
    enableButton.innerHTML = "Enable";
  } else {
    isExtensionEnabled = true;
    enableButton.innerHTML = "Disable";
  }
  sendMessageToActiveTab({cmd: "enableExtension", data: {enabled: isExtensionEnabled}}, function() {
    console.log("responded");
  });
}
