import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import CreateStorePage from "./pages/CreateStorePage";
import StorePage from "./pages/StorePage";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <ThemeToggle />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create-store" element={<CreateStorePage />} />
          <Route path="/store/:id" element={<StorePage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
