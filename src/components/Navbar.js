import { Logout } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();

  async function handleClickLogout() {
    try {
      await logout();
    } catch (e) {
      console.error("Logout failed: ", e);
    }
  }
  return (
    <div className="navbar shadow">
      <div className="navbar-heading">
        <Link className="no-underline" to={"/dashboard"}>
          <p>Dance Fee Track</p>
        </Link>
      </div>
      {user ? <Logout fontSize="small" onClick={handleClickLogout} /> : null}
    </div>
  );
}
