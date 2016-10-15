// global variable for current video id
var youtubeVideoId;
let prevState = -1;

var player = null;
var youtubePlayerLoaded = false;

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

        if (youtubePlayerLoaded) {
            // the button was pressed after original
            // load, so load the new video
            player.loadVideoById(youtubeVideoId);
        }
    });
}

function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        playerVars: {
            controls: 0,
            modestbranding: 1,
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

function stopVideo() {
    player.stopVideo();
}

function playVideo() {
    event.target.playVideo();
}

// autoplay video
function onPlayerReady(event) {
}

function onPlayerStateChange(event) {
    console.log("state change: " + player.getPlayerState().toString());
    if (stateHandler == undefined || stateHandler == null) {
        console.log("stateHandler not defined");
        return;
    }
    
    // alert the server that the video state has changed

    if (prevState == 1 && player.getPlayerState() == 2 /*paused*/) {
        stateHandler(player.getCurrentTime(), "paused");
    } else if (prevState == 2 && player.getPlayerState() == 1 /*playing*/) {
        stateHandler(player.getCurrentTime(), "playing");
    }

    prevState = player.getPlayerState();
}