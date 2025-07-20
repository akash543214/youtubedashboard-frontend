
export default function GoogleLogin({isLoggedIn,setIsLoggedIn}: { isLoggedIn: boolean, setIsLoggedIn: (value: boolean) => void }) {

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/google"; // Replace with your backend Google login route
  };

  const handleLogout = () => {
    // In real app: clear cookies/token + call logout API
    setIsLoggedIn(false);
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-indigo-700">YouTube Companion</div>
      {isLoggedIn ? (
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      ) : (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={handleGoogleLogin}
        >
          Login with Google
        </button>
      )}
    </header>
  );
}
