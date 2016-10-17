// should video play/pause events be sent to the server
let sendEvents = true;

function generateRoomId() {
    return Math.random().toString(36).substr(2, 8);
}

$(document).ready(function() {
    $("#create-modal-link").click(function() {
        // hide the error, in the case that it was previously visible
        $("#room-name-error").hide();
        $("#create-modal").modal("show");
    });

    $("#create-room-btn").click(function() {
        // retrieve user entered values
        let roomName = $("#room-name").val();
        let maxViewers = parseInt($("#max-watchers").val());
        // generate room id
        let roomId = generateRoomId();

        if (roomName.length == 0) {
            // room name not set
            $("#room-name-error").show();
        } else {
            // hide the current modal
            $("#create-modal").modal("hide");

            // set text for room ID
            $("#random-id").text(roomId);
            // show the modal that displays the generated id
            $("#after-create-modal").modal("show");

            // room creation with firebase
            let roomRef = database.ref("/rooms");
            let roomData = {
                id: roomId,
                name: roomName,
                max: maxViewers
            };

            // push room info to Firebase
            let thisRoom = roomRef.push(roomData);
            let thisRoomRef = database.ref("/rooms/" + thisRoom.key.toString());
            // TODO: Make it add the actual watcher to the room
            let thisRoomUsersRef = database.ref("/rooms/" + thisRoom.key.toString()
                + "/watchers");

            // update the current room property
            let usersRef = database.ref("/users");
            loggedUser.currentRoomKey = thisRoom.key.toString();
            usersRef.update(loggedUser);

            thisRoomUsersRef.push(loggedUser.id);
        }
    });

    $("#go-to-room-btn").click(function() {
        // redirect page to the created room
        //window.location.href = "room.html";
        $("#good-to-go-window").hide();
        $("#room-content").show();
        loadRoomContent();
    });


    $("#join-modal-link").click(function() {
        // hide the error, in the case that it was previously visible
        $("#room-join-error").hide();
        $("#join-modal").modal("show");
    });

    $("#join-room-btn").click(function() {
        let roomKey = $("#room-key").val();
        let foundRoom = {};

        // check the database for rooms with the key
        let roomRef = database.ref("/rooms");
        roomRef.once("value").then(function(snapshot) {
            // get the snapshot value
            let snapshotValue = snapshot.val();
            if (snapshotValue == undefined || snapshotValue == null) {
                // error joining room
                $("#room-join-error").show();
            } else {
                let keys = Object.keys(snapshotValue);
                let found = false;
                for (let i = 0; i < keys.length; i++) {
                    if (snapshotValue[keys[i]].id === roomKey) {
                        foundRoom = snapshotValue[keys[i]];
                        foundRoom.key = keys[i];
                        found = true;
                    }
                }

                if (!found) {
                    $("#room-join-error").show();
                } else {
                    console.log(foundRoom);

                    let maxWatchers = foundRoom.max;
                    let watchers = foundRoom.watchers;
                    let numWatchers = (watchers != null) ? Object.keys(watchers).length : 0;

                    if (numWatchers >= maxWatchers) {
                        // cannot join, room is full
                        $("#room-join-error").show();
                    } else {

                        // update the current room property
                        let usersRef = database.ref("/users");
                        loggedUser.currentRoomKey = foundRoom.key.toString();
                        usersRef.update(loggedUser);

                        // add user to watchers
                        let thisRoomUsersRef = database.ref("/rooms/" + foundRoom.key.toString()
                            + "/watchers");

                        thisRoomUsersRef.push(loggedUser.id);

                        // show the room content
                        $("#good-to-go-window").hide();
                        $("#room-content").show();
                        loadRoomContent();

                        // hide the modal box
                        $("#join-modal").modal("hide");
                    }
                }
            }
        });
    });

    // bind click event to send message
    $("#sidebar-send-btn").click(function() {
        let text = $("#sidebar-send-txt").val();

        // send the message
        if (text.length > 0) {
            sendMessage(text);
            // clear the text field
            $("#sidebar-send-txt").val("");
        }
    });

    // bind click event to show add to queue modal
    $("#add-to-queue-btn").click(function() {
        // hide the error (in the case that it has been shown previously)
        $("#video-input-error").hide();
        // clear the textbox
        $("#youtube-url").val("");
        // show the modal
        $("#add-video-modal").modal("show");
    });

    // bind click event to actually add the video to queue
    $("#add-video-modal-btn").click(function() {
        let text = $("#youtube-url").val();

        if (text.length == 0) {
            $("#video-input-error").show();
        } else {
            // get the youtube video id
            let youtubeVideoId = text.split("v=")[1];

            // send request to the server
            let currentRoomKey = loggedUser.currentRoomKey;
            let currentRoomRef = database.ref("/rooms/" + currentRoomKey.toString());
            let queueRef = database.ref("/rooms/" + currentRoomKey.toString() + "/queue");

            // push the object
            queueRef.push({
                videoId: youtubeVideoId
            });

            // close this modal
            $("#add-video-modal").modal("hide");
        }
    });
});

function loadRoomContent() {
    loadYouTubePlayer();

    let currentRoomKey = loggedUser.currentRoomKey;
    let currentRoomRef = database.ref("/rooms/" + currentRoomKey.toString());
    let messagesRef = database.ref("/rooms/" + currentRoomKey.toString() + "/messages");
    let currentVideoInfoRef = database.ref("/rooms/" + currentRoomKey.toString() + "/currentVideo");

    // message listener
    messagesRef.on("value", function(snapshot) {
        $("#chat-items").html("");

        let snapshotValue = snapshot.val();
        if (snapshotValue == undefined || snapshotValue == null) {
            // no messages to load
        } else {
            let keys = Object.keys(snapshotValue);

            for (let i = 0; i < keys.length; i++) {
                let msg = snapshotValue[keys[i]];
                let senderId = msg.sender;
                let senderName = msg.senderName;
                let body = msg.body;


                if (senderId == loggedUser.id) {
                    $("#chat-items").append(`
                        <div class="bubble-sent">
                            ${ body } <sub>Sent by you</sub>
                        </div>`);
                } else {
                    $("#chat-items").append(`
                        <div class="bubble-received">
                            ${ body } <sub>Sent by ${senderName}</sub>
                        </div>`);
                }
            }

            // scroll to bottom of messages
            $("#chat-items").scrollTop($("#chat-items")[0].scrollHeight);
        }
    });

    // queue listener
    let queueRef = database.ref("/rooms/" + currentRoomKey.toString() + "/queue");
    queueRef.on("value", function(snapshot) {
        $("#queue-items").html("");

        let snapshotValue = snapshot.val();
        if (snapshotValue == undefined || snapshotValue == null) {
            // nothing to load
        } else {
            let keys = Object.keys(snapshotValue);

            for (let i = 0; i < keys.length; i++) {
                let msg = snapshotValue[keys[i]];
                let videoId = msg.videoId;
                let videoTitle = getVideoTitle(videoId);
                
                $("#queue-items").append(
                    $("<li>").append(
                        $("<a>").click(function() {
                            // add click event to switch the video


                            // set to active
                            if (!$(this).parent().hasClass("active")) {
                                // Remove the class from any other that are active
                                $("li.active").removeClass("active");
                                // And make this active
                                $(this).parent().addClass("active");
                            }

                            // send to server
                            currentVideoInfoRef.update({
                                "videoId": videoId.toString(),
                                "time": 0,
                                "videoState": "playing"
                            });

                        }).append(videoTitle)));

            }

            // scroll to bottom of messages
            $("#queue-items").scrollTop($("#queue-items")[0].scrollHeight);
        }
    });

    // current video info change listener
    currentVideoInfoRef.on("value", function(snapshot) {
        let snapshotValue = snapshot.val();
        if (snapshotValue == undefined || snapshotValue == null) {
            // nothing to load
        } else {
            let newVideoId = snapshotValue.videoId;
            let newVideoTime = parseInt(snapshotValue.time);
            let newVideoState = snapshotValue.videoState;

            if (player === null) {
                console.log("Error, player was null!");
            } else if (!youtubePlayerLoaded) {
                console.log("Error, YouTube player not loaded!");
            } else {
                sendEvents = false;
                player.cueVideoById(newVideoId);
                console.log("Server video state: " + newVideoState.toString());

                if (newVideoState == "playing" && player.getPlayerState() != 1) {
                    // auto play
                    player.playVideo();
                    // seek to location
                    player.seekTo(newVideoTime, true /*seek ahead*/);

                } else if (newVideoState == "paused" && player.getPlayerState() != 2) {
                    player.seekTo(newVideoTime, true /*seek ahead*/);
                    player.pauseVideo();
                }
                sendEvents = true;
            }
        }
    });
}

function sendMessage(msg) {
    let currentRoomKey = loggedUser.currentRoomKey;
    let currentRoomRef = database.ref("/rooms/" + currentRoomKey.toString());
    let messagesRef = database.ref("/rooms/" + currentRoomKey.toString() + "/messages");

    let message = {
        sender: loggedUser.id,
        senderName: loggedUser.name,
        body: msg
    };

    messagesRef.push(message);
}

function stateHandler(playerTime, playerState) {
    if (sendEvents) {
        let currentRoomKey = loggedUser.currentRoomKey;
        let currentRoomRef = database.ref("/rooms/" + currentRoomKey.toString());
        let messagesRef = database.ref("/rooms/" + currentRoomKey.toString() + "/messages");
        let currentVideoInfoRef = database.ref("/rooms/" + currentRoomKey.toString() + "/currentVideo");

        // send to server
        currentVideoInfoRef.update({
            "time": playerTime,
            "videoState": playerState.toString()
        });
    }
    //sendEvents = true;
}

function getVideoTitle(videoId) {

    // get title
    let youTubeURL = "https://www.googleapis.com/youtube/v3/videos?id="+ 
        videoId.toString() + "&key=" + "AIzaSyDN6w-48JzA4iqou6PqZAob7j6LrTtU0MQ" + "&part=snippet";

    let json = (function() {
        let json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': youTubeURL,
            'dataType': "json",
            'success': function(data) {
                json = data;
            }
        });
        return json;
    })();

    return json.items[0].snippet.title;
}