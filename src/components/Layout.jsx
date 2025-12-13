// src/components/Layout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Layout({ user, setUser }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar user={user} setUser={setUser} />

      {/* Main Content */}
      <main className="flex-1 min-h-0">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
