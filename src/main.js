const { invoke } = window.__TAURI__.tauri;

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".login").addEventListener("submit", async (e) => {
    e.preventDefault();
    var username = document.getElementById("user").value;
    var passw= document.getElementById("passw").value;
    var loginData = {
      user: username,
      pass:passw
    };
    function displayErrorMessage(error) {
      const errorContainer = document.getElementById('error-container');
      //errorContainer.textContent = `Failed to send login data to Rust: ${error.message}`;
  }
    try {
      // Invoke the 'signup' command in Rust with the user data
      await invoke("login", { loginData: loginData });
      window.location.href="home.html";
      console.log("Login data sent to Rust:", loginData);
    } catch (error) {
      console.error("failed login :", error);
      displayErrorMessage(error);
    }
  });
});