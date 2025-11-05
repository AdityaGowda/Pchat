// Sidebar.jsx
const chats = [
  { id: 1, name: "Alice", lastMsg: "See you soon 👋" },
  { id: 2, name: "Bob", lastMsg: "Got it, thanks!" },
  { id: 3, name: "Charlie", lastMsg: "Let’s catch up tomorrow" },
];

export default function Sidebar({ setActiveChat }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-bold text-xl shadow-sm">
        PChat 💬
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setActiveChat(chat.name)}
            className="flex items-center gap-3 p-4 border-b border-gray-200 cursor-pointer hover:bg-blue-50 transition"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
              {chat.name[0]}
            </div>
            <div>
              <div className="font-medium text-gray-900">{chat.name}</div>
              <div className="text-sm text-gray-500 truncate">
                {chat.lastMsg}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
