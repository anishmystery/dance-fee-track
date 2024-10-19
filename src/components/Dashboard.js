import PeopleIcon from "@mui/icons-material/People";
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { Link } from "react-router-dom";

export function Dashboard() {
  return (
    <div className="nav-links">
      <Link to="/students" className="no-underline">
        <div className="nav-button shadow">
          <PeopleIcon></PeopleIcon>
          <p>Students</p>
        </div>
      </Link>
      <Link to="/events" className="no-underline">
        <div className="nav-button shadow">
          <TheaterComedyIcon></TheaterComedyIcon>
          <p>Events</p>
        </div>
      </Link>
      <Link to="/transactions" className="no-underline">
        <div className="nav-button shadow">
          <AttachMoneyIcon></AttachMoneyIcon>
          <p>Transactions</p>
        </div>
      </Link>
      <Link to="/reports" className="no-underline">
        <div className="nav-button shadow">
          <AssessmentIcon></AssessmentIcon>
          <p>Reports</p>
        </div>
      </Link>
    </div>
  );
}
