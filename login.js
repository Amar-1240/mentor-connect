import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, get, ref, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDElLEEJWjV_uWEJ-fLKG0Y2bHmTwUcyuY",
    authDomain: "mentor-4e047.firebaseapp.com",
    projectId: "mentor-4e047",
    storageBucket: "mentor-4e047.appspot.com",
    messagingSenderId: "440085603152",
    appId: "1:440085603152:web:17ca5509febfc3471e0255"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);
const dbref = ref(db);

var Email = document.getElementById("email");
var Password = document.getElementById("password");
var MainForm = document.getElementById("mainform");

// Function to handle login form submission
let SignInUser = evt => {
    evt.preventDefault();

    signInWithEmailAndPassword(auth, Email.value, Password.value)
        .then((credentials) => {
            console.log("Credentials after login:", credentials);

            const userUid = credentials.user.uid;
            console.log("User UID:", userUid);

            get(child(dbref, 'mentees/' + userUid)).then((snapshot) => {
                console.log("Snapshot after retrieving user data:", snapshot.val());

                if (snapshot.exists() && snapshot.val() !== null) {
                    const userInformation = {
                        email: snapshot.val().email,
                        firstname: snapshot.val().firstname,
                        lastname: snapshot.val().lastname
                    };

                    console.log("User Information:", userInformation);

                    // Set the 'isLoggedIn' flag in localStorage
                    localStorage.setItem('isLoggedIn', 'true');

                    // Store user credentials and information in sessionStorage
                    sessionStorage.setItem("user-creds", JSON.stringify(credentials));
                    sessionStorage.setItem("user-info", JSON.stringify(userInformation));

                    // Show success message and redirect to home.html
                    alert("Login successful!");
                    window.location.href = 'home.html';
                } else {
                    // Invalid login, user data not found
                    alert("Error: Invalid login. Mentee data not found.");
                }
            });
        })
        .catch((error) => {
            // Handle sign-in errors
            alert("Error: Unable to sign in. Please check your credentials and try again.");
            console.error("Sign-in error:", error);
        });
}

// Event listener for the login form submission
MainForm.addEventListener('submit', SignInUser);
