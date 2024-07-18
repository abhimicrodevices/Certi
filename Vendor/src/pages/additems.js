const { invoke } = window.__TAURI__.tauri;

window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".additems").addEventListener("submit", async (e) => {
      e.preventDefault();
  
      // Fetch form data
      var pname = document.getElementById("pname").value;
      var pid = document.getElementById("pid").value;
      var mname = document.getElementById("mname").value;
      var mnum = document.getElementById("mnum").value;
      var price = document.getElementById("price").value;
      var date = document.getElementById("date").value;
      var oname = document.getElementById("oname").value;
      var place = document.getElementById("place").value;
     
      // Create UserData object
      var addItem = {
        product_name: pname,
        product_id: pid,
        model_name: mname,
        model_num: mnum,
        money: price,
        mfdt: date,
        orig_man: oname,
        origin: place,
      };
  
      try {
        // Invoke the 'signup' command in Rust with the user data
        await invoke("itemdetails", { addItem: addItem});
        window.location.href="item.html";
        console.log("User data sent to Rust:", addItem);
      } catch (error) {
        console.error("Failed to send user data to Rust:", error);
      }
    });
  });
  