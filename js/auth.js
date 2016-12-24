var loggedUser = {};
var auth = null;
var database = null;

$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: 'AIzaSyDN6w-48JzA4iqou6PqZAob7j6LrTtU0MQ',
        authDomain: 'ytroom-a4525.firebaseapp.com',
        databaseURL: 'https://ytroom-a4525.firebaseio.com',
        storageBucket: '',
        messagingSenderId: '953784039385'
    };

    firebase.initializeApp(config);

    auth = new firebase.auth();
    database = new firebase.database();
    
    auth.onAuthStateChanged(function(user) {
        if (user !== undefined && user !== null) {
            handleLogin(user);
        }
    });

    $('#google-login').click(function() {
        signInWithGoogle(auth, database);
    });

    $('#twitter-login').click(function() {
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
        handleLogin(result);
    }).catch(function(error) {
        alert(error.toString());
    });
}

function handleLogin(result) {
    var usersRef = database.ref('/users');

    usersRef.once('value').then(function(snapshot) {
        var isNewUser = true;
        var foundUser = snapshotHasProperty(snapshot, { uid: result.uid });
        if (!foundUser) {
            loggedUser = addNewUser(result, usersRef);
        } else {
            loggedUser = foundUser;
            isNewUser = false;
        }
        afterLogin(isNewUser);
    });
}

function afterLogin(newUser) {
    if (newUser) {
        $('#good-to-go-window').show();
    } else {
        $('#welcome-back-window').show();
    }

    $('#nav-links').show();
    $('#login-window').hide();
}

function addNewUser(result, ref) {
    var user = {
        name:  result.displayName,
        uid: result.uid
    };

    var userRef = ref.push(user);
    user.key = userRef.key;
    return user;
}
