// global variable for current video id
var youtubeVideoId;

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

// when video ends
function onPlayerStateChange(event) {

    // TODO: Alert the server that the user has changed state
    console.log("State change");
    console.log(event);
}