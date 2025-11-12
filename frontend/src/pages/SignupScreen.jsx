import { useState } from "react";
import { auth, provider, db, rtdb } from "../firebase";
import { Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { ref, set } from "firebase/database";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function SignupScreen({ setUserLoginStatus }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Create or update user profile
  async function createUserProfile(user) {
    await setDoc(
      doc(db, "users", user.uid),
      {
        displayName: user.displayName || name,
        email: user.email,
        photoURL: user.photoURL || "",
        lastSeen: Date.now(),
      },
      { merge: true }
    );

    const statusRef = ref(rtdb, `status/${user.uid}`);
    await set(statusRef, {
      online: true,
      name: user.displayName || name,
      uid: user.uid,
    });
  }

  // ✅ Email + Password signup
  const handleCreateUserWithEmailAndPassword = async (e) => {
    e.preventDefault();

    const signupPromise = createUserWithEmailAndPassword(auth, email, password);

    toast.promise(signupPromise, {
      loading: "Creating your account...",
      success: async (userCredential) => {
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });
        await createUserProfile(user);

        // delay for smooth toast visibility
        setTimeout(() => setUserLoginStatus(true), 500);

        return `Welcome ${name || user.email}`;
      },
      error: (err) => err.message,
    });
  };

  // ✅ Google signup
  async function handleSignUpWithGoogle() {
    const googlePromise = signInWithPopup(auth, provider);

    toast.promise(googlePromise, {
      loading: "Connecting with Google...",
      success: async (result) => {
        const user = result.user;
        await createUserProfile(user);
        setTimeout(() => setUserLoginStatus(true), 500);
        return `Welcome ${user.displayName}`;
      },
      error: (err) => err.message,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 w-full"
    >
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
          Sign Up
        </motion.h2>

        <form
          className="space-y-4"
          onSubmit={handleCreateUserWithEmailAndPassword}
        >
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
          >
            Sign Up
          </motion.button>
        </form>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSignUpWithGoogle}
          className="w-full py-2 font-bold text-white bg-red-500 rounded-md hover:bg-red-600 transition"
        >
          Sign Up with Google
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-center text-gray-600"
        >
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
