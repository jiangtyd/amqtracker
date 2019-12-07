let extensionEnabled = false;
let answerCheckObserver = undefined;
let username = "druggedfoxjr";

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.cmd === "enableExtension") {
      extensionEnabled = request.data.enabled;
      console.log("received enableExtension(" + extensionEnabled + ")");
      if (extensionEnabled) {
        enableExtension();
      } else {
        disableExtension();
      }
    }
  }
);

const enableExtension = function() {
  answerCheckObserver = bindCheckAnswerObserver();
}

const disableExtension = function() {
  unbindCheckAnswerObserver(answerCheckObserver);
}

const getClassChangeObserver = function(classname_regex, callback) {
  const classChangeCallback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.attributeName === "class") {
        var classList = mutation.target.className;
        console.log("classList = " + classList);
        if (classname_regex.exec(classList) !== null) {
          callback();
        }
      }
    }
  }

  return new MutationObserver(classChangeCallback);
}

const checkCallback = function() {
  console.log("checking answers!");
  let songInfo = getSongInfo();
  let checkedAnswer = checkAnswer(username);
  console.log("song info: " + JSON.stringify(songInfo));
  console.log("checkedAnswer: " + JSON.stringify(checkedAnswer));
  chrome.runtime.sendMessage({"cmd": "checkAnswer", "songInfo": songInfo, "checkedAnswer": checkedAnswer});
}

const bindCheckAnswerObserver = function() {
  let infoHiderNode = $('#qpInfoHider')[0];
  const config = { attributes: true, childList: false, subtree: false, attributeFilter: ['class'] };

  const observer = getClassChangeObserver(/hide/, checkCallback);
  observer.observe(infoHiderNode, config);

  return observer;
}

const unbindCheckAnswerObserver = function(observer) {
  observer.disconnect();
}

const getSongInfo = function() {
  let animeName = $("#qpAnimeName").text();
  let songName = $("#qpSongName").text();
  let songArtist = $("#qpSongArtist").text();
  let songType = $("#qpSongType").text();
  let songLink = $("#qpSongVideoLink").attr("href");

  return {
    "animeName": animeName,
    "songName": songName,
    "songArtist": songArtist,
    "songType": songType,
    "songLink": songLink
  };
};

const NO_USER = "No such user in game";
const NO_GUESS = "No guess yet";

const checkAnswer = function(username) {
  let avatarRow = $("#qpAvatarRow");
  let result = {"error": NO_USER};

  // iterate and filter for now
  avatarRow.children(".qpAvatarContainer").each(function() {
    let answer = $(this);
    let user = answer.find(".qpAvatarNameContainer").first().text().trim();
    if (user === username) {
      let guess = answer.find(".qpAvatarAnswerText").text();
      let isCorrect = answer.find(".qpAvatarAnswerContainer").hasClass("rightAnswer");
      let isIncorrect = answer.find(".qpAvatarAnswerContainer").hasClass("wrongAnswer");

      if (!isCorrect && !isIncorrect) {
        result = {"error": NO_GUESS};
        return false;
      } else {
        result = {
          "guess": guess,
          // believe wrongAnswer first, just in case weird things happen
          "isCorrect": !isIncorrect
        };
        return false;
      }
    }

  })

  return result;
};
