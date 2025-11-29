# Telemost Clone

A simple, registration-free video conferencing application inspired by Yandex Telemost. Built with React, Node.js, Socket.io, and WebRTC.

## Features

*   **Instant Meetings**: Create a room with a single click. No registration required.
*   **Real-time Video & Audio**: Low-latency communication using WebRTC (Mesh topology).
*   **Controls**: Toggle microphone and camera, leave room.
*   **Fullscreen Mode**: Click on any participant's video to view in fullscreen.
*   **Shareable Links**: Copy the room link to invite others.
*   **Responsive Design**: Works on desktop and mobile (layout adapts).
*   **Dark Mode**: Modern glassmorphism UI.

## Prerequisites

*   **Node.js** (v18+ recommended) - for local development.
*   **Docker** & **Docker Compose** - for containerized deployment.

## Running Locally (Development)

1.  **Clone the repository** (if you haven't already).

2.  **Start the Backend Server**:
    ```bash
    cd server
    npm install
    npm run dev
    ```
    The server will start on `http://localhost:5000`.

3.  **Start the Frontend Client**:
    Open a new terminal window:
    ```bash
    cd client
    npm install
    npm run dev
    ```
    The client will start on `http://localhost:5173`.

4.  **Access the App**:
    Open your browser and go to `http://localhost:5173`.

## Running with Docker (Production/Deployment)

This method is recommended for deploying to a server (e.g., `rooms.weforks.org`).

1.  **Build and Start Containers**:
    From the project root directory:
    ```bash
    docker compose up --build -d
    ```

2.  **Access the App**:
    The application will be available at `http://localhost` (or your server's IP address/domain).
    *   Frontend is served on port `80`.
    *   Backend API/Socket is proxied via Nginx.

3.  **Stop Containers**:
    ```bash
    docker compose down
    ```

## Deployment Notes

*   **WebRTC & NAT**: This application uses a public STUN server (`stun:stun.l.google.com:19302`). For production use behind symmetric NATs or restrictive firewalls, you may need to configure a TURN server.
*   **HTTPS**: WebRTC requires a secure context (HTTPS) or `localhost`. If deploying to a remote server, you **MUST** set up SSL/HTTPS (e.g., using Let's Encrypt and Nginx), otherwise the browser will block camera/microphone access.
*   **Mesh Topology**: Each participant connects directly to every other participant. This works well for small groups (up to 4-5 people) but scales poorly for large meetings.

## Project Structure

*   `client/`: React frontend (Vite).
*   `server/`: Node.js/Express backend with Socket.io.
*   `docker-compose.yml`: Docker orchestration config.
