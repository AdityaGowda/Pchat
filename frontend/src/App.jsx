// App.jsx
import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import Sidebar from "./components/Sidebar";
import "./App.css";
import SignupScreen from "./pages/SignupScreen";

export default function App() {
  const [activeChat, setActiveChat] = useState(null);

  return (
    <div className="flex h-screen font-sans bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Sidebar */}
      <SignupScreen />
    </div>
  );
}
