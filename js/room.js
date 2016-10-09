$(document).ready(function() {
    if (loggedUser == undefined || loggedUser == null) {
        // user should not be on this page
        alert("Woah, slow down there partner!");
    } else {
        // retrieve current room from database
        let currentRoomKey = loggedUser.currentRoomKey;
        alert("Your room is: " + currentRoomKey.toString());
    }
});