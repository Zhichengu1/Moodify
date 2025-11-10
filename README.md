# Moodify

Moodify is a web application that generates Spotify playlists based on the user's current mood. Users can log in with Spotify, select their mood, and receive a curated playlist with previews of tracks. Premium users can optionally save the playlist directly to their Spotify account.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Spotify API Integration](#spotify-api-integration)
- [Hosting](#hosting)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Project Overview
Moodify allows users to quickly generate playlists that match their current mood or activity. It leverages the Spotify Web API to fetch tracks, generate playlists, and optionally save them to a user’s account. The app features a modern, dark-themed interface built with React and Tailwind CSS and a Python Flask backend for handling Spotify OAuth and API calls.

---

## Features
- **Mood-based playlist generation**: Choose moods such as happy, sad, chill, workout, or study.
- **Spotify login for users**: OAuth login via Spotify.
- **Preview playback**: Listen to short previews of songs before saving.
- **Playlist creation**: (Optional) Save playlists directly to Spotify for Premium users.
- **Customizable playlist length**: Optionally specify the number of songs in a playlist.
- **Favorite-style suggestions**: Generate playlists based on the user's preferred genres and favorite tracks.

---

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: Python, Flask, Spotipy
- **Database**: Optional (SQLite / Redis for session or user data)
- **APIs**: Spotify Web API

---

## Setup & Installation

### Prerequisites
- Node.js & npm installed
- Python 3.8+ installed
- Spotify Developer account

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/moodify.git
   cd moodify/backend
