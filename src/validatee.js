document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("verify-form").addEventListener("submit", function(event) {
        event.preventDefault();
        validateCertificate();
    });
});

async function validateCertificate() {
    var certNumber = document.getElementById("certNumber").value;

    try {
        // Prepare data to send to Rust function (not applicable in this example)
        var requestData = {
            certNumber: certNumber
        };

        // Simulate loading data.json (replace with actual fetch call in real application)
        const response = await fetch('data.json');
        const vendors = await response.json();

        // Check if certNumber exists in vendors
        var is_valid = vendors.some(function(vendor) {
            return vendor.certificateType === certNumber;
        });

        // Display alert based on validation
        if (is_valid) {
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
