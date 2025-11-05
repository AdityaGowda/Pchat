import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import ChatWindow from "./components/ChatWindow";
import Sidebar from "./components/Sidebar";
import SignupScreen from "./pages/SignupScreen";
import LoginScreen from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

export default function App() {
  const [activeChat, setActiveChat] = useState(null);
  const [userData, setUserData] = useState(null);

  return (
    <Router>
      <AppRoutes
        userData={userData}
        setUserData={setUserData}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
      />
    </Router>
  );
}

function AppRoutes({ userData, setUserData, activeChat, setActiveChat }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (userData) {
      navigate("/chat");
    }
  }, [userData, navigate]);

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans bg-gradient-to-br from-blue-50 to-gray-100">
      <Routes>
        <Route
          path="/signup"
          element={<SignupScreen setUserData={setUserData} />}
        />
        <Route
          path="/login"
          element={<LoginScreen setUserData={setUserData} />}
        />
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
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}
