// hooks/useUserPresence.js
import { useEffect } from "react";
import { ref, onDisconnect, update } from "firebase/database";
import { rtdb } from "../firebase";

export default function useHandleUserOnlineStatus(uid) {
  useEffect(() => {
    if (!uid) return;

    const userStatusRef = ref(rtdb, `status/${uid}`);

    // Set user online when they enter chat
    const goOnline = async () => {
      try {
        await update(userStatusRef, {
          online: true,
        });

        // When the user disconnects (closes tab / loses network)
        onDisconnect(userStatusRef).update({
          online: false,
        });
      } catch (error) {
        console.error("Error setting user presence:", error);
      }
    };

    goOnline();

    // Cleanup: when user leaves chat route or logs out manually
    return () => {
      update(userStatusRef, {
        online: false,
      });
    };
  }, [uid]);

  return null;
}
