// global variable for current video id
let youtubeVideoId;

// global variable for video player
let player = null;
let youtubePlayerLoaded = false;

var PlayState = {
    NONE: -1,
    PAUSED: 0,
    PLAYING: 1
};

// global variable for video play state
let curState = PlayState.NONE;

function loadYouTubePlayer() {
    // try parsing youtube video id from the given url
    $("#submit-youtube-url-button").click(function() {
        let givenUrl = $("#youtube-url").val();
        youtubeVideoId = givenUrl.split('v=')[1];

        // create the script element
        let tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        // insert the element into the DOM
        let firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    });
}

function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
        height: "100%",
        width: "100%",
        playerVars: {
            controls: 0,
            modestbranding: 0,
        },
        videoId: youtubeVideoId,
        events: {
            "onReady": onPlayerReady,
            "onStateChange": onPlayerStateChange
        }
    });

    youtubePlayerLoaded = true;
}

function pauseVideo(shouldSendEvents) {
    player.pauseVideo();
    curState = PlayState.PAUSED;

    if (shouldSendEvents) {
        stateHandler(player.getCurrentTime(), "paused");
    }
}

function playVideo(shouldSendEvents) {
    player.playVideo();
    curState = PlayState.PLAYING;

    if (shouldSendEvents) {
        stateHandler(player.getCurrentTime(), "playing");
    }
}

function onPlayerReady(event) {
}

function onPlayerStateChange(event) {
    if (stateHandler == undefined || stateHandler == null) {
        console.log("stateHandler not defined");
        return;
    }

    if ((curState == PlayState.NONE || curState == PlayState.PLAYING) && event.data == 2 /*paused*/) {
        // hide the player
        $("#player").hide();
        stateHandler(player.getCurrentTime(), "paused");

        curState = PlayState.PAUSED;
    } else if ((curState == PlayState.NONE || curState == PlayState.PAUSED) && event.data == 1 /*playing*/) {
        curState = PlayState.PLAYING;
    }
}
