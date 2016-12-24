
var PlayState = {
    NONE: -1,
    PAUSED: 0,
    PLAYING: 1
};

// global video data
var videoData = {
    videoId: -1,
    player: null,
    playState: PlayState.NONE
};

function loadYouTubePlayer() {
    // try parsing youtube video id from the url
    $('#submit-youtube-url-button').click(function() {
        var vidUrl = $('#youtube-url').val();
        videoData.videoId = vidUrl.split('v=')[1];

        // create the script element
        var tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        // insert the element into the DOM
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    });
}

function onYouTubePlayerAPIReady() {
    videoData.player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        playerVars: {
            controls: 0,
            modestbranding: 0,
        },
        videoId: videoData.videoId,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function pauseVideo(shouldSendEvents) {
    videoData.player.pauseVideo();
    videoData.playState = PlayState.PAUSED;

    if (shouldSendEvents) {
        stateHandler(videoData.player.getCurrentTime(), 'paused');
    }
}

function playVideo(shouldSendEvents) {
    videoData.player.playVideo();
    videoData.playState = PlayState.PLAYING;

    if (shouldSendEvents) {
        stateHandler(videoData.player.getCurrentTime(), 'playing');
    }
}

function onPlayerReady(event) {
}

function onPlayerStateChange(event) {
    if (!stateHandler) {
        console.log('stateHandler not defined');
        return;
    }

    if ((videoData.playState == PlayState.NONE || 
            videoData.playState == PlayState.PLAYING) && event.data == 2 /*paused*/) {
        // hide the player
        $('#player').hide();
        stateHandler(videoData.player.getCurrentTime(), 'paused');
        videoData.playState = PlayState.PAUSED;
    } else if ((videoData.playState == PlayState.NONE || 
            videoData.playState == PlayState.PAUSED) && event.data == 1 /*playing*/) {
        videoData.playState = PlayState.PLAYING;
    }
}
