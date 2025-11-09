import React, { useState } from "react";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";

export default function MainChatWindow() {
  const [activeChatId, setActiveChatId] = useState(null);
  return (
    <div className="flex w-full h-full">
      <div className="w-1/4 min-w-[250px] border-r border-gray-200 shadow-sm">
        <Sidebar
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
        />
      </div>
      <main className="flex-1 flex flex-col">
        <ChatWindow
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
        />
      </main>
    </div>
  );
}
