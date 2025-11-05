import { useState } from "react";
import { auth, provider } from "../firebase";
import { Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

export default function SignupScreen({ setUserData }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSignUp() {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUserData(result.user);
      })
      .catch((error) => {
        console.log(error);
      });
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

      console.log("Logged in with email:", userCredential.user);
      alert(`Welcome ${userCredential.user.email}`);
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

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
