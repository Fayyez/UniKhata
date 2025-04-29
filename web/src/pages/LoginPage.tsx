import { useEffect } from "react";

declare global {
  interface Window {
    google: any;
  }
}

const LoginPage = () => {
  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID", // 🔁 Replace this
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-signin-btn"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleCredentialResponse = (response: any) => {
    console.log("Google JWT ID Token:", response.credential);
    // TODO: Send token to backend or decode it
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
          <button className="bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition">
            Login
          </button>
        </div>

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
