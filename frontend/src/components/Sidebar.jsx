// Sidebar.jsx
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { auth, rtdb } from "../firebase"; // your firebase.js export

export default function Sidebar({ activeChatId, setActiveChatId }) {
  const [onlineUsers, setOnlineUsers] = useState([]);

  // 👇 Listen to all online users in Realtime DB
  useEffect(() => {
    const statusRef = ref(rtdb, "status/");

    // onValue() = real-time listener
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setOnlineUsers([]);
        return;
      }

      // Filter only users who are online = true
      const onlineList = Object.keys(data)
        .filter(
          (uid) => data[uid].online === true && uid !== auth.currentUser.uid
        )
        .map((uid) => ({
          uid,
          name: data[uid].name || "Unknown",
          online: true,
        }));

      setOnlineUsers(onlineList);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-bold text-xl shadow-sm">
        PChat 💬
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {onlineUsers.length === 0 ? (
          <div className="p-4 text-gray-500 text-center">
            No users online 💤
          </div>
        ) : (
          onlineUsers.map((user) => (
            <div
              key={user.uid}
              onClick={() => setActiveChatId(user.uid)}
              className={`flex items-center gap-3 p-4 border-b border-gray-200 cursor-pointer hover:bg-blue-50 transition ${
                activeChatId === user.uid ? "bg-blue-100" : ""
              }`}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
                {user.name[0].toUpperCase()}
              </div>

              {/* User Info */}
              <div>
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-sm text-green-600">🟢 Online</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
