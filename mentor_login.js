import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
        import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
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
        const loginButton = document.getElementById("loginButton");

        // Add click event listener to the login button
        loginButton.addEventListener("click", async () => {
            try {
                var email = document.getElementById("email").value;
                var password = document.getElementById("password").value;

                // Firebase authentication
                const credentials = await signInWithEmailAndPassword(auth, email, password);

                console.log("Credentials after login:", credentials);

                const userUid = credentials.user.uid;
                console.log("User UID:", userUid);

                // Retrieve additional user data from the database
                const snapshot = await get(child(dbref, 'mentors/' + userUid));

                console.log("Snapshot after retrieving user data:", snapshot.val());

                if (snapshot.exists() && snapshot.val() !== null) {
                    const userInformation = {
                        userId: userUid,
                        email: snapshot.val().email,
                        firstName: snapshot.val().firstName,
                        lastName: snapshot.val().lastName,
                        contact: snapshot.val().contact,
                        specialization: snapshot.val().specialization,
                        qualification: snapshot.val().qualification,
                        experience: snapshot.val().experience,
                        availabilityFrom: snapshot.val().availabilityFrom,
                        availabilityTo: snapshot.val().availabilityTo,
                        linkedin: snapshot.val().linkedin
                    };

                    // Store user information in local storage
                    localStorage.setItem('userInformation', JSON.stringify(userInformation));

                    // Handle successful login
                    alert("Login is Successful.");
                    window.location.href = 'mentor.html'; // Update to the correct page for mentors
                } else {
                    // Invalid login, user data not found
                    alert("Error: Invalid login. User data not found.");
                }
            } catch (error) {
                // Handle sign-in errors
                alert("Error: Unable to sign in. Please check your credentials and try again.");
                console.error("Sign-in error:", error);
            }
        });