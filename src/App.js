import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Window from "./Window";

const socket = io.connect("https://chat-app-grouping.onrender.com");

const getRandomHexColor = () => {
  const r = Math.floor(Math.random() * 128).toString(16).padStart(2, '0');
  const g = Math.floor(Math.random() * 128).toString(16).padStart(2, '0');
  const b = Math.floor(Math.random() * 128).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
};

function App() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [usercolor, setUsercolor] = useState(getRandomHexColor());
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && roomId !== "") {
      socket.emit("join_room", roomId);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinContainer">
          <h3>Join a window or chat room with same ID</h3>
          <input
            type="text"
            placeholder="Username..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID to enter"
            onChange={(event) => {
              setRoomId(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Window socket={socket} username={username} room={roomId} usercolor={usercolor} />
      )}
    </div>
  );
}

export default App;
