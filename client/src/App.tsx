import { useEffect, useState } from 'react'
import './App.css'
import { socket } from './socket'
import CryptoJS from "crypto-js";

// Encrypts a message using AES encryption
function encryptMessage(message: string, key: string): string {
    return CryptoJS.AES.encrypt(message, key).toString();
}
// Decrypts an encrypted message using AES decryption
function decryptMessage(encryptedMessage: string, key: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}



function App() {
  const [message, setMessage] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [messageRecieved, setMessageRecieved] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [decodedMessages, setDecodedMessages] = useState<string[]>([]);

  const [connected, setConnected] = useState(socket.connected);

const displayMessages = () => { 
  return messages.map((message, index) => {
    return <div key={index} className='msg'>
      <button onClick={() => {
        const passcode = prompt("Enter the key to decrypt the message:")  as string;
        if (passcode == secretKey) {
          const decryptedMessage = decryptMessage(message, passcode);
          setMessages(messages.filter((_, i) => i !== index));
          setDecodedMessages([...decodedMessages, decryptedMessage]);
        }
        else {
          // TODO: Create toeast notification
          alert("Invalid key");
          console.log("passcode" + passcode + "secretKey" + secretKey); 
        }
      }}>{message}</button>
    </div>

  });
}

const displayDecodedMessages = () => { 
  return decodedMessages.map((message, index) => {
    return <div key={index}className='msg'>
      {message}
    </div>
  }
  );
}

const sendMessage = () => {
  const encryptedMessage = encryptMessage(message, secretKey); 
  socket.emit('send_message', { message: encryptedMessage });
}

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      setConnected(true);
    });


    socket.on('recieve_message', (data) => {
      messages.push(data.message);
      setMessageRecieved(data.message);});
      console.log(messages);


    return () => {
      socket.disconnect();
      socket.off('connect');
    }
  }, []);

  return (
    <>
      <h1 style={{ color: 'rebeccapurple' }}>Spy Chat</h1>
      <div className="card">
      
        <div>
        <input type="text" placeholder='Message...'
        onChange={(event) => {
          setMessage(event.target.value);
        }} />
        <input type="text" placeholder='Secret Key...'        
        onChange={(event) => {
          setSecretKey(event.target.value);
        }} />
        <button onClick={sendMessage}>Send</button>
        </div>
        <div>
          <h2>Decoded Messages</h2>
          {displayDecodedMessages()}
        </div>
        <div>
          <h2>Encrypted Messages</h2>
          {displayMessages()}
          </div>
      </div>
    </>
  )
}

export default App
