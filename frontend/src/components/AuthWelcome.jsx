//Welcome message
function AuthWelcome() {
  return (
    <div className="auth-welcome">
      <h2 className="auth-welcome-title">Your travel bucket list ✈️</h2>
      <p className="auth-welcome-desc">
        Search any country, save the places you dream of, and check them off as
        you visit them.
      </p>
      <ul className="auth-welcome-list">
        <li>🔎 Search countries — flags, capital, currency</li>
        <li>⭐ Build your travel Wishlist</li>
        <li>✅ Log the countries you've visited</li>
      </ul>
    </div>
  );
}

export default AuthWelcome;
