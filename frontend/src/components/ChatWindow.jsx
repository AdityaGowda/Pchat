import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { ref, set, onValue } from "firebase/database";
import { db, rtdb, auth } from "../firebase";
import TickIcon from "../components/TickIcon";

export default function ChatWindow({ activeChatId, setActiveChatId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [typingStatus, setTypingStatus] = useState(false);

  const currentUser = auth.currentUser;
  const conversationId =
    currentUser && activeChatId
      ? [currentUser.uid, activeChatId].sort().join("_")
      : null;

  // Fetch chat user
  useEffect(() => {
    if (!activeChatId) return;
    const fetchChatUser = async () => {
      const userDoc = await getDoc(doc(db, "users", activeChatId));
      if (userDoc.exists()) setChatUser(userDoc.data());
    };
    fetchChatUser();
  }, [activeChatId]);

  // Real-time message listener
  useEffect(() => {
    if (!conversationId) return;

    const messagesRef = collection(db, "messages", conversationId, "chat");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const messageList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messageList);

      // ✅ Mark messages as seen if they are for this user
      const unseenMessages = snapshot.docs.filter(
        (d) =>
          d.data().receiverId === currentUser.uid && d.data().status !== "seen"
      );

      for (const msg of unseenMessages) {
        await updateDoc(doc(db, "messages", conversationId, "chat", msg.id), {
          status: "seen",
        });
      }
    });

    return () => unsubscribe();
  }, [conversationId, currentUser]);

  // Typing status listener
  useEffect(() => {
    if (!conversationId || !activeChatId) return;
    const typingRef = ref(rtdb, `typing/${conversationId}/${activeChatId}`);
    const unsubscribe = onValue(typingRef, (snap) => {
      setTypingStatus(snap.val()?.isTyping || false);
    });
    return () => unsubscribe();
  }, [conversationId, activeChatId]);

  // Handle input typing
  const handleInput = (e) => {
    setMessage(e.target.value);

    if (conversationId && currentUser) {
      const typingRef = ref(
        rtdb,
        `typing/${conversationId}/${currentUser.uid}`
      );
      set(typingRef, { isTyping: e.target.value.length > 0 });
    }
  };

  // Send new message
  const sendMessage = async () => {
    if (!message.trim() || !conversationId) return;

    const messagesRef = collection(db, "messages", conversationId, "chat");
    await addDoc(messagesRef, {
      senderId: currentUser.uid,
      receiverId: activeChatId,
      text: message,
      timestamp: serverTimestamp(),
      status: "sent",
    });

    setMessage("");
    set(ref(rtdb, `typing/${conversationId}/${currentUser.uid}`), {
      isTyping: false,
    });
  };

  if (!activeChatId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 space-y-2">
        <p className="text-2xl font-semibold">Pchat 💬</p>
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-500 text-white">
        <button
          onClick={() => setActiveChatId(null)}
          className="md:hidden px-3 py-1 text-sm bg-white/20 backdrop-blur-md text-white rounded-lg shadow-sm hover:bg-white/30"
        >
          ← Back
        </button>

        <div className="flex items-center gap-3">
          {chatUser?.photoURL ? (
            <img
              src={chatUser.photoURL}
              alt={chatUser.displayName}
              className="w-10 h-10 rounded-full border border-white/40"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">
              {chatUser?.displayName?.[0] || "?"}
            </div>
          )}
          <div>
            <div className="font-semibold text-lg">
              {chatUser?.displayName || "Unknown User"}
            </div>
            <div className="text-sm text-white/80">
              {chatUser?.online ? "🟢 Online" : "⚪ Offline"}
            </div>
          </div>
        </div>

        <div />
      </div>

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.senderId === currentUser.uid ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`p-3 rounded-2xl shadow-sm max-w-xs ${
                msg.senderId === currentUser.uid
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>

            {/* ✅ Show status only for sender */}
            {msg.senderId === currentUser.uid && (
              <TickIcon status={msg.status || "sent"} />
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {typingStatus && (
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
            <span>{chatUser?.displayName || "User"} is typing...</span>
          </div>
        )}
      </div>

      {/* Input Section */}
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
