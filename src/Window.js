import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Window({ socket, username, room, usercolor }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  const date = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US').format(date);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Group-Id:{room}</p>
        <i class="fa-solid fa-user-group"></i>
      </div>
      <div className="chat-body">
        <div className="message-meta" style={{ textAlign: "center", margin: "2px" }}><span style={{ background: "beige" }}>{formattedDate}</span></div>
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <span
                className="message"
                id={username === messageContent.author ? "myaccount" : "user"}

              >
                <div className="message-content" style={{ display: "flex", flexDirection: "column" }}>
                  <div id="author" className="message-meta" style={{ color: usercolor }}>
                    {messageContent.author}
                  </div>
                  <div> {messageContent.message}</div>
                  <div className="message-meta">{messageContent.time}</div>
                </div>
              </span>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type a message..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Window;
