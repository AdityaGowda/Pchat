import { useState } from "react";
import { auth, provider, db } from "../firebase";
import { Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import {
  ref,
  set,
  onDisconnect,
  get,
  serverTimestamp,
} from "firebase/database";
import { rtdb } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

export default function SignupScreen({ setUserData }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignUp() {
    try {
      // 1️⃣ Sign in with Google popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 2️⃣ Create or update user profile in Firestore
      await createUserProfile(user);

      // 3️⃣ Save user data in your app state
      setUserData(user);

      console.log("Signup successful:", user);
    } catch (error) {
      console.error("Error during signup:", error);
    }
  }
  // 🔹 Email + Password login
  const handleCreateUserWithEmailAndPassword = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, {
        displayName: name,
      });
      await createUserProfile(userCredential.user);
      console.log("Logged in with email:", userCredential.user);
      alert(`Welcome ${userCredential.user.email}`);
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  async function createUserProfile(user) {
    await setDoc(
      doc(db, "users", user.uid),
      {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastSeen: Date.now(),
      },
      { merge: true }
    );

    // 2️⃣ Realtime DB → set online status
    const statusRef = ref(rtdb, `status/${user.uid}`);
    set(statusRef, { online: true, name: user.displayName, uid: user.uid });
    const snapshot = await get(statusRef);
    if (snapshot.exists()) {
      console.log("Status:", snapshot.val());
    } else {
      console.log("No status found");
    }
    onDisconnect(statusRef).update({ online: false });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign Up
        </h2>
        <form
          className="space-y-4"
          onSubmit={handleCreateUserWithEmailAndPassword}
        >
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
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
            Sign Up
          </button>
        </form>
        <button
          className="w-full py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
          onClick={handleSignUp}
        >
          sign up with Google
        </button>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 cursor-pointer">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
