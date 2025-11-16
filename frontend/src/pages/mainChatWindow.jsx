import React, { useEffect, useState } from "react";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../components/AuthContext";
import useHandleUserOnlineStatus from "../hooks/HandleUserOnlineStatus";

import { rtdb, db } from "../firebase";
import { ref, get, onValue } from "firebase/database";
import { collection, getDocs, writeBatch } from "firebase/firestore";

export default function MainChatWindow() {
  const [activeChatId, setActiveChatId] = useState(null);
  const { currentUser } = useAuth();

  // Track current user online/offline
  useHandleUserOnlineStatus(currentUser.uid);

  const isMobile = window.innerWidth < 950;

  useEffect(() => {
    if (!activeChatId || !currentUser?.uid) return;

    const me = currentUser.uid;
    const other = activeChatId;

    const meStatusRef = ref(rtdb, `status/${me}/online`);
    const otherStatusRef = ref(rtdb, `status/${other}/online`);

    const unsub1 = onValue(meStatusRef, () => checkDelete());
    const unsub2 = onValue(otherStatusRef, () => checkDelete());

    async function checkDelete() {
      const meSnap = await get(meStatusRef);
      const otherSnap = await get(otherStatusRef);

      const meOnline = meSnap.val();
      const otherOnline = otherSnap.val();

      const conversationId = [me, other].sort().join("_");

      // ❗ If ANY user is offline → delete chat history
      if (!meOnline || !otherOnline) {
        await deleteConversation(conversationId);

        // Also clear from UI immediately
        setActiveChatId(null);
      }
    }

    return () => {
      unsub1();
      unsub2();
    };
  }, [activeChatId, currentUser]);

  async function deleteConversation(conversationId) {
    try {
      const chatRef = collection(db, "messages", conversationId, "chat");
      const snapshot = await getDocs(chatRef);

      if (snapshot.empty) return;

      const batch = writeBatch(db);
      snapshot.forEach((doc) => batch.delete(doc.ref));

      await batch.commit();
      console.log("Chat deleted →", conversationId);
    } catch (err) {
      console.error("Error deleting chat:", err);
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans bg-gradient-to-br from-blue-50 to-gray-100">
      {/* ===== MOBILE MODE ===== */}
      {isMobile ? (
        <>
          {/* Sidebar FIRST */}
          {!activeChatId && (
            <Sidebar
              activeChatId={activeChatId}
              setActiveChatId={setActiveChatId}
            />
          )}

          {/* Chat ONLY when selected */}
          {activeChatId && (
            <ChatWindow
              activeChatId={activeChatId}
              setActiveChatId={setActiveChatId}
            />
          )}
        </>
      ) : (
        /* ===== DESKTOP MODE ===== */
        <>
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
        </>
      )}
    </div>
  );
}
