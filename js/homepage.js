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



document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('send-button');
    const postContent = document.getElementById('post-content');
    const tagsContainer = document.querySelector('.tags-selection');
    let tags = document.querySelectorAll('.tag'); // This can now be updated
    const tagOutput = document.getElementById('tag-output');
    const newLabelButton = document.getElementById('new-label-button'); // The button to add new label
    //const newLabelDisplay = document.getElementById('new-label-display'); // The display area for the new label
    const searchBox = document.getElementById('search-box');
    const searchButton = document.getElementById('search-button');
    // Event listener for the New label button
    newLabelButton.addEventListener('click', () => {
        const newLabel = prompt("Enter new label:");
        // Check if newLabel is not null, undefined, or an empty string
        if (newLabel && newLabel.trim() !== "") {
            const newTagButton = createTagButton(newLabel.trim());
            tagsContainer.insertBefore(newTagButton, newLabelButton); // Insert before the New label button
            tags = document.querySelectorAll('.tag'); // Update the NodeList with the new tag
            // Ensure the new label is shown in the tag output area
            handleTagOutputDisplay(`+ ${newLabel.trim()}`);
        }
    });

// Helper function to create a new tag button
    const createTagButton = (label) => {
        const button = document.createElement('button');
        button.textContent = `+ ${label}`;
        button.classList.add('tag');
        button.addEventListener('click', handleTagClick);
        return button;
    };


    searchButton.addEventListener('click', function() {
        const searchTerm = searchBox.value.trim();
        if (searchTerm) {
            const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(searchTerm)}`;
            window.open(wikiUrl, '_blank');  // Opens the Wikipedia page in a new tab
        } else {
            alert('Please enter a search term.');
        }
    });

    function handleTagClick() {
        if (this === newLabelButton) {
            return;
        }
        if (this.classList.contains('selected')) {
            // If the tag is already selected and is clicked, remove the selection
            this.classList.remove('selected');
            this.disabled = false;
            handleTagOutputDisplay(''); // Clear the tag output display

            // Re-enable all tags since no tag is selected now
            tags.forEach(t => t.disabled = false);
        } else {
            // Disable all tags and remove 'selected' from any tag that has it
            tags.forEach(t => {
                t.classList.remove('selected');
                t.disabled = true;
            });

            // Add 'selected' to the clicked tag and enable it
            this.classList.add('selected');
            this.disabled = false;

            // Update the tag output display
            handleTagOutputDisplay(this.textContent.replace('+ ', ''));
        }
    }

    function handleTagOutputDisplay(tagText) {
        const tagOutput = document.getElementById('tag-output');
        if (tagOutput) {
            tagOutput.textContent = tagText;
            tagOutput.style.display = 'flex'; // Show or hide based on tag text
        }
    }

    const ws = new WebSocket('ws://127.0.0.1:8080');

    // 当WebSocket收到消息时处理
    ws.onmessage = function (event) {
        if (event.data instanceof Blob) {
            // 如果收到的数据是一个Blob，我们需要将其转换成文本
            const reader = new FileReader();
            reader.onload = function () {
                // 读取完成后，我们可以尝试将这个文本解析为JSON
                const text = reader.result;
                try {
                    const data = JSON.parse(text);
                    if (data.type === 'post') {
                        addPostToDisplay(data.content, data.tag);
                    }
                } catch (e) {
                    console.error("Error parsing message:", e);
                }
            };
            reader.readAsText(event.data);
        } else {
            // 如果数据不是Blob，直接打印错误信息
            console.error('Received data is not a Blob.');
        }
    };

    sendButton.addEventListener('click', () => {
        const content = postContent.value.trim();
        const selectedTag = document.querySelector('.tag.selected')?.textContent.replace('+ ', '') || '';

        if (!content) {
            alert("Please write something to post.");
            return;
        }

        const postData = {
            type: 'post',
            username: username,
            content: content,
            tag: selectedTag
        };

        ws.send(JSON.stringify(postData));  // 发送帖子数据到 WebSocket 服务器

        postContent.value = ''; // 清空输入框
        handleTagOutputDisplay(''); // 清空标签输出显示

        tags.forEach(t => {
            t.classList.remove('selected');
            t.disabled = false;
        });
    });

    // 重新添加对标签的监听
    tags.forEach(tag => tag.addEventListener('click', handleTagClick));

    // 检查并更新新标签显示区
    const newLabelDisplay = document.getElementById('new-label-display');
    if (newLabelDisplay) {
        newLabelDisplay.textContent = 'New label'; // 重置新标签显示区内容
    }



    // sendButton.addEventListener('click', () => {
    //     const content = postContent.value.trim();
    //     const selectedTag = document.querySelector('.tag.selected')?.textContent.replace('+ ', '') || '';

    //     if (!content) {
    //         alert("Please write something to post.");
    //         return;
    //     }

    //     // Mock the fetch call for testing
    //     setTimeout(() => {
    //         const mockData = { status: 'success', content: content, tag: selectedTag };
    //         addPostToDisplay(mockData.content, mockData.tag);
    //         postContent.value = ''; // Clear the textarea after posting
    //         handleTagOutputDisplay(''); // Clear the tag output display

    //         // Re-enable all tags and remove 'selected' class from any tag that has it
    //         tags.forEach(t => {
    //             t.classList.remove('selected');
    //             t.disabled = false;
    //         });
    //     }, 100);
    //     // Comment out the actual fetch request for now
    //     // fetch('/post', {
    //     //     method: 'POST',
    //     //     headers: {
    //     //         'Content-Type': 'application/x-www-form-urlencoded',
    //     //     },
    //     //     body: `content=${encodeURIComponent(content)}&tag=${encodeURIComponent(selectedTag)}`
    //     // })
    //     // .then(response => response.json())
    //     // .then(data => {
    //     //     if (data.status === 'success') {
    //     //         addPostToDisplay(data.content, data.tag);
    //     //         postContent.value = ''; // Clear the textarea after posting
    //     //         tags.forEach(t => t.disabled = false); // Re-enable all tags
    //     //     }
    //     // });
    // });
    // tags.forEach(tag => tag.addEventListener('click', handleTagClick));
    // const newLabelDisplay = document.getElementById('new-label-display');
    // if (newLabelDisplay) {
    //     newLabelDisplay.textContent = 'New label'; // Reset the new label display area
    // }
});



function addPostToDisplay(content, tag) {
    const postDisplay = document.querySelector('.post-display');
    const newPost = document.createElement('div'); // Use div for individual post box
    newPost.classList.add('post');

    // Create a map of tags to colors
    const tagColors = {
        "Happy": "#A8E6CF",
        "Angry": "#FF8B94",
        "Sad": "#b4ebff",
        "Depressed": "#7facd7",
        "Anxious": "#FFECB8",
        "Nervous": "#ffdc82",
        // Add more tags and colors as needed
    };

    newPost.style.width = '550px'; // Adjust width as required
    // Height will be automatic
    newPost.style.marginBottom = '20px';
    newPost.style.padding = '10px';
    newPost.style.borderRadius = '10px';
    newPost.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    newPost.style.overflow = 'hidden'; // Prevents content from spilling out

    // Map tags to background colors
    newPost.style.backgroundColor = tagColors[tag] || "#cce8b5"; // Use the tag to set the background color

    // Set the inner HTML of the post
    newPost.innerHTML = `<h3>${tag}</h3><p>${content}</p>`;

    postDisplay.appendChild(newPost); // Adds the new post at the end
}

