import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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

const Firstname = document.getElementById("firstname");
const Lastname = document.getElementById("lastname");
const Email = document.getElementById("email");
const Password = document.getElementById("password");
const MainForm = document.getElementById("mainform");

let RegisterUser = async evt => {
    evt.preventDefault();

    try {
        // Create user with email and password
        const credentials = await createUserWithEmailAndPassword(auth, Email.value, Password.value);

        // Store user data in the database with the "patient" role
        await set(ref(db, 'mentees/' + credentials.user.uid), {
            uid: credentials.user.uid,
            firstname: Firstname.value,
            lastname: Lastname.value,
            email: Email.value,
            role: "mentee" // Add the "role" field with value "patient"
            // Add other user data as needed
        });

        // Redirect to home.html after successful registration
        window.location.href = 'home.html';
        alert("Account created successfully!");

        // Clear input values after successful registration
        Firstname.value = '';
        Lastname.value = '';
        Email.value = '';
        Password.value = '';

    } catch (error) {
        const errorCode = error.code;
        if (errorCode === "auth/email-already-in-use") {
            alert("This email is already associated with an existing account.");
        } else {
            alert(error.message);
        }
        console.error(error.code);
        console.error(error.message);
    }
}

MainForm.addEventListener('submit', RegisterUser);
