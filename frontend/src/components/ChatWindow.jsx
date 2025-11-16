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
import { db, rtdb } from "../firebase";
import TickIcon from "../components/TickIcon";
import { useAuth } from "./AuthContext";

export default function ChatWindow({ activeChatId, setActiveChatId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [typingStatus, setTypingStatus] = useState(false);
  const { currentUser } = useAuth();
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
      console.log("Typing status updated:", snap.val());
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
      console.log("Updating typing status:", e.target.value.length > 0);
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
    return <DefaultChatWindow />;
  }

  return (
    <div className="flex flex-col h-full w-full md:flex-1">
      {/* Header */}
      <div
        className="flex items-center gap-3 p-2.5 border-b border-gray-200 
                  bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
      >
        {/* Mobile Back Button */}
        <button
          onClick={() => setActiveChatId(null)}
          className="md:hidden text-2xl px-2 py-1 bg-white/20 backdrop-blur-md 
                 text-white rounded-lg shadow-sm hover:bg-white/30"
        >
          &lt;
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 flex-1">
          {chatUser?.photoURL ? (
            <img
              src={chatUser.photoURL}
              alt={chatUser.displayName}
              className="w-10 h-10 rounded-full border border-white/40"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full bg-white/20 flex items-center 
                        justify-center text-white font-semibold"
            >
              {chatUser?.displayName?.[0] || "?"}
            </div>
          )}

          <div>
            <div className="font-semibold text-lg">
              {chatUser?.displayName || "Unknown User"}
            </div>
          </div>
        </div>

        {/* Place-holder for alignment on desktop */}
        <div className="hidden md:block w-8"></div>
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
              className={`pt-2 pl-5 pr-5 pb-2 rounded-2xl shadow-sm max-w-xs ${
                msg.senderId === currentUser.uid
                  ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white border-white/20"
                  : "bg-white text-gray-800 border-gray-200"
              }`}
            >
              {msg.text}
            </div>

            {msg.senderId === currentUser.uid && (
              <TickIcon status={msg.status || "sent"} />
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {typingStatus && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
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
          onChange={(e) => handleInput(e)}
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none 
                 focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
        <button
          onClick={(e) => sendMessage(e)}
          className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 
                 text-white rounded-full shadow hover:opacity-90"
        >
          Send
        </button>
      </div>
    </div>
  );
}

function DefaultChatWindow() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 space-y-2 px-4 text-center">
      <p className="text-3xl font-bold">PChat</p>{" "}
      <p className="text-lg">Start chatting with any online public user.</p>{" "}
      <p className="text-sm opacity-70">
        Select a user from the online list to begin a private real-time chat.{" "}
      </p>
      <p className="text-sm opacity-70">
        Your conversation stays active only while both users remain online.{" "}
      </p>
    </div>
  );
}
