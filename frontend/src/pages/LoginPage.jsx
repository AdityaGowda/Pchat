import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import { ref, set, update, get, onDisconnect } from "firebase/database";
import { rtdb } from "../firebase";

export default function LoginScreen({ setUserLoginStatus }) {
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
      alert(`Welcome ${userCredential.user.email}`);
      setUserStatus(userCredential.user);
      setUserLoginStatus(true);
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  async function setUserStatus(user) {
    if (!user?.uid) return;
    const statusRef = ref(rtdb, `status/${user.uid}`);

    try {
      // Check if user status exists
      const snapshot = await get(statusRef);

      if (snapshot.exists()) {
        // Update existing user status
        await update(statusRef, { online: true });
      } else {
        // Create new user status
        await set(statusRef, {
          online: true,
          name: user.displayName || "Anonymous",
          uid: user.uid,
        });
      }

      // Automatically mark offline when user disconnects
      onDisconnect(statusRef).update({
        online: false,
      });
    } catch (error) {
      console.error("Error setting user status:", error);
    }
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
