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


    // for testing!!!

/*
            $("#login-window").hide();
            $("#good-to-go-window").hide();
            $("#room-content").show();*/
});

function signInWithGoogle(auth, database) {
    let provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider).then(function(result) {
        
        let usersRef = database.ref("/users");
        let token = result.credential.accessToken;
        let user = result.user;

        usersRef.once("value").then(function(snapshot) {
            // TODO: check for previous login
            loggedUser = {
                "name": result.user.displayName,
                "email": result.user.email
            };

            let res = usersRef.push(loggedUser);
            loggedUser.id = res.key;
            
            console.log(loggedUser);

            $("#login-window").hide();
            $("#good-to-go-window").show();
        });

    }).catch(function(error) {
        alert(error.toString());
    });
}

function signInWithGithub() {

}