import { Link } from "react-router-dom";

export function Dashboard() {
  return (
    <div className="container">
      <h1>Dashboard</h1>
      <nav>
        <Link to="/students">
          <button>Manage Students</button>
        </Link>
        <Link to="/events">
          <button>Manage Events</button>
        </Link>
        <Link to="/transactions">
          <button>Manage Transactions</button>
        </Link>
      </nav>
    </div>
  );
}
