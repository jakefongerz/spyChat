import { useEffect, useState } from 'react'
import './App.css'
import { socket } from './socket'
import CryptoJS from "crypto-js";
import { ToastContainer, toast } from 'react-toastify';



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
  const notify = () => toast("Incorrect key!");
  const [message, setMessage] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [messageRecieved, setMessageRecieved] = useState({message: String, secretKey: String});
  const [messages, setMessages] = useState<{ message: string; secretKey: string }[]>([]);
  const [decodedMessages, setDecodedMessages] = useState<string[]>([]);
  const [connected, setConnected] = useState(socket.connected);
  




const displayMessages = () => { 
  return messages.map((data, index) => {
    return <div key={index} className='msg'>
      <button onClick={() => {
        const passcode = prompt("Enter the key to decrypt the message:")  as string;
        if (passcode == data.secretKey) {
          const decryptedMessage = decryptMessage(data.message, data.secretKey);
          setDecodedMessages([...decodedMessages, decryptedMessage]);
          setMessages(messages.filter((_, msgIndex) => msgIndex !== index));

        }
        else {
          
          //alert("Invalid key");
          console.log("passcode: \'" + passcode + "\' secretKey: \'" + data.secretKey + "\'")
          notify();
        }
      }}>{data.message}</button>
    </div>

  });
}


const displayDecodedMessages = () => { 
  return decodedMessages.map((msg, index) => {
    return <div key={index}className='msg'>
      {msg}
    </div>
  }
  );
}

const sendMessage = () => {
  const encryptedMessage = encryptMessage(message, secretKey); 
  socket.emit('send_message', { message: encryptedMessage, secretKey: secretKey });
  setMessage('');
  setSecretKey('');
}

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      setConnected(true);
    });


    socket.on('recieve_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      setMessageRecieved(data);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('recieve_message');
      socket.off('disconnect');
      socket.disconnect();
    }
  }, []);

  return (
    <>
      <h1 style={{ color: 'rebeccapurple' }}>Spy Chat</h1>
      <div className="card">
      
        <div>
        <input 
        name="input_message" 
        type="text" 
        placeholder='Message...' 
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
        }} />
        <input 
        name="input_key" 
        type="text" 
        placeholder='Secret Key...'
        value={secretKey}       
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
          <ToastContainer aria-label="toast notifications"/>
          {displayMessages()}
          </div>
      </div>
    </>
  )
}

export default App
