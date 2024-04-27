// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, addDoc, doc, runTransaction, writeBatch } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { arrayUnion } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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
// Assume the current user's username is stored in the session storage
//const currentUsername = sessionStorage.getItem('username');
const username = sessionStorage.getItem('username');
console.log(username);

const currentUsername = "User 1"
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const closeButton = document.querySelector('.close-button');
    const friendPopup = document.getElementById('add-friend-popup');
    const userSearchPopup = document.getElementById('popup-user-search');
    const searchResultsContainer = document.getElementById('users-list');

    searchButton.addEventListener('click', () => {
        friendPopup.style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
        friendPopup.style.display = 'none';
    });

    userSearchPopup.addEventListener('keyup', async (e) => {
        const searchQuery = e.target.value.trim();
        searchResultsContainer.innerHTML = ''; // Clear previous results

        if (searchQuery) {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("name", "==", searchQuery));

            try {
                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    // Handle case where there are no results
                    searchResultsContainer.innerHTML = '<p>No users found.</p>';
                    return;
                }

                querySnapshot.forEach((doc) => {
                    const userItem = createUserItem(doc.data());
                    searchResultsContainer.appendChild(userItem);
                });
            } catch (error) {
                // Handle any errors during the search
                console.error("Error searching users:", error);
                searchResultsContainer.innerHTML = '<p>Error during search. Please try again.</p>';
            }
        }
    });
});

function createUserItem(userData) {
    const userItem = document.createElement('div');
    userItem.className = 'user-item';

    const userCircle = document.createElement('div');
    userCircle.className = 'user-item-circle';
    userCircle.style.backgroundColor = userData.colorPreference; // Set color from user data

    const userName = document.createElement('div');
    userName.textContent = userData.name; // Set name from user data

    const addButton = document.createElement('button');
        addButton.textContent = 'Add';
        addButton.className = 'add-friend-button'; // Assign a class for styling and identification
        addButton.onclick = function() {
            addFriend(userData); // Function to handle adding a friend
        };

        userItem.appendChild(userCircle);
        userItem.appendChild(userName);
        userItem.appendChild(addButton); // Add the button to the user item

        return userItem;
}

// First, let's create a function to find a user document by its unique name
async function getUserDocIdByName(db, name) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("name", "==", name));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        // Assuming name is unique, there should be only one document.
        return querySnapshot.docs[0].id;
    } else {
        // No user found with this name.
        throw new Error(`No user found with name ${name}`);
    }
}

async function addFriend(userData) {
    try {
        // Get the document IDs for both users.
        const currentUserDocId = await getUserDocIdByName(db, username);
        const otherUserDocId = await getUserDocIdByName(db, userData.name);

        const currentUserRef = doc(db, "users", currentUserDocId);
        const otherUserRef = doc(db, "users", otherUserDocId);

        // Start a batch write to ensure atomicity
        const batch = writeBatch(db);

        // Add other user's name to current user's friends list
        batch.update(currentUserRef, {
            friends: arrayUnion(userData.name)
        });

        // Add current user's name to other user's friends list
        batch.update(otherUserRef, {
            friends: arrayUnion(currentUsername)
        });

        // Commit the batch
        await batch.commit();
        console.log('Both users have been added as friends');
    } catch (error) {
        console.error("Error adding friends:", error);
    }
}
