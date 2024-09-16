import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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

// Use an observer to listen for changes in the authentication state
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("Logged in user ID:", user.uid); // Add this line
        const userId = user.uid;

        const menteeRef = ref(db, `mentees/${userId}`);

        onValue(menteeRef, (snapshot) => {
            const menteeData = snapshot.val();

            if (menteeData) {
                displayMenteeDetails(menteeData);
            } else {
                alert("No mentee data found for user ID: " + userId); // Updated alert
            }
        }, (error) => {
            console.error("Error getting mentee data:", error);
            alert("Error getting mentee data. Please try again later.");
        });
    } else {
        alert("User is not logged in.");
    }
});


function displayMenteeDetails(menteeData) {
    const menteeDetailsContainer = document.getElementById('menteeDetails');

    const detailsHTML = `
       <p>Full Name: ${menteeData.firstname} ${menteeData.lastname}</p> 
       <p>Email: ${menteeData.email}</p>
        <!-- Add more mentee details as needed -->
    `;

    menteeDetailsContainer.innerHTML = detailsHTML;
}
