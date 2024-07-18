const { invoke } = window.__TAURI__.tauri;

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("load-invitation-button").addEventListener("click", async () => {
        try {
            const response = await invoke("get_invitation");
            console.log("Invitation details fetched:", response);

            // Parse the JSON response
            let responseData;
            try {
                responseData = JSON.parse(response);
            } catch (error) {
                console.error("Failed to parse JSON response:", error);
                alert("Failed to parse JSON response. Please try again.");
                return;
            }

            // Check if 'invitation' field exists in responseData
            if (responseData && responseData.invitation) {
                const invitation = responseData.invitation;

                // Convert invitation object back to JSON string format
                const displayText = JSON.stringify(invitation, null, 2);

                // Display the invitation details in textarea
                document.getElementById("invitationTextarea").value = displayText;
            } else {
                console.error("Invalid response or missing invitation details:", response);
                alert("Invalid response or missing invitation details.");
            }
        } catch (error) {
            console.error("Failed to fetch invitation details:", error);
            alert("Failed to fetch invitation details: " + error);
        }
    });
    document.getElementById("submit-button").addEventListener("click", async (e) => {
        e.preventDefault();
        console.log("Submit button clicked");

        // Get the value from the textarea
        const inviteDetails = document.getElementById("invitationTextarea").value.trim();
        console.log("Invite details to send: ", inviteDetails);

        try {
            // Invoke the Rust function with the invitation details as a string
            const result = await invoke("receive_invitation", { invite_details: inviteDetails });
            console.log("Invitation details sent to Rust backend:", result);
            alert(result);
            window.location.href = 'item.html';
        } catch (error) {
            console.error("Failed to send invitation details to Rust backend:", error);
            alert("Failed to send invitation: " + error);
        }
    });
    
});
