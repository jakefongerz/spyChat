import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { socket } from './socket'

function App() {
  const [count, setCount] = useState(0)
  const [connected, setConnected] = useState(socket.connected);
  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('count', () => {
      setCount((c) => c + 1);
    });

    return () => {
      socket.disconnect();
      socket.off('connect');
      socket.off('count');
    }
  }, []);

  return (
    <>
      <h1>Spy Chat</h1>
      <div className="card">
        <button onClick={() => connected && socket.emit('count')}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App
