import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    google: any;
  }
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }

    window.google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID", // 🔁 Replace this
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-signin-btn"),
      { theme: "outline", size: "large" }
    );
  }, [isAuthenticated, navigate]);

  const handleCredentialResponse = (response: any) => {
    console.log("Google JWT ID Token:", response.credential);
    const userData = {
      id: "1",
      name: "Google User",
      email: "google@example.com"
    };
    const tokens = {
      accessToken: response.credential,
      refreshToken: "google_refresh_token",
      expiresIn: Date.now() + 3600000 // 1 hour from now
    };
    login(userData, tokens);
    navigate("/dashboard");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      id: "1",
      name: "Test User",
      email: email
    };
    const tokens = {
      accessToken: "dummy_access_token",
      refreshToken: "dummy_refresh_token",
      expiresIn: Date.now() + 3600000 // 1 hour from now
    };
    login(userData, tokens);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
            required
          />
          <button 
            type="submit"
            className="bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <div className="my-4 text-center text-gray-500">or</div>
        <div id="google-signin-btn" className="flex justify-center" />
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:text-blue-800">
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
