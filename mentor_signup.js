import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDElLEEJWjV_uWEJ-fLKG0Y2bHmTwUcyuY",
    authDomain: "mentor-4e047.firebaseapp.com",
    projectId: "mentor-4e047",
    storageBucket: "mentor-4e047.appspot.com",
    messagingSenderId: "440085603152",
    appId: "1:440085603152:web:17ca5509febfc3471e0255"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

document.addEventListener("DOMContentLoaded", function () {
    populateTimeOptions();

    document.getElementById("mainform").addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const mentorData = Object.fromEntries(formData);

        // Validate required fields
        if (!mentorData.email || !mentorData.password || !mentorData.fname || !mentorData.lname) {
            alert("Please fill out all required fields.");
            return;
        }

        const profilePictureFile = document.getElementById("profilePicture").files[0];
        const certificateFile = document.getElementById("certificate").files[0];

        if (!profilePictureFile || !certificateFile) {
            alert("Please upload both profile picture and certificate.");
            return;
        }

        // Convert 12-hour time format to 24-hour format
        const availabilityFrom = convertTo24HourFormat(
            mentorData.timeFromHour,
            mentorData.timeFromMinute,
            mentorData.timeFromPeriod
        );
        const availabilityTo = convertTo24HourFormat(
            mentorData.timeToHour,
            mentorData.timeToMinute,
            mentorData.timeToPeriod
        );

        // Check time range validity
        if (availabilityFrom >= availabilityTo) {
            alert("Invalid time range. 'From' time must be earlier than 'To' time.");
            return;
        }

        // Create mentor account with email and password
        createUserWithEmailAndPassword(auth, mentorData.email, mentorData.password)
            .then((userCredential) => {
                const user = userCredential.user;
                const mentorRef = ref(database, 'mentors/' + user.uid);

                // Upload profile picture and certificate to Firebase Storage
                const profilePictureRef = storageRef(storage, `mentors/${user.uid}/profilePicture`);
                const certificateRef = storageRef(storage, `mentors/${user.uid}/certificate`);

                Promise.all([
                    uploadFile(profilePictureRef, profilePictureFile),
                    uploadFile(certificateRef, certificateFile)
                ]).then(([profilePictureURL, certificateURL]) => {
                    // Store mentor details in Firebase database with profile picture and certificate URLs
                    return set(mentorRef, {
                        firstName: mentorData.fname,
                        lastName: mentorData.lname,
                        gender: mentorData.gender,
                        specialization: mentorData.specialization,
                        priorExperience: mentorData.priorExperience === "on",  // Convert checkbox value
                        qualification: mentorData.qualification,
                        contact: mentorData.contact,
                        linkedin: mentorData.linkedin,
                        availabilityFrom: availabilityFrom,
                        availabilityTo: availabilityTo,
                        interest: mentorData.interest,
                        mentoringReason: mentorData.mentoringReason,
                        aiUse: mentorData.aiUse,
                        email: mentorData.email,
                        profilePictureURL: profilePictureURL, // Store profile picture URL
                        certificateURL: certificateURL, // Store certificate URL
                        uid: user.uid
                    });
                }).then(() => {
                    alert("Registration successful!");
                    window.location.href = "homepage.html";
                }).catch((error) => {
                    console.error("Error saving data:", error);
                    alert("Error: " + error.message);
                });
            })
            .catch((error) => {
                console.error("Error creating user:", error);
                alert("Error creating account: " + error.message);
            });
    });
});

// Helper function to upload files to Firebase Storage
function uploadFile(storageReference, file) {
    return uploadBytes(storageReference, file)
        .then(() => getDownloadURL(storageReference))
        .catch((error) => {
            console.error("Error uploading file:", error);
            throw new Error("Failed to upload file.");
        });
}

// Populate the time dropdowns with hours and minutes
function populateTimeOptions() {
    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = Array.from({ length: 60 }, (_, i) => i < 10 ? '0' + i : i);

    const hourSelects = document.querySelectorAll('select[id$="Hour"]');
    const minuteSelects = document.querySelectorAll('select[id$="Minute"]');

    hourSelects.forEach(select => {
        hours.forEach(hour => {
            select.add(new Option(hour, hour));
        });
    });

    minuteSelects.forEach(select => {
        minutes.forEach(minute => {
            select.add(new Option(minute, minute));
        });
    });
}

// Convert 12-hour time format to 24-hour format
function convertTo24HourFormat(hour, minute, period) {
    let hour24 = parseInt(hour, 10);

    if (period === 'PM' && hour24 !== 12) {
        hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
        hour24 = 0;
    }

    return `${hour24.toString().padStart(2, '0')}:${minute}`;
}
