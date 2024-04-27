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

const username = sessionStorage.getItem('username');
console.log(username);

document.addEventListener('DOMContentLoaded', async function() {
    const doctorsListContainer = document.getElementById('doctors-list');
    const doctorSearchInput = document.getElementById('doctor-search');

    // Fetch and display doctors
    async function displayDoctors() {
        const querySnapshot = await getDocs(collection(db, "doctors"));
        const doctors = [];
        querySnapshot.forEach((doc) => {
            doctors.push(doc.data());
        });

        // Sort the doctors by name in ascending order
        doctors.sort((a, b) => a.name.localeCompare(b.name));

        // Clear existing list
        doctorsListContainer.innerHTML = '';

        // Create the list item for each doctor
        doctors.forEach((doctor) => {
            const doctorItem = document.createElement('div');
            doctorItem.classList.add('doctor-item');

            // Create and style the circle
            const circle = document.createElement('div');
            circle.classList.add('doctor-item-circle');
            circle.style.backgroundColor = doctor.colorPreference; // Use the color preference

            // Create and add the name span
            const name = document.createElement('span');
            name.textContent = doctor.name;

            // Append circle and name to the list item
            doctorItem.appendChild(circle);
            doctorItem.appendChild(name);

            // Append the list item to the container
            doctorsListContainer.appendChild(doctorItem);
        });
    }

    // Listen for input event on search and filter the displayed list
    doctorSearchInput.addEventListener('input', async function() {
        const searchTerm = doctorSearchInput.value.toLowerCase();
        const querySnapshot = await getDocs(collection(db, "doctors"));
        doctorsListContainer.innerHTML = ''; // Clear the list for new filtered results

        querySnapshot.forEach((doc) => {
            const doctorName = doc.data().name.toLowerCase();
            // Only add doctors that match the search term
            if (doctorName.includes(searchTerm)) {
                const doctorItem = document.createElement('div');
                doctorItem.classList.add('doctor-item');

                const circle = document.createElement('div');
                circle.classList.add('doctor-item-circle');
                circle.style.backgroundColor = doc.data().colorPreference; // Use the color preference

                const name = document.createElement('span');
                name.textContent = doc.data().name;

                doctorItem.appendChild(circle);
                doctorItem.appendChild(name);
                doctorsListContainer.appendChild(doctorItem);
            }
        });
    });
    await displayDoctors(); // Call this function to display doctors when the page loads
});
