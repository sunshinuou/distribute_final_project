
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
    const doctorNameInput = document.getElementById('doctorName');
    const emailInput = document.getElementById('email');
    const instituteInput = document.getElementById('institute');
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('password_confirm');

    const registerButton = document.getElementById('registerButton');

    const doctorNameHint = document.getElementById('doctorHint');
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

    document.getElementById('doctorForm').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission

        if (doctorNameInput.value && validateEmail() && instituteInput.value && validatePassword() && validatePasswordConfirm()) {
            // Check if the name already exists in the database
            const doctorQuery = query(collection(db, "doctors"), where("name", "==", doctorNameInput.value));
            const querySnapshot = await getDocs(doctorQuery);

            if (!querySnapshot.empty) {
                console.error("A doctor with this name already exists.");
                doctorNameHint.style.display = 'block';
                doctorNameHint.textContent = "This username is already taken.";
                return; // Stop the function if the name already exists
            }

            // Add new doctor if name does not exist
            addDoc(collection(db, "doctors"), {
                name: doctorNameInput.value,
                email: emailInput.value,
                institute: instituteInput.value,
                colorPreference: colorPicker.value,
                password: passwordInput.value
            }).then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                window.location.href = 'homepageindex.html'; // Redirect to home page if valid
            }).catch((error) => {
                console.error("Error adding document: ", error);
            });
        }
    });

});
