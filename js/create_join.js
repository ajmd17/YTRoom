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

                        // navigate to url
                        //window.location.href = "room.html";

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
});

function loadRoomContent() {
    loadYouTubePlayer();

    for (let i = 0; i < 12; i++) {
        sendDummyMessage("BLARG!");
    }

    let currentRoomKey = loggedUser.currentRoomKey;
    let currentRoomRef = database.ref("/rooms/" + currentRoomKey.toString());
    let messagesRef = database.ref("/rooms/" + currentRoomKey.toString() + "/messages");

    // load all messages in the room
    messagesRef.on("value", function(snapshot) {
        let snapshotValue = snapshot.val();
        if (snapshotValue == undefined || snapshotValue == null) {
            // no messages to load
        } else {
            let keys = Object.keys(snapshotValue);

            for (let i = 0; i < keys.length; i++) {
                let msg = snapshotValue[keys[i]];
                let senderId = msg.sender;
                let body = msg.body;

                // add message element
                if (senderId == loggedUser.id) {
                    // sent by us
                    $("#chat-items").append(`
                        <p class="triangle-border right">
                            ${ body } <sub>Sent by you</sub>
                        </p>`);
                } else {
                    // sent by another user
                    $("#chat-items").append(`
                        <p class="triangle-border left">
                            ${ body } <sub>Sent by ${ senderId.toString() }</sub>
                        </p>`);
                }
            }
        }
    });
}

function sendDummyMessage(msg) {
    let currentRoomKey = loggedUser.currentRoomKey;
    let currentRoomRef = database.ref("/rooms/" + currentRoomKey.toString());
    let messagesRef = database.ref("/rooms/" + currentRoomKey.toString() + "/messages");

    let message = {
        sender: loggedUser.id,
        body: msg
    };

    messagesRef.push(message);
}