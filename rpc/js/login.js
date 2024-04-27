// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyDLHUMYvjs2zDyKMYNcEdIKd_6V3i9EKzc",
authDomain: "distributed-project-32dc4.firebaseapp.com",
projectId: "distributed-project-32dc4",
storageBucket: "distributed-project-32dc4.appspot.com",
messagingSenderId: "368318225640",
appId: "1:368318225640:web:b5d6054a9ca63ddfbfbd5d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//get ref to database services
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const usernameHint = document.getElementById('usernameHint');
    const passwordHint = document.getElementById('passwordHint');

    async function validateUsernameAndPassword() {
        const username = usernameInput.value;
        const password = passwordInput.value;
        const userQuery = query(collection(db, "users"), where("name", "==", username));
        const querySnapshot = await getDocs(userQuery);

        if (querySnapshot.empty) {
            usernameHint.style.display = 'block';
            usernameHint.textContent = "Username does not exist.";
            return false;
        }

        let isPasswordValid = false;
        querySnapshot.forEach(doc => {
            const userData = doc.data();
            if (userData.password === password) {
                isPasswordValid = true;
            }
        });

        passwordHint.style.display = isPasswordValid ? 'none' : 'block';
        if (!isPasswordValid) {
            passwordHint.textContent = 'Incorrect password.';
        }
        return isPasswordValid;
    }

    async function updateButtonState() {
        const isFormValid = await validateUsernameAndPassword();
        loginButton.disabled = !isFormValid;
        loginButton.style.opacity = isFormValid ? '1' : '0.5';
    }

    usernameInput.addEventListener('input', updateButtonState);
    passwordInput.addEventListener('input', updateButtonState);

    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission
        if (await validateUsernameAndPassword()) {
            const username = usernameInput.value;
            sessionStorage.setItem('username', username);
            window.location.href = 'homepageindex.html'; // Redirect to home page if valid
        }
    });
});