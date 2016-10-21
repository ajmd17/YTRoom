// global variable to hold the current room
let currentRoomRef = null;

$(document).ready(function() {
    $("#content").click(function() {
        // if we get the #content's click event it means
        // that the youtube player element is hidden, by pausing it.
        // therefore, play the youtube video.
        playVideo(true);
        $("#paused-bg").hide();
        $("#player").show();

        // change sidebar play icon
        if ($("#i-video-state").hasClass("fa-pause")) {
            $("#i-video-state").removeClass("fa-pause");
            $("#i-video-state").addClass("fa-play");
            $("#i-video-state").css({ "color": "#00e673" });
        }
    });

    $("#i-video-state").click(function() {
        if (curState == PlayState.PLAYING) {
            pauseVideo(true);
        } else {
            playVideo(true);
        }
    });

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
            // set the global variable currentRoomRef
            currentRoomRef = roomRef.push(roomData);

            // enter the room
            enterRoom(roomData);

            $("#good-to-go-window").hide();
            $("#welcome-back-window").hide();
            $("#room-content").show();

            // load the content
            loadRoomContent();
        }
    });

    $("#join-modal-link").click(function() {
        // hide the error, in the case that it was previously visible
        $("#room-join-error").hide();
        $("#join-modal").modal("show");
    });

    $("#join-room-btn").click(function() {
        let roomKey = $("#room-key").val();

        // check the database for rooms with the key
        let roomsRef = database.ref("/rooms");
        roomsRef.once("value").then(function(snapshot) {
            let foundRoom = snapshotHasProperty(snapshot, {
                "id": roomKey
            });

            if (!foundRoom) {
                // error joining room
                $("#room-join-error").show();
            } else {
                let maxWatchers = foundRoom.max;
                let watchers = foundRoom.watchers;
                let numWatchers = (watchers != null) ? Object.keys(watchers).length : 0;

                // TODO: move this to the enterRoom() function.
                if (numWatchers >= maxWatchers) {
                    // cannot join, room is full
                    $("#room-join-error").show();
                } else {
                    // set the global variable currentRoomRef
                    currentRoomRef = roomsRef.child(foundRoom.key);
                    enterRoom(foundRoom);

                    // show the room content
                    $("#good-to-go-window").hide();
                    $("#welcome-back-window").hide();
                    $("#room-content").show();
                    loadRoomContent();

                    // hide the modal box
                    $("#join-modal").modal("hide");
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
            let queueRef = currentRoomRef.child("queue");

            // push the object
            queueRef.push({
                videoId: youtubeVideoId
            });

            // close this modal
            $("#add-video-modal").modal("hide");
        }
    });

    $("#room-history-link").click(function() {
        // clear the room history items
         $("#room-history-items").find("tr:gt(0)").remove();

        // load room history items
        if (loggedUser.roomHistory === undefined) {
            $("#room-history-items").append($("<tr>").append("No history"));
        } else {
            let keys = Object.keys(loggedUser.roomHistory);
            // for now, print the key of each previous room
            for (let i = 0; i < keys.length; i++) {
                let curRoom = loggedUser.roomHistory[keys[i]];
                $("#room-history-items").append(
                    $("<tr>").append($("<td>").append(curRoom.name))
                             .append($("<td>").append(keys[i]))
                             .append($("<td>").append(curRoom.dateJoined)));
            }
        }

        $("#room-history-modal").modal("show");
    });
});

function loadRoomContent() {
    loadYouTubePlayer();

    let messagesRef = currentRoomRef.child("messages");
    let queueRef = currentRoomRef.child("queue");
    let watchersRef = currentRoomRef.child("watchers");
    let currentVideoInfoRef = currentRoomRef.child("currentVideo");

    // message listener
    messagesRef.on("value", function(snapshot) {
        // clear the html of the chat items
        $("#chat-items").html("");

        let snapshotValue = snapshot.val();
        if (snapshotValue) {
            let keys = Object.keys(snapshotValue);

            for (let i = 0; i < keys.length; i++) {
                let msg = snapshotValue[keys[i]];
                let senderId = msg.sender;
                let senderName = msg.senderName;
                let body = msg.body;

                if (senderId == loggedUser.key) {
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
    queueRef.on("value", function(snapshot) {
        // clear queue
        $("#queue-items").html("");

        let snapshotValue = snapshot.val();
        if (!snapshotValue || Object.keys(snapshotValue).length == 0) {
            $("#queue-items").append($("<li>").append("No videos in queue"));
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

                            // send to server the current video info
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

    // watcher listener
    watchersRef.on("value", function(snapshot) {
        // clear watcher list
        $("#watchers-items").html("");

        let snapshotValue = snapshot.val();
        if (snapshotValue) {
            let keys = Object.keys(snapshotValue);
            for (let i = 0; i < keys.length; i++) {
                let watcherInfo = snapshotValue[keys[i]];
                // add the user to the sidebar
                $("#watchers-items").append(
                    $("<li>").append(watcherInfo.name));
            }
        }
    });

    // current video info change listener
    currentVideoInfoRef.on("value", function(snapshot) {
        let snapshotValue = snapshot.val();
        if (snapshotValue) {
            let newVideoId = snapshotValue.videoId;
            let newVideoTime = parseInt(snapshotValue.time);
            let newVideoState = snapshotValue.videoState;
            let actionTriggeredBy = snapshotValue.actionTriggeredBy;

            if (player === null) {
                console.log("Error, player was null!");
            } else if (!youtubePlayerLoaded) {
                console.log("Error, YouTube player not loaded!");
            } else {
                player.cueVideoById(newVideoId);

                if (newVideoState == "playing") {
                    playVideo(false);
                    // seek to location
                    player.seekTo(newVideoTime, true);

                    // show the 'paused' background
                    $("#paused-bg").hide();
                    $("#player").show();

                    // change sidebar play icon
                    if ($("#i-video-state").hasClass("fa-pause")) {
                        $("#i-video-state").removeClass("fa-pause");
                        $("#i-video-state").addClass("fa-play");
                        $("#i-video-state").css({ "color": "#00e673" });
                    }

                } else if (newVideoState == "paused") {
                    player.seekTo(newVideoTime, true);
                    pauseVideo(false);

                    // show the 'paused' background
                    $("#paused-bg").show();
                    $("#player").hide();
                    $("#paused-text").html(`
                        Paused by <b>${actionTriggeredBy}</b>.<br>
                        Click here to resume.`);

                    // change sidebar button to a paused icon
                    if ($("#i-video-state").hasClass("fa-play")) {
                        $("#i-video-state").removeClass("fa-play");
                        $("#i-video-state").addClass("fa-pause");
                        $("#i-video-state").css({ "color": "gray" });
                    }
                }
            }
        }
    });
}

function enterRoom(room) {
    let loggedUserRef = database.ref("/users").child(loggedUser.key);
    let watchersRef = currentRoomRef.child("watchers");

    // update the user's history
    if (loggedUser.roomHistory == undefined) {
        loggedUser.roomHistory = {};
    }

    loggedUser.roomHistory[room.id.toString()] = {
        name: room.name,
        dateJoined: getDate()
    };
    loggedUserRef.child("/roomHistory/").update(loggedUser.roomHistory);

    // add user to watchers in this room
    // first make sure it isn't already there
    watchersRef.once("value", function(snapshot) {
        if (!snapshotHasProperty(snapshot, { "key": loggedUser.key })) {
            watchersRef.push({
                key: loggedUser.key,
                name: loggedUser.name,
                email: loggedUser.email
            });
        }
    });
}

// send a chat message to the room
function sendMessage(msg) {
    let messagesRef = currentRoomRef.child("messages");

    messagesRef.push({
        sender: loggedUser.key,
        senderName: loggedUser.name,
        body: msg
    });
}

function stateHandler(playerTime, playerState) {
    let messagesRef = currentRoomRef.child("messages");
    let currentVideoInfoRef = currentRoomRef.child("currentVideo");

    // send to server
    currentVideoInfoRef.update({
        "time": playerTime,
        "videoState": playerState.toString(),
        "actionTriggeredBy": loggedUser.name.toString()
    });
}

function getVideoTitle(videoId) {
    // get title
    let dataUrl = "https://www.googleapis.com/youtube/v3/videos?id=" +
        videoId.toString() + "&key=" + "AIzaSyDN6w-48JzA4iqou6PqZAob7j6LrTtU0MQ" + "&part=snippet";

    let json = null;

    $.ajax({
        "async": false,
        "global": false,
        "url": dataUrl,
        "dataType": "json",
        "success": function(data) {
            json = data;
        }
    });

    return json.items[0].snippet.title;
}
