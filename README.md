# 🎥 WFORK Rooms

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![React](https://img.shields.io/badge/frontend-React_19-61DAFB.svg?logo=react)
![Node](https://img.shields.io/badge/backend-Node.js-339933.svg?logo=nodedotjs)
![Socket.io](https://img.shields.io/badge/realtime-Socket.io-010101.svg?logo=socketdotio)
![Docker](https://img.shields.io/badge/deployment-Docker-2496ED.svg?logo=docker)

**WFORK Rooms** is a sleek, registration-free video conferencing application designed for instant communication. Inspired by the simplicity of Yandex Telemost, it allows you to create a room and invite others with a single click. No sign-ups, no downloads, just pure connection.

---

## ✨ Features

*   **🚀 Instant Access**: Create a secure room in seconds. No registration or login required.
*   **📹 High-Quality Video & Audio**: Powered by WebRTC for low-latency, real-time communication (Mesh topology).
*   **🖥️ Screen Sharing**: Share your screen effortlessly for presentations or collaboration.
*   **🔍 Fullscreen Mode**: Focus on what matters. Click any video to toggle fullscreen, or use the dedicated button.
*   **🌓 Modern UI**: A beautiful, responsive interface featuring a glassmorphism design and dark mode by default.
*   **📱 Mobile Friendly**: Fully responsive layout that adapts perfectly to mobile devices and tablets.
*   **🔗 Easy Sharing**: One-click link copying to invite peers instantly.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | Built with React 19 and Vite for blazing fast performance. |
| **Backend** | ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express&logoColor=white) | Robust Node.js server handling signaling and room management. |
| **Real-time** | ![Socket.io](https://img.shields.io/badge/-Socket.io-010101?style=flat-square&logo=socketdotio&logoColor=white) | WebSocket-based signaling for instant peer discovery. |
| **Media** | ![WebRTC](https://img.shields.io/badge/-WebRTC-333333?style=flat-square&logo=webrtc&logoColor=white) | Peer-to-peer audio, video, and data transmission. |
| **DevOps** | ![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white) | Containerized application for easy deployment and scalability. |

---

## 🚀 Getting Started

### Prerequisites

*   **Docker** & **Docker Compose** (Recommended for deployment)
*   **Node.js** (v18+) (For local development)

### 🐳 Run with Docker (Recommended)

The easiest way to run WFORK Rooms is using Docker Compose. This will set up both the client and server containers.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/wfork-rooms.git
    cd wfork-rooms
    ```

2.  **Start the application**:
    ```bash
    docker compose up --build -d
    ```

3.  **Access the app**:
    Open your browser and navigate to `http://localhost`.

    *   **Frontend**: Served on port `80` (via Nginx).
    *   **Backend**: Proxied internally.

4.  **Stop the application**:
    ```bash
    docker compose down
    ```

### 💻 Run Locally (Development)

If you want to contribute or modify the code, you can run the services individually.

1.  **Start the Backend**:
    ```bash
    cd server
    npm install
    npm run dev
    ```
    *Server runs on `http://localhost:5000`*

2.  **Start the Frontend**:
    Open a new terminal:
    ```bash
    cd client
    npm install
    npm run dev
    ```
    *Client runs on `http://localhost:5173`*

3.  **Open in Browser**:
    Visit `http://localhost:5173` to see your changes live.

---

## 📂 Project Structure

```
wfork-rooms/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components (Room, Landing, etc.)
│   │   ├── App.jsx         # Main App Component
│   │   └── main.jsx        # Entry Point
│   ├── Dockerfile          # Client Docker config
│   └── vite.config.js      # Vite configuration
├── server/                 # Node.js Backend
│   ├── index.js            # Main Server Entry (Socket.io logic)
│   └── Dockerfile          # Server Docker config
├── docker-compose.yml      # Docker Orchestration
└── README.md               # Project Documentation
```

---

## ⚠️ Deployment Notes

*   **HTTPS is Required**: For WebRTC to work over the internet (not localhost), your site **must** be served over HTTPS. Browsers block camera/microphone access on insecure HTTP origins.
*   **NAT Traversal**: The default configuration uses a public Google STUN server. For production environments with strict firewalls or symmetric NATs, setting up a TURN server (like coturn) is highly recommended.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.
