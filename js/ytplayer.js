// global variable for current video id
var youtubeVideoId;
var prevState = -1;

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
    console.log("state change: ");
    console.log(event);
    if (stateHandler == undefined || stateHandler == null) {
        console.log("stateHandler not defined");
        return;
    }
    
    // alert the server that the video state has changed

    var currentState = event.data;
    console.log("prevState = " + prevState.toString());
    console.log("currentState = " + currentState.toString());

    if ((prevState == -1 || prevState == 1) && currentState == 2 /*paused*/) {
        if ($("#i-video-state").hasClass("fa-play")) {
            $("#i-video-state").removeClass("fa-play");
            $("#i-video-state").addClass("fa-pause");
            $("#i-video-state").css({ "color": "gray" });
        }

        console.log("User paused");
        stateHandler(player.getCurrentTime(), "paused");
        prevState = currentState;
    } else if ((prevState == -1 || prevState == 2) && currentState == 1 /*playing*/) {
        if ($("#i-video-state").hasClass("fa-pause")) {
            $("#i-video-state").removeClass("fa-pause");
            $("#i-video-state").addClass("fa-play");
            $("#i-video-state").css({ "color": "#00e673" });
        }

        //alert("The video title is: " +  event.target.getVideoData().title);
        stateHandler(player.getCurrentTime(), "playing");
        console.log("User played");
        prevState = currentState;
    }
}