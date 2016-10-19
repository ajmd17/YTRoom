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

    $("#github-login").click(signInWithGithub);
});

function signInWithGoogle(auth, database) {
    let provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider).then(function(result) {
        let usersRef = database.ref("/users");
        let token = result.credential.accessToken;
        let user = result.user;

        usersRef.once("value").then(function(snapshot) {
            let snapshotValue = snapshot.val();

            if (!snapshotValue) {
                loggedUser = addNewUser(result, usersRef);
                $("#good-to-go-window").show();
            } else {
                let previousUser = findPreviousUser(result, snapshotValue);
                if (previousUser !== null) {
                    loggedUser = previousUser;
                    $("#welcome-back-window").show();
                } else {
                    loggedUser = addNewUser(result, usersRef);
                    $("#good-to-go-window").show();
                }
            }

            $("#login-window").hide();
        });

    }).catch(function(error) {
        alert(error.toString());
    });
}

function signInWithGithub() {

}

function addNewUser(result, ref) {
    let user = {
        name:  result.user.displayName,
        email: result.user.email
    };

    let userRef = ref.push(user);
    user.id = userRef.key;
    return user;
}

function findPreviousUser(result, snapshotValue) {
    // look through users to find if this
    // user was logged in previously
    let keys = Object.keys(snapshotValue);
    for (let i = 0; i < keys.length; i++) {
        let userIt = snapshotValue[keys[i]];
        if (userIt.email == result.user.email) {
            let res = userIt;
            res.id = keys[i];
            // user was found
            return res;
        }
    }

    return null;
}
