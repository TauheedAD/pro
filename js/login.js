const firebaseConfig = {
    apiKey: "AIzaSyAExyhvCIwBR2b6jaGqfB4iYDkETj2Mumc",
    authDomain: "wirelessbuzzer-8cc9c.firebaseapp.com",
    databaseURL: "https://wirelessbuzzer-8cc9c-default-rtdb.firebaseio.com",
    projectId: "wirelessbuzzer-8cc9c",
    storageBucket: "wirelessbuzzer-8cc9c.appspot.com",
    messagingSenderId: "664946324918",
    appId: "1:664946324918:web:9ccb94594b6a4e25193d17"
};


firebase.initializeApp(firebaseConfig);


const auth = firebase.auth();
const db = firebase.database();

document.getElementById('subbtn').addEventListener('click', login);

// Login function
// Function to handle login
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log('Logged in successfully:', user.uid);

            // Fetch username from database
            db.ref('users/' + user.uid + '/username').once('value')
                .then((snapshot) => {
                    const username = snapshot.val();
                    console.log('Username:', username);

                    // Store user details in localStorage
                    localStorage.setItem('uid', user.uid);
                    localStorage.setItem('username', username);

                    // Redirect to desired page after successful login
                    window.location.href = "../pages/media.html";
                })
                .catch((error) => {
                    console.error('Error fetching username:', error.message);
                    // Handle error fetching username
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Login error:', errorMessage);
            alert(errorMessage);
        });
}
