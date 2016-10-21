function generateRoomId() {
    return Math.random().toString(36).substr(2, 8);
}

function getDate() {
    let now = new Date();
    let date = now.getFullYear() + "/" + ("0" + (now.getMonth() + 1)).slice(-2) + "/" + ("0" + now.getDate()).slice(-2);
    let time = now.getHours() + ":" + ("0" + now.getMinutes()).slice(-2);
    return date + " " + time;
}

// attrib is an object containing the key and value
// of what to search for like so
// { "email": "blahblah@blah.com" }
function snapshotHasProperty(snapshot, attrib) {
    if (!snapshot) {
        return null;
    }

    let snapshotValue = snapshot.val();
    if ((snapshotValue !== undefined && snapshotValue !== null) &&
            Object.keys(snapshotValue).length != 0) {

        let attribKeys = Object.keys(attrib);
        let attribKey = attribKeys[0].toString();
        let attribVal = attrib[attribKey];

        let snapshotKeys = Object.keys(snapshotValue);

        for (let i = 0; i < snapshotKeys.length; i++) {
            let curObject = snapshotValue[snapshotKeys[i]];
            if (curObject[attribKey] == attribVal) {
                curObject.key = snapshotKeys[i];
                return curObject;
            }
        }
    }

    return null;
}
