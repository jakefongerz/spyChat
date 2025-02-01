# Spy Chat 🔐💬

Spy Chat is a real-time encrypted messaging application built using **Socket.IO, React, Express, and TypeScript**. Messages are encrypted with a passphrase before being sent, and recipients must enter the correct passphrase to decrypt and read them. Without the correct passphrase, messages remain unreadable!

## 📌 Features
- 🔗 **Real-time messaging** using WebSockets (Socket.IO)
- 🔐 **End-to-end encryption** with user-supplied passphrases
- 🎨 **Neatly styled UI** for a smooth user experience
- 🚀 **Single-page application** hosted by the Express backend
- 🔑 **Decryption on click** – enter the passphrase to decode a message
- ⚡ **Built with TypeScript** for type safety and scalability

## 🛠️ Tech Stack
- **Frontend:** React, TypeScript
- **Backend:** Express, Socket.IO
- **Encryption:** Any symmetric encryption algorithm (e.g., CryptoJS)

## 🚀 Getting Started
1. Fork/Clone this repository
2. Run `npm install` in the server directory
3. Run `npm install` in the client directory
4. Create a file called `.env` in the server directory and copy the contents of `.env.example` into it. DON'T RENAME THE EXAMPLE FILE.
5. Run `npm run dev` in the server directory
6. Run `npm run dev` in the client directory
7. Open your browser to `http://localhost:3000`
Make sure are running the server and client in separate terminals.