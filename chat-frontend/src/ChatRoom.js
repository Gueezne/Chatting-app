import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://localhost:5000/messages");
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();

    // Listen for new messages
    socket.on("message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (user && message) {
      socket.emit("sendMessage", { user, message });
      setMessage(""); // Clear input
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <ul>
        {messages.map((msg) => (
          <li key={msg._id}>
            <strong>{msg.user}:</strong> {msg.message}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="Your name"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;