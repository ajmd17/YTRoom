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

    let auth = new firebase.auth();
    let database = new firebase.database();

    $("#google-login").click(function() { 
        signInWithGoogle(auth, database); 
    });

    $("#github-login").click(signInWithGithub);
});

function signInWithGoogle(auth, database) {
    let provider = new firebase.auth.GoogleAuthProvider();

    let loggedUser = {};

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

            console.log("Success");
            console.log(loggedUser);

            // redirect to main page
            window.location.href = "index.html";
        });

    }).catch(function(error) {
        console.log("Error!");
        console.log(error);
    });
}

function signInWithGithub() {

}