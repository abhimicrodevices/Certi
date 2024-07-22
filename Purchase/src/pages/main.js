const { invoke } = window.__TAURI__.tauri;
window.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Fetch form data
    var fullname = document.getElementById("fname").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("pass").value;
   
    // Create UserData object
    var userData = {
      name: fullname,
      mail: email,
      pass: password
    };

    try {
      // Invoke the 'signup' command in Rust with the user data
      await invoke("signup", { userData: userData });
      window.location.href="connect.html";
      console.log("User data sent to Rust:", userData);
    } catch (error) {
      console.error("Failed to send user data to Rust:", error);
    }
  });
});