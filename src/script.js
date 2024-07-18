const { invoke } = window.__TAURI__.tauri;
const body = document.querySelector("body");
    const modeToggle = body.querySelector(".mode-toggle");
    const sidebar = body.querySelector("nav");
    const sidebarToggle = body.querySelector(".sidebar-toggle");

    let getMode = localStorage.getItem("mode");
    if (getMode && getMode === "dark") {
        body.classList.toggle("dark");
    }

    let getStatus = localStorage.getItem("status");
    if (getStatus && getStatus === "close") {
        sidebar.classList.toggle("close");
    }

    modeToggle.addEventListener("click", () => {
        body.classList.toggle("dark");
        if (body.classList.contains("dark")) {
            localStorage.setItem("mode", "dark");
        } else {
            localStorage.setItem("mode", "light");
        }
    });

    sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
        if (sidebar.classList.contains("close")) {
            localStorage.setItem("status", "close");
        } else {
            localStorage.setItem("status", "open");
        }
    });
    
document.addEventListener('DOMContentLoaded', () => {
    const toast = document.getElementById('network-toast');
    const toastMessage = document.getElementById('network-toast-message');
    const networkIcon = document.getElementById('network-icon');

    function showToast(message, iconClass, statusClass) {
        toastMessage.textContent = message;
        networkIcon.className = iconClass;
        toast.className = `network-toast visible ${statusClass}`; // Set the appropriate class

        // Hide the toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('visible');
            toast.classList.add('hidden');
        }, 3000);
    }

    function updateNetworkStatus() {
        if (navigator.onLine) {
            showToast("You're online now", "uil uil-wifi", "online"); // Green for online
        } else {
            showToast("You're offline now", "uil uil-wifi-slash", "offline"); // Red for offline
        }
    }

    // Initial check
    updateNetworkStatus();

    // Add event listeners for network status changes
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
});

function dismissToast() {
    const toast = document.getElementById('network-toast');
    toast.classList.remove('visible');
    toast.classList.add('hidden');
}