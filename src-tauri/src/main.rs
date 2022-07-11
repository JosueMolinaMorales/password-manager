#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use serde_json::{json, Value};
use tauri::api::{http::{ClientBuilder, HttpRequestBuilder, Body, ResponseType, ResponseData}, Error};

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![login])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}!", name)
}

#[tauri::command]
async fn login(username: &str, password: &str) -> Result<Value, String> {
  let client = ClientBuilder::new().build().unwrap();
  let req_body = json!({"username": username, "password": password});
  println!("{:?}", req_body);
  let response = client.send(
    HttpRequestBuilder::new("POST", "http://localhost:8000/auth/login")
    .unwrap()
    .body(Body::Json(req_body))
    .response_type(ResponseType::Json)  
  ).await;
  match response {
    Ok(res) => {
      match res.read().await {
        Ok(value) => {
          return Ok(value.data.to_owned());
        },
        Err(error) => {
          return Err(error.to_string())
        }
      }
    },
    Err(error) => {
      return Err(error.to_string())
    }
  }

}