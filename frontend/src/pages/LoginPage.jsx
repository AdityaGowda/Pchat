import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth, db } from "../firebase";
import { Link } from "react-router-dom";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { ref, set, onDisconnect } from "firebase/database";
import { rtdb } from "../firebase";

export default function LoginScreen({ setUserData }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 Email + Password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Logged in with email:", userCredential.user);
      alert(`Welcome ${userCredential.user.email}`);
      setUserStatus(userCredential.user);
      setUserData(userCredential.user);
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  function setUserStatus(user) {
    async (user) => {
      await setDoc(
        doc(db, "users", user.uid),
        {
          name: user.displayName || "No Name",
          email: user.email,
          createdAt: Date.now(),
        },
        { merge: true }
      );

      // 2️⃣ Realtime DB → set online status
      const statusRef = ref(rtdb, `status/${user.uid}`);
      set(statusRef, { online: true });

      // Automatically set offline when user disconnects
      onDisconnect(statusRef).set({ online: false, lastSeen: Date.now() });
    };
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <form className="space-y-4" onSubmit={handleEmailLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
