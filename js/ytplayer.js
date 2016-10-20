// global variable for current video id
var youtubeVideoId;

var player = null;
var youtubePlayerLoaded = false;

var PlayState = {
    NONE: -1,
    PAUSED: 0,
    PLAYING: 1
};

var curState = PlayState.NONE;

function loadYouTubePlayer() {
    // try parsing youtube video id from the given url
    $("#submit-youtube-url-button").click(function() {
        var givenUrl = $("#youtube-url").val();
        youtubeVideoId = givenUrl.split('v=')[1];

        // create the script element
        var tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        // insert the element into the DOM
        var firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    });
}

function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        playerVars: {
            controls: 0,
            modestbranding: 0,
        },
        videoId: youtubeVideoId,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });

    youtubePlayerLoaded = true;
}

/*setInterval(function() {
    if (youtubePlayerLoaded) {
        var timeToListen = 30.0;

        if (parseFloat(player.getDuration()) < 30.0) {
            timeToListen = parseFloat(player.getDuration());
        }

        if (player.getCurrentTime() >= timeToListen) {
            $("#postbtn").removeAttribute('disabled');
            $("#timeremaining").innerHTML = "0s";
        } else {
            $("#timeremaining").innerHTML =
                Math.ceil(timeToListen-player.getCurrentTime()) + "s";
        }
    }
}, 100);*/

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

// autoplay video
function onPlayerReady(event) {
}

function onPlayerStateChange(event) {
    console.log("state change: ");
    console.log(event);
    if (stateHandler == undefined || stateHandler == null) {
        console.log("stateHandler not defined");
        return;
    }

    // alert the server that the video state has changed

    let ytState = event.data;

    if ((curState == PlayState.NONE || curState == PlayState.PLAYING) && ytState == 2 /*paused*/) {
        

        // hide the player
        $("#player").hide();
        stateHandler(player.getCurrentTime(), "paused");

        curState = PlayState.PAUSED;
    } else if ((curState == PlayState.NONE || curState == PlayState.PAUSED) && ytState == 1 /*playing*/) {

        //alert("The video title is: " +  event.target.getVideoData().title);
        curState = PlayState.PLAYING;
    }
}
