// Sidebar.jsx
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../firebase";
import { useAuth } from "./AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar({ activeChatId, setActiveChatId }) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { currentUser } = useAuth();

  // 👇 Listen to all online users in Realtime DB
  useEffect(() => {
    const statusRef = ref(rtdb, "status/");

    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setOnlineUsers([]);
        return;
      }

      const onlineList = Object.keys(data)
        .filter((uid) => data[uid].online === true && uid !== currentUser.uid)
        .map((uid) => ({
          uid,
          name: data[uid].name || "Unknown",
          online: true,
        }));

      if (!data[activeChatId]) {
        setActiveChatId(null);
      }
      setOnlineUsers(onlineList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col h-full w-full md:w-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-4 border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xl shadow-sm"
      >
        PChat
      </motion.div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {onlineUsers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 text-gray-500 text-center"
          >
            <p className="text-lg font-semibold mt-2">
              No users online right now 💤
            </p>
            <p className="text-sm opacity-70 mt-2">
              Please wait for someone to come online and start chatting.
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {onlineUsers.map((user, index) => (
              <motion.div
                key={user.uid}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  onClick={() => setActiveChatId(user.uid)}
                  className={`flex items-center gap-3 p-4 border-b border-gray-200 cursor-pointer hover:bg-blue-50 transition ${
                    activeChatId === user.uid ? "bg-blue-100" : ""
                  }`}
                >
                  {/* Avatar */}
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold"
                  >
                    {user.name[0].toUpperCase()}
                  </motion.div>

                  {/* User Info */}
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-green-600">🟢 Online</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
