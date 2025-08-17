import TickIcon from "./ TickIcon";
import { useState } from "react";


export default function ChatWindow({ activeChat, setActiveChat }) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 space-y-2">
        <p className="text-2xl font-semibold">Pchat 💬</p>
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  const handleInput = (e) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const sendMessage = () => {
    if (message.trim() === "") return;
    console.log("Send:", message);
    setMessage("");
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-500 text-white">
        <button
          onClick={() => setActiveChat(null)}
          className="md:hidden px-3 py-1 text-sm bg-white/20 backdrop-blur-md text-white rounded-lg shadow-sm hover:bg-white/30"
        >
          ← Back
        </button>
        <span className="font-semibold text-lg">{activeChat}</span>
        <div />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Incoming message */}
        <div className="bg-gray-200 text-gray-800 p-3 rounded-2xl w-fit shadow-sm">
          Hello 👋
        </div>

        {/* Outgoing messages */}
        <div className="flex flex-col space-y-2 items-end">
          <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-2xl shadow-sm max-w-xs">
            Hi! How are you?
          </div>
          <div className="">
            <TickIcon status="read" />
          </div>
        </div>

        <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-2xl shadow-sm max-w-xs">
          Hi! How are you?
        </div>
        <div className="">
          <TickIcon status="sent" />
        </div>
<div className="flex flex-col space-y-2 items-end">
        <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-2xl shadow-sm max-w-xs">
          Hi! How are you?
        </div>
        <div className="">
          <TickIcon status="delivered" />
        </div></div>

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
            <span>Typing...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 bg-white flex gap-2 items-center shadow-md">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={handleInput}
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
        <button
          onClick={sendMessage}
          className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-full shadow hover:opacity-90"
        >
          Send
        </button>
      </div>
    </div>
  );
}
