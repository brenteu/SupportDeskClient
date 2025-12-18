import { Link, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TicketsPage from "./pages/TicketsPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import NewTicketPage from "./pages/NewTicketPage";
import { useAuth } from "./auth/AuthContext";

import "./styles/layout.css";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div className="container">
      <header className="header">
        <nav className="nav">
          <Link to="/tickets">Tickets</Link>
          <Link to="/tickets/new">New Ticket</Link>
        </nav>

        <div className="userbar">
          {user ? (
            <>
              <span className="small">{user.email}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </header>

      <hr />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <TicketsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/new"
          element={
            <ProtectedRoute>
              <NewTicketPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/:id"
          element={
            <ProtectedRoute>
              <TicketDetailPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </div>
  );
}
