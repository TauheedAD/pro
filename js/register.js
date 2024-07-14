// Initialize Firebase
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
const storage = firebase.storage();


document.getElementById('subbtn').addEventListener('click', signup);
document.getElementById('profilePic').addEventListener('change', previewProfilePic);

function signup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;
    const profilePic = document.getElementById('profilePic').files[0];

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            const uid = user.uid;
            localStorage.setItem('uid' , uid)
            localStorage.setItem('username' , username)
            // Upload profile picture if selected
            if (profilePic) {
                uploadProfilePic(profilePic, username, uid);
            } else {
                saveUserData(uid, username, email, '');
            }
            ppref =  db.ref('users'+uid+'/profilePic')
            if( ppref === ""){
           ppref.set({
           profilePic:"https://firebasestorage.googleapis.com/v0/b/wirelessbuzzer-8cc9c.appspot.com/o/profile_pictures%2Fd-removebg-preview.png?alt=media&token=a6437378-6866-4223-9562-76725d3ab602"
           })

            }
        })
        .catch(error => {
            console.error('Registration error:', error.message);
            alert(error.message);
        });
}

function uploadProfilePic(file, username, uid) {
    const storageRef = storage.ref(`profile_pictures/${uid}/${file.name}`);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed',
        snapshot => {
            // Track upload progress if needed
        },
        error => {
            console.error('Error uploading profile picture:', error.message);
            saveUserData(uid, username, email, ''); // Save user data without profile picture URL
        },
        () => {
            // Upload completed successfully, get download URL
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                saveUserData(uid, username, email, downloadURL);
            });
        }
    );
}

function saveUserData(uid, username, email, profilePicURL) {
    db.ref('users/' + uid).set({
        username: username,
        email: email,
        profilePic: profilePicURL // Save profile picture URL to database
    }).then(() => {
        console.log('User registered and data saved successfully.');
        alert('User registered and data saved successfully.');

        // Optionally, you can redirect to another page
        window.location.href = "../pages/media.html";
    }).catch(error => {
        console.error('Error saving user data:', error.message);
        alert('Error saving user data:', error.message);
    });
}

function previewProfilePic(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('preview');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = '#';
        preview.style.display = 'none';
    }
}
