chrome.runtime.onInstalled.addListener(function() {
  console.log("hello world");
});

var getSongInfo = function() {
  var animeName = $("#qpAnimeName").text();
  var songName = $("#qpSongName").text();
  var songArtist = $("#qpSongArtist").text();
  var songType = $("#qpSongType").text();
  var songLink = $("#qpSongVideoLink").attr("href");

  return {
    "animeName": animeName,
    "songName": songName,
    "songArtist": songArtist,
    "songType": songType,
    "songLink": songLink
  };
};

var NO_USER = "No such user in game";
var NO_GUESS = "No guess yet";

var checkAnswer = function(username) {
  var answer = $("#qpAvatar-" + username);

  if (answer.length == 0) {
    return {"error": NO_USER};
  }

  var guess = answer.find(".qpAvatarAnswerText").text();
  var isCorrect = answer.find(".qpAvatarAnswerContainer").hasClass("rightAnswer");
  var isIncorrect = answer.find(".qpAvatarAnswerContainer").hasClass("wrongAnswer");

  if (!isCorrect && !isIncorrect) {
    return {"error": NO_GUESS};
  } else {
    return {
      "guess": guess,
      // believe wrongAnswer first, just in case weird things happen
      "isCorrect": !isIncorrect
    };
  }
};
