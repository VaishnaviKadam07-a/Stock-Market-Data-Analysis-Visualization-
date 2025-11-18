import React, { useState } from "react";

function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    let response = null;

    if (input.toLowerCase().includes("predict")) {
      const company = input.split("predict ")[1];
      response = await fetch(`http://127.0.0.1:5000/predict/${company}`);
    } else if (input.toLowerCase().includes("show")) {
      const company = input.split("show ")[1];
      response = await fetch(`http://127.0.0.1:5000/company/${company}`);
    }

    if (response) {
      const data = await response.json();
      setMessages([...messages, { user: input }, { bot: JSON.stringify(data) }]);
    }

    setInput("");
  };

  return (
    <div className="chatbot">
      <h2>💬 Finance Chatbot</h2>
      <div className="chat-window">
        {messages.map((msg, idx) =>
          msg.user ? (
            <p key={idx} className="user-msg">👤 {msg.user}</p>
          ) : (
            <p key={idx} className="bot-msg">🤖 {msg.bot}</p>
          )
        )}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Type "show Tata Motors" or "predict Infosys"...'
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;
