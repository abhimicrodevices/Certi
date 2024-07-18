async function validateCertificate() {
    var certNumber = document.getElementById("certNumber").value;

    try {
        // Prepare data to send to Rust function
        var requestData = {
            certNumber: certNumber
        };

        // Invoke the 'verify_certificate' command in Rust with requestData
        const result = await window.__TAURI__.tauri.invoke("verify_certificate", requestData);
        const validationResult = JSON.parse(result);

        // Check result and display appropriate alert
        if (validationResult.status === "valid") {
            showAlert("Certificate Verified", "success");
        } else {
            showAlert("Certificate Not Found", "error");
        }

    } catch (error) {
        console.error("Failed to validate certificate:", error);
        showAlert("Error validating certificate", "error");
    }
}

function showAlert(message, type) {
    Swal.fire({
        title: message,
        icon: type,
        confirmButtonText: 'OK'
    });
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("submit-btn").addEventListener("click", function(event) {
        event.preventDefault();
        validateCertificate();
    });
});
