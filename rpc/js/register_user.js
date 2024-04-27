// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
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
    const colorPicker = document.getElementById('colorPicker');

    colorPicker.addEventListener('input', function() {
        const selectedColor = colorPicker.value;
        console.log('Color selected: ', selectedColor);
        // You can now use `selectedColor` in your JavaScript code.
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('password_confirm');

    const registerButton = document.getElementById('registerButton');

    const usernameHint = document.getElementById('userHint');
    const emailHint = document.getElementById('emailHint');
    const passwordHint = document.getElementById('passwordHint');
    const passwordConfirmHint = document.getElementById('passwordConfirmHint');

    function validateEmail() {
        const isValidEmail = emailInput.checkValidity();
        emailHint.style.display = isValidEmail ? 'none' : 'block';
        return isValidEmail;
    }

    function validatePassword() {
        const passwordValue = passwordInput.value;
        const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/.test(passwordValue);
        passwordHint.style.display = isValidPassword ? 'none' : 'block';
        return isValidPassword;
    }

    function validatePasswordConfirm() {
        const passwordValue = passwordInput.value;
        const passwordConfirmValue = passwordConfirmInput.value;
        const isPasswordConfirmValid = passwordValue === passwordConfirmValue;
        passwordConfirmHint.style.display = isPasswordConfirmValid ? 'none' : 'block';
        return isPasswordConfirmValid;
    }

    function updateButtonState() {
        const isFormValid = validateEmail() && validatePassword() && validatePasswordConfirm();
        registerButton.disabled = !isFormValid;
        registerButton.style.opacity = isFormValid ? '1' : '0.37';
    }

    emailInput.addEventListener('input', updateButtonState);
    passwordInput.addEventListener('input', updateButtonState);
    passwordConfirmInput.addEventListener('input', updateButtonState);

    document.getElementById('userForm').addEventListener('submit', async function(event) { // Make this function async
        event.preventDefault(); // Prevent the default form submission

        if (usernameInput.value && validateEmail() && validatePassword() && validatePasswordConfirm()) {
            // Check if the name already exists in the database
            const userQuery = query(collection(db, "users"), where("name", "==", usernameInput.value));
            const querySnapshot = await getDocs(userQuery); // Using await here is now valid

            if (!querySnapshot.empty) {
                console.error("A user with this name already exists.");
                usernameHint.style.display = 'block';
                usernameHint.textContent = "This username is already taken.";
                return; // Stop the function if the name already exists
            }

            // Add new user if name does not exist
            addDoc(collection(db, "users"), {
                name: usernameInput.value,
                email: emailInput.value,
                colorPreference: colorPicker.value,
                password: passwordInput.value,
                friends: []
            }).then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                const username = usernameInput.value;
                sessionStorage.setItem('username', username);
                window.location.href = 'homepageindex.html'; // Redirect to home page if valid
            }).catch((error) => {
                console.error("Error adding document: ", error);
            });
        }
    });

});
