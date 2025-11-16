import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth, rtdb } from "../firebase";
import { Link } from "react-router-dom";
import { ref, set, update, get, onDisconnect } from "firebase/database";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function LoginScreen({ setUserLoginStatus }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 🔹 Email + Password login

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    toast.promise(signInWithEmailAndPassword(auth, email, password), {
      loading: "Logging in...",
      success: (userCredential) => {
        setUserStatus(userCredential.user);
        setTimeout(() => setUserLoginStatus(true), 1000);
        return `Welcome ${userCredential.user.email}`;
      },
      error: (err) => err.message,
    });
  };
  async function setUserStatus(user) {
    if (!user?.uid) return;
    const statusRef = ref(rtdb, `status/${user.uid}`);

    try {
      const snapshot = await get(statusRef);

      if (snapshot.exists()) {
        await update(statusRef, { online: true });
      } else {
        await set(statusRef, {
          online: true,
          name: user.displayName || "Anonymous",
          uid: user.uid,
        });
      }

      onDisconnect(statusRef).update({ online: false });
    } catch (error) {
      console.error("Error setting user status:", error);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 w-full"
    >
      {/* Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg"
      >
        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-center text-gray-800"
        >
          Login
        </motion.h2>

        <form className="space-y-4" onSubmit={handleEmailLogin}>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-purple-600"
            required
          />
          <div className="relative">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-12 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-purple-600"
              required
            />

            {/* 👁️ Toggle Button */}
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-2 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md hover:opacity-90 transition"
          >
            Login
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-center text-gray-600"
        >
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
