// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
use serde::{Deserialize, Serialize};
use std::{fs, io::{Read, Seek}};
use tauri::command;
use std::net::UdpSocket;
use std::str;
use std::sync::{Arc, Mutex};
use std::thread;
// use tauri::api::path::document_dir;
use std::io::{Write};
use std::io::SeekFrom;
use std::fs::OpenOptions;
use std::collections::HashMap;
use std::path::Path;
use serde_json::json;
use reqwest::Client;

#[derive(Debug, Serialize, Deserialize)]
struct UserData {
    name: String,
    mail: String,
    pass: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct LoginData {
    user: String,
    pass: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct VendorData {
    name: String,
    pass: String,
    vendor_name: String,
    vendor_mail: String,
    vendor_number: String,
    vendor_place: String,
    aadhar_num: String,
    company_name: String,
    company_id: String,
    company_email: String,
    company_number: String,
    est_date: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct add_item {
product_name: String,
product_id: String,
model_name: String,
model_num: String,
money: String,
mfdt: String,
orig_man: String,
origin: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct Invitation {
    #[serde(rename = "@type")]
    type_: String,
    #[serde(rename = "@id")]
    id: String,
    label: String,
    handshake_protocols: Vec<String>,
    accept: Vec<String>,
    services: Vec<String>,
}

#[derive(Deserialize, Debug)]
struct ReceiveInvitationResponse {
    state: String,
    #[serde(default)]
    created_at: Option<String>,
    #[serde(default)]
    updated_at: Option<String>,
    trace: bool,
    oob_id: String,
    invi_msg_id: String,
    invitation: Invitation,
    #[serde(default)]
    connection_id: Option<String>,
    #[serde(default)]
    role: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct Service {
    id: String,
    #[serde(rename = "type")]
    service_type: String,
    recipientKeys: Vec<String>,
    serviceEndpoint: String,
}


// #[derive(Serialize, Deserialize, Debug)]
// struct InvitationRequest {
//     state: String,
//     created_at: String,
//     updated_at: String,
//     trace: bool,
//     oob_id: String,
//     invi_msg_id: String,
//     invitation: Invitation,
//     connection_id: String,
//     our_recipient_key: String,
//     role: String,
//     multi_use: bool,
// }

#[derive(Deserialize, Debug)]
struct InvitationResponse {
    invitation: serde_json::Value,
}

#[derive(Default)]
struct AppState {
    invitation: Mutex<Option<String>>,
}

#[tauri::command]
async fn download_invitation() -> Result<String, String> {
let client = reqwest::Client::new();
let url = "http://localhost:8121/out-of-band/create-invitation?multi_use=true";
let json_body = json!({
"accept": [
"didcomm/aip1",
"didcomm/aip2;env=rfc19"
],
"alias": "Barry",
"goal": "To issue a Faber College Graduate credential",
"goal_code": "issue-vc",
"handshake_protocols": [
"https://didcomm.org/didexchange/1.0"
],
"metadata": {},
"my_label": "Invitation to Barry",
"protocol_version": "1.1",
"use_did_method": "did:peer:2",
"use_public_did": false
});
let response = match client.post(url)
.header("accept", "application/json")
.header("Content-Type", "application/json")
.json(&json_body)
.send()
.await {
Ok(res) => res,
Err(err) => return Err(format!("Failed to send request: {}", err)),

};
if response.status().is_success() {
let response_text = match response.text().await {
Ok(text) => text,
Err(err) => return Err(format!("Failed to read response text: {}", err)),
};
let invitation_response: InvitationResponse = match serde_json::from_str(&response_text) {
Ok(inv) => inv,
Err(err) => return Err(format!("Failed to deserialize response: {}", err)),
};
let invitation_json = match serde_json::to_string_pretty(&invitation_response.invitation) {
Ok(json) => json,
Err(err) => return Err(format!("Failed to serialize invitation: {}", err)),
};
 // Generate a unique filename
 let mut file_index = 0;
 let mut file_path = format!("invitation.json");

 while Path::new(&file_path).exists() {
     file_index += 1;
     file_path = format!("invitation.json({})", file_index);
 }

 match fs::write(&file_path, invitation_json) {
     Ok(()) => Ok(format!("Invitation saved to {}", file_path)),
     Err(err) => Err(format!("Failed to write to file: {}", err)),
 }
} else {
Err(format!("Failed to post message: {}", response.status()))
}
}

#[tauri::command]
async fn receive_invitation(invite_details: String) -> Result<String, String> {
    let client = reqwest::Client::new();
    let url = "http://localhost:8131/out-of-band/receive-invitation";

    let invitation_request: Invitation = serde_json::from_str(&invite_details)
        .map_err(|e| format!("Failed to parse invitation details: {}", e))?;

    // Log the invitation request for debugging
    println!("Sending invitation request: {:?}", invitation_request);

    let response = client.post(url)
        .header("accept", "application/json")
        .header("Content-Type", "application/json")
        .json(&invitation_request)
        .send()
        .await
        .map_err(|e| format!("Failed to send request: {}", e))?;

    let status = response.status();
    let response_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
    println!("Response status: {}, Response body: {}", status, response_text);

    if status.is_success() {
        match serde_json::from_str::<ReceiveInvitationResponse>(&response_text) {
            Ok(body) => {
                println!("Parsed response body: {:?}", body);
                if let Some(connection_id) = body.connection_id{
                if body.state == "deleted"{ 
                    Ok(format!("Successfully added to the network. Connection ID: {}", connection_id))
                }else {
                    Err(format!("Failed to add to the network: Unexpected state {}", body.state))
                }
            }else {
                    Err(format!("Failed to add to the network: Unexpected state {}", body.state))
                }
            }
            Err(err) => {
                println!("Failed to parse response body: {}", err);
                Err("Failed to parse response body".to_string())
            }
        }
    } else {
        Err(format!("Failed to post message: {} - {}", status, response_text))
    }
}


#[tauri::command]
fn signup(user_data: UserData) -> Result<(), String> {
    println!("Received user data: {:?}", user_data);

    // Serialize UserData to JSON
    let json_data = match serde_json::to_string(&user_data) {
        Ok(json_data) => json_data,
        Err(e) => return Err(format!("Failed to serialize user data: {}", e)),
    };

    // Read the existing file content or create a new array if the file is empty
    let file_path = "user_data.json";
    let mut file = match OpenOptions::new().read(true).write(true).create(true).open(file_path) {
        Ok(file) => file,
        Err(e) => return Err(format!("Failed to open file {}: {}", file_path, e)),
    };

    let mut file_content = String::new();
    if let Err(e) = file.read_to_string(&mut file_content) {
        return Err(format!("Failed to read file {}: {}", file_path, e));
    }

    // Check if the file is empty or contains existing data
    let mut new_content = if file_content.trim().is_empty() {
        "[".to_string()
    } else {
        file_content
    };

    // Remove the existing closing bracket if present
    if let Some(last_char) = new_content.chars().last() {
        if last_char == ']' {
            new_content.pop();
        }
    }

    // Append a comma before adding new data if the file already contains data
    if new_content != "[" {
        new_content.push(',');
    }

    // Append the new JSON data
    new_content.push_str(&json_data);

    // Append the closing bracket
    new_content.push(']');

    // Write the updated content back to the file
    if let Err(e) = file.seek(SeekFrom::Start(0)) {
        return Err(format!("Failed to seek file {}: {}", file_path, e));
    }
    if let Err(e) = file.write_all(new_content.as_bytes()) {
        return Err(format!("Failed to write data to file {}: {}", file_path, e));
    }

    // Close the file
    if let Err(e) = file.set_len(new_content.len() as u64) {
        return Err(format!("Failed to set file length {}: {}", file_path, e));
    }

    println!("User data written to {}", file_path);

    Ok(())
}
#[command]
fn login(login_data: LoginData) -> Result<(), String> {
    println!("Received login data: {:?}", login_data);

    // Load user data from the file
    let file_path = "vendor_data.json";
    let file_content = match fs::read_to_string(file_path) {
        Ok(content) => content,
        Err(e) => return Err(format!("Failed to read file {}: {}", file_path, e)),
    };

    // Deserialize user data from JSON
    let users: Vec<VendorData> = match serde_json::from_str(&file_content) {
        Ok(users) => users,
        Err(e) => return Err(format!("Failed to deserialize user data: {}", e)),
    };

    // Check if the provided credentials match any user in the user data
    let matched_user = users.iter().find(|user| {
        user.name == login_data.user && user.pass == login_data.pass
    });

    match matched_user {
        Some(_) => {
            println!("Login successful!");
            //await message('Login Sucessfull', { title: 'Login', type: 'info' });
            Ok(())
        }
        None => {
            println!("Login failed: Invalid username or password");
            Err("Invalid username or password".to_string())
        }
    }
}

#[command]
fn vendordetails(vendor_data: VendorData) -> Result<(), String> {
    println!("Received user data: {:?}", vendor_data);

    // Serialize UserData to JSON
    let json_data = match serde_json::to_string(&vendor_data) {
        Ok(json_data) => json_data,
        Err(e) => return Err(format!("Failed to serialize user data: {}", e)),
    };

    // Read the existing file content or create a new array if the file is empty
    let file_path = "vendor_data.json";
    let mut file = match OpenOptions::new().read(true).write(true).create(true).open(file_path) {
        Ok(file) => file,
        Err(e) => return Err(format!("Failed to open file {}: {}", file_path, e)),
    };

    let mut file_content = String::new();
    if let Err(e) = file.read_to_string(&mut file_content) {
        return Err(format!("Failed to read file {}: {}", file_path, e));
    }

    // Check if the file is empty or contains existing data
    let mut new_content = if file_content.trim().is_empty() {
        "[".to_string()
    } else {
        file_content
    };

    // Remove the existing closing bracket if present
    if let Some(last_char) = new_content.chars().last() {
        if last_char == ']' {
            new_content.pop();
        }
    }

    // Append a comma before adding new data if the file already contains data
    if new_content != "[" {
        new_content.push(',');
    }

    // Append the new JSON data
    new_content.push_str(&json_data);

    // Append the closing bracket
    new_content.push(']');

    // Write the updated content back to the file
    if let Err(e) = file.seek(SeekFrom::Start(0)) {
        return Err(format!("Failed to seek file {}: {}", file_path, e));
    }
    if let Err(e) = file.write_all(new_content.as_bytes()) {
        return Err(format!("Failed to write data to file {}: {}", file_path, e));
    }

    // Close the file
    if let Err(e) = file.set_len(new_content.len() as u64) {
        return Err(format!("Failed to set file length {}: {}", file_path, e));
    }

    println!("User data written to {}", file_path);

    Ok(())
}

#[command]
fn itemdetails(add_item: add_item) -> Result<(), String> {
    println!("Received user data: {:?}", add_item);

    // Serialize UserData to JSON
    let json_data = match serde_json::to_string(&add_item) {
        Ok(json_data) => json_data,
        Err(e) => return Err(format!("Failed to serialize user data: {}", e)),
    };

    // Read the existing file content or create a new array if the file is empty
    let file_path = "item_data.json";
    let mut file = match OpenOptions::new().read(true).write(true).create(true).open(file_path) {
        Ok(file) => file,
        Err(e) => return Err(format!("Failed to open file {}: {}", file_path, e)),
    };

    let mut file_content = String::new();
    if let Err(e) = file.read_to_string(&mut file_content) {
        return Err(format!("Failed to read file {}: {}", file_path, e));
    }

    // Check if the file is empty or contains existing data
    let mut new_content = if file_content.trim().is_empty() {
        "[".to_string()
    } else {
        file_content
    };

    // Remove the existing closing bracket if present
    if let Some(last_char) = new_content.chars().last() {
        if last_char == ']' {
            new_content.pop();
        }
    }

    // Append a comma before adding new data if the file already contains data
    if new_content != "[" {
        new_content.push(',');
    }

    // Append the new JSON data
    new_content.push_str(&json_data);

    // Append the closing bracket
    new_content.push(']');

    // Write the updated content back to the file
    if let Err(e) = file.seek(SeekFrom::Start(0)) {
        return Err(format!("Failed to seek file {}: {}", file_path, e));
    }
    if let Err(e) = file.write_all(new_content.as_bytes()) {
        return Err(format!("Failed to write data to file {}: {}", file_path, e));
    }

    // Close the file
    if let Err(e) = file.set_len(new_content.len() as u64) {
        return Err(format!("Failed to set file length {}: {}", file_path, e));
    }

    println!("User data written to {}", file_path);

    Ok(())
}


// #[tauri::command]
// fn get_invitation(state: tauri::State<'_, Arc<AppState>>) -> Option<String> {
//     let invitation = state.invitation.lock().unwrap();
//     invitation.clone()
// }

fn start_server(state: Arc<AppState>, address: &str) -> std::io::Result<()> {
    let socket = Arc::new(UdpSocket::bind(address)?);
    println!("Server listening on {}", address);

    let mut buffer = [0; 1024];

    loop {
        let socket = Arc::clone(&socket);
        let (size, source) = match socket.recv_from(&mut buffer) {
            Ok((size, source)) => (size, source),
            Err(e) => {
                eprintln!("Failed to receive data: {}", e);
                continue;
            }
        };

        let buffer = buffer[..size].to_vec();

        let state = Arc::clone(&state);
        thread::spawn(move || {
            handle_request(socket, state, buffer, source);
        });
    }
}

fn handle_request(socket: Arc<UdpSocket>, state: Arc<AppState>, buffer: Vec<u8>, source: std::net::SocketAddr) {
    match std::str::from_utf8(&buffer) {
        Ok(request) => {
            println!("Received request: '{}' from {}", request, source);
            let response = "Hello, client!";
            if let Err(e) = socket.send_to(response.as_bytes(), source) {
                eprintln!("Failed to send response: {}", e);
            }

            let mut invitation = state.invitation.lock().unwrap();
            *invitation = Some(request.to_string());
        }
        Err(e) => {
            eprintln!("Failed to parse request as UTF-8: {}", e);
        }
    }
}

fn main() {
    let app_state = Arc::new(AppState::default());

    let server_state = Arc::clone(&app_state);
    let server_address = "0.0.0.0:8091".to_string();
    thread::spawn(move || {
        if let Err(e) = start_server(server_state, &server_address) {
            eprintln!("Failed to start UDP server: {}", e);
        }
    });

    tauri::Builder::default()
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![            
            receive_invitation,
            download_invitation,
            signup,
            login,
            vendordetails,
            itemdetails])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
