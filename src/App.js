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
import { Reports } from "./components/Reports";
import { AuthProvider } from "./AuthContext";
import { Login } from "./components/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute>
                  <StudentManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students/add"
              element={
                <ProtectedRoute>
                  <AddStudent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students/edit/:id"
              element={
                <ProtectedRoute>
                  <EditStudent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <EventManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/add"
              element={
                <ProtectedRoute>
                  <AddEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/edit/:id"
              element={
                <ProtectedRoute>
                  <EditEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <TransactionManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions/add"
              element={
                <ProtectedRoute>
                  <AddTransaction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
