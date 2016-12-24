function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// generates a random name for a room using a list of random words
function generateRoomId() {
    var randString = '';
    var numWords = getRandom(2, 4);
    
    for (var i = 0; i < numWords; i++) {
        var word = words[getRandom(0, words.length)];
        randString += word.charAt(0).toUpperCase() + word.slice(1);
    }

    return randString;
}

function getDate() {
    var now = new Date();
    var date = now.getFullYear() + '/' + ('0' + (now.getMonth() + 1)).slice(-2) + '/' + ('0' + now.getDate()).slice(-2);
    var time = now.getHours() + ':' + ('0' + now.getMinutes()).slice(-2);
    return date + ' ' + time;
}

// attrib is an object containing the key and value
// of what to search for like so
// { 'email': 'blahblah@blah.com' }
function snapshotHasProperty(snapshot, attrib) {
    if (!snapshot) {
        return null;
    }

    var snapshotValue = snapshot.val();
    if (snapshotValue) {
        var snapshotKeys = Object.keys(snapshotValue);
        if (snapshotKeys.length) {
            var attribKeys = Object.keys(attrib);
            var attribKey = attribKeys[0].toString();
            var attribVal = attrib[attribKey];
            var curObject = null;

            for (var i = 0; i < snapshotKeys.length; i++) {
                curObject = snapshotValue[snapshotKeys[i]];
                if (curObject[attribKey] == attribVal) {
                    curObject.key = snapshotKeys[i];
                    return curObject;
                }
            }
        }
    }

    return null;
}
