// App.jsx
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ChatWindow from "./components/ChatWindow";
import Sidebar from "./components/Sidebar";
import SignupScreen from "./pages/SignupScreen";
import LoginScreen from "./pages/LoginPage";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [activeChat, setActiveChat] = useState(null);
  const [userData, setUserData] = useState(null);

  console.log("userData in App.jsx:", userData);

  return (
    <Router>
      <div className="flex h-screen w-full overflow-hidden font-sans bg-gradient-to-br from-blue-50 to-gray-100">
        <Routes>
          {/* Signup Route */}
          <Route
            path="/signup"
            element={<SignupScreen setUserData={setUserData} />}
          />

          {/* Login Route */}
          <Route
            path="/login"
            element={<LoginScreen setUserData={setUserData} />}
          />

          {/* Chat Route (main app after login) */}
          <Route
            path="/chat"
            element={
              userData ? (
                <ProtectedRoute>
                  <div className="flex w-full h-full">
                    <div className="w-1/4 min-w-[250px] border-r border-gray-200 shadow-sm">
                      <Sidebar setActiveChat={setActiveChat} />
                    </div>
                    <main className="flex-1 flex flex-col">
                      <ChatWindow activeChat={activeChat} />
                    </main>
                  </div>
                </ProtectedRoute>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Default Route → redirect to Login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}
