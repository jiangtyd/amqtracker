chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (sender.tab) {
            if (request.cmd === "checkAnswer") {
                // request: cmd, songInfo, checkedAnswer
                console.log(JSON.stringify(request));
            }
        }
    });