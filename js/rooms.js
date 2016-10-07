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
            thisRoomUsersRef.push("Me!");
        }
    });
});