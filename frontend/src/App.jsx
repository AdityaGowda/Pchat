import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import SignupScreen from "./pages/SignupScreen";
import LoginScreen from "./pages/LoginPage";
import "./App.css";
import MainChatWindow from "./pages/mainChatWindow";
import AuthRoute from "./components/AuthRoute";
import { AuthProvider } from "./components/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

function AppRoutes() {
  const [userLoginStatus, setUserLoginStatus] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (userLoginStatus) {
      navigate("/chat");
    }
  });
  return (
    <div className="flex h-screen w-full overflow-hidden font-sans bg-gradient-to-br from-blue-50 to-gray-100">
      <Routes>
        <Route
          path="/signup"
          element={
            <AuthRoute type="public">
              <SignupScreen setUserLoginStatus={setUserLoginStatus} />
            </AuthRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthRoute type="public">
              <LoginScreen setUserLoginStatus={setUserLoginStatus} />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <AuthRoute type="protected">
              <MainChatWindow />
            </AuthRoute>
          }
        />
        <Route
          path="*"
          element={
            <AuthRoute type="public">
              <Navigate to="/login" />
            </AuthRoute>
          }
        />
      </Routes>
    </div>
  );
}
