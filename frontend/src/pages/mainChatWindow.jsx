import React from "react";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";

export default function MainChatWindow() {
  return (
    <div className="flex w-full h-full">
      <div className="w-1/4 min-w-[250px] border-r border-gray-200 shadow-sm">
        <Sidebar />
      </div>
      <main className="flex-1 flex flex-col">
        <ChatWindow />
      </main>
    </div>
  );
}
