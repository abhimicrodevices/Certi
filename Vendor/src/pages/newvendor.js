const { invoke } = window.__TAURI__.tauri;

window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".vendorreg").addEventListener("submit", async (e) => {
        e.preventDefault();

        // Fetch form data
        var fullname = document.getElementById("username").value;
        var pass = document.getElementById("password").value;
        var vname = document.getElementById("vname").value;
        var email = document.getElementById("email").value;
        var vnum = document.getElementById("num").value;
        var place = document.getElementById("place").value;
        var anum = document.getElementById("anum").value;
        var cname = document.getElementById("cname").value;
        var cid = document.getElementById("cid").value;
        var cemail = document.getElementById("cemail").value;
        var cnum = document.getElementById("cnum").value;
        var cdate = document.getElementById("cdate").value;

        // Create UserData object
        var vendorData = {
            name: fullname,
            pass: pass,
            vendor_name: vname,
            vendor_mail: email,
            vendor_number: vnum,
            vendor_place: place,
            aadhar_num: anum,
            company_name: cname,
            company_id: cid,
            company_email: cemail,
            company_number: cnum,
            est_date: cdate
        };

        try {
            // Invoke the 'vendordetails' command in Rust with the user data
            await invoke("vendordetails", { vendorData: vendorData });
            window.location.href = "connect.html";
            console.log("User data sent to Rust:", vendorData);
        } catch (error) {
            console.error("Failed to send user data to Rust:", error);
        }
    });
});
