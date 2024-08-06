import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { StudentManagement } from "./components/StudentManagement";
import { Dashboard } from "./components/Dashboard";
import { AddStudent } from "./components/AddStudent";
import { EditStudent } from "./components/EditStudent";
import { EventManagement } from "./components/EventManagement";
import { AddEvent } from "./components/AddEvent";
import { EditEvent } from "./components/EditEvent";
import { TransactionManagement } from "./components/TransactionManagement";
import { AddTransaction } from "./components/AddTransaction";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<StudentManagement />} />
          <Route path="/students/add" element={<AddStudent />} />
          <Route path="/students/edit/:id" element={<EditStudent />} />
          <Route path="/events" element={<EventManagement />} />
          <Route path="/events/add" element={<AddEvent />} />
          <Route path="/events/edit/:id" element={<EditEvent />} />
          <Route path="/transactions" element={<TransactionManagement />} />
          <Route path="/transactions/add" element={<AddTransaction />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
