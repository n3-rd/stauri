// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[macro_use]
extern crate lazy_static;

use id3::{Tag, TagLike};
use serde::{Deserialize, Serialize};
use std::fs;
use std::fs::File;
use std::io::BufReader;
use std::sync::Arc;
use rodio::{Decoder, Sink};
use axum::{
    http::{HeaderValue, Method},
    routing::get,
    Router,
};
use tower_http::{services::{ServeDir, ServeFile}};
use tower_http::cors::CorsLayer;

#[tokio::main]
async fn main() {
    tauri::Builder::default()
      .setup(|app| {
        #[cfg(target_os = "linux")]
        tokio::spawn(async move {
          let serve_dir = ServeDir::new("/");
  
          let axum_app = Router::new()
            .nest_service("/", serve_dir)
            .layer(
              CorsLayer::new()
                .allow_origin("*".parse::<HeaderValue>().unwrap())
                .allow_methods([Method::GET])
            );
  
          axum::Server::bind(&"127.0.0.1:16780".parse().unwrap())
            .serve(axum_app.into_make_service()).await.unwrap();
        });
  
        Ok(())
      })
      .invoke_handler(tauri::generate_handler![
        get_audio_metadata,
        play_audio,
        pause_audio,
        convert_file_src_2
      ])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}

#[derive(Serialize, Deserialize)]
struct Metadata {
    title: Option<String>,
    artist: Option<String>,
    album: Option<String>,
    duration: Option<String>,
    year: Option<i32>,
    picture: Option<Vec<u8>>
}

#[tauri::command]
fn get_audio_metadata(file_path: String) -> Result<Metadata, String> {
    let file = File::open(&file_path).map_err(|err| err.to_string())?;
    let tag = Tag::read_from(&file).map_err(|err| err.to_string())?;

    let title = tag.title().map(|s| s.to_string());
    let artist = tag.artist().map(|s| s.to_string());
    let album = tag.album().map(|s| s.to_string());
    let duration = tag.duration().map(|d| d.to_string());
    let year = tag.year().map(|y| y as i32);

     // get picture
     let picture = tag.pictures().next().map(|p| p.data.to_vec());

    Ok(Metadata {
        title,
        artist,
        album,
        duration,
        year,
        picture
    })
}

// Global audio sink
lazy_static! {
    static ref AUDIO_SINK: Arc<Sink> = {
        let (_stream, stream_handle) = rodio::OutputStream::try_default().unwrap();
        Arc::new(Sink::try_new(&stream_handle).unwrap())
    };
}

#[tauri::command]
fn play_audio(file_path: String) -> Result<(), String> {
    let file = File::open(&file_path).map_err(|err| err.to_string())?;
    let source = Decoder::new(BufReader::new(file)).map_err(|err| err.to_string())?;
    AUDIO_SINK.append(source);
    Ok(())
}

#[tauri::command]
fn pause_audio() -> Result<(), String> {
    if AUDIO_SINK.empty() {
        Err("No audio is currently playing".to_string())
    } else {
        AUDIO_SINK.pause();
        Ok(())
    }
}

#[tauri::command]
fn convert_file_src_2(path: String) -> String {
  format!("http://localhost:16780{}", path)
}