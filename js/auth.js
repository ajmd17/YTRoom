let loggedUser = {};

let auth = null;
let database = null;

$(document).ready(function() {
    // Initialize Firebase
    let config = {
        apiKey: "AIzaSyDN6w-48JzA4iqou6PqZAob7j6LrTtU0MQ",
        authDomain: "ytroom-a4525.firebaseapp.com",
        databaseURL: "https://ytroom-a4525.firebaseio.com",
        storageBucket: "",
        messagingSenderId: "953784039385"
    };

    firebase.initializeApp(config);

    auth = new firebase.auth();
    database = new firebase.database();

    $("#google-login").click(function() {
        signInWithGoogle(auth, database);
    });

    $("#twitter-login").click(function() {
        signInWithTwitter(auth, database);
    });
});

function signInWithGoogle(auth, database) {
    signIn(auth, database, new firebase.auth.GoogleAuthProvider());
}

function signInWithTwitter(auth, database) {
    signIn(auth, database, new firebase.auth.TwitterAuthProvider());
}

function signIn(auth, database, provider) {
    auth.signInWithPopup(provider).then(function(result) {
        console.log("Got result: " + JSON.stringify(result).toString());
        let usersRef = database.ref("/users");
        let token = result.credential.accessToken;
        let user = result.user;

        usersRef.once("value").then(function(snapshot) {
            let foundUser = snapshotHasProperty(snapshot, { "uid": result.user.uid });
            if (!foundUser) {
                loggedUser = addNewUser(result, usersRef);
                $("#good-to-go-window").show();
                $("#nav-links").show();
            } else {
                loggedUser = foundUser;
                $("#welcome-back-window").show();
                $("#nav-links").show();
            }

            $("#login-window").hide();
        });

    }).catch(function(error) {
        alert(error.toString());
    });
}

function addNewUser(result, ref) {
    let user = {
        name:  result.user.displayName,
        uid: result.user.uid
    };

    let userRef = ref.push(user);
    user.key = userRef.key;
    return user;
}
