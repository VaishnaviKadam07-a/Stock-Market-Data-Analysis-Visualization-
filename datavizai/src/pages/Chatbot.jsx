import React, { useState } from "react";
import axios from "axios";
import "./Chatbot.css";

const supportedCompanies = ["Tata Motors", "Infosys", "Reliance", "Mahindra", "Wipro"];

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I can provide info and stock trends for these companies: " + supportedCompanies.join(", ") + ". Ask me anything!" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    const question = input;
    setInput("");

    try {
      // Send query to backend
      const res = await axios.post("http://127.0.0.1:5000/chatbot", { question });
      const answer = res.data.answer;

      // Add bot response
      setMessages((prev) => [...prev, { sender: "bot", text: answer }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, I couldn't fetch an answer." }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chatbot-container">
      <h1>Finance Chatbot 🤖</h1>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === "bot" ? "bot" : "user"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask about a company or stock..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
