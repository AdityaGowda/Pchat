import { useEffect } from "react";
import { auth, rtdb } from "../firebase";
import { ref, update } from "firebase/database";

export default function LogoutPage({ navigation }) {
  useEffect(() => {
    if (auth.currentUser === null) {
      navigation("/login");
      return;
    }
    const getUid = auth.currentUser.uid;
    auth.signOut();
    const statusRef = ref(rtdb, `status/${getUid}`);
    update(statusRef, { online: false });
    navigation("/login");
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">You have been logged out</h1>
      <p className="text-gray-600">Thank you for using our service.</p>
    </div>
  );
}
