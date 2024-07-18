// index.js

// Function to display notifications
function displayNotification(message) {
    const notificationContainer = document.getElementById('notification-container');
    const notificationElement = document.createElement('div');
    notificationElement.classList.add('notification');
    notificationElement.textContent = message;
    notificationContainer.appendChild(notificationElement);
}

// Listen for messages from Tauri backend and display notifications
window.__TAURI__.invoke('receive_invitation').then(() => {
    window.__TAURI__.listen('messageFromServer', (message) => {
        console.log('Received from Tauri:', message);
        displayNotification(message);
    });
}).catch((error) => {
    console.error('Error communicating with Tauri:', error);
});
