import { useState, useEffect } from "react";
import {
  getEvents,
  addStudent,
  addStudentEventMapping,
} from "../firestoreServices";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfigurations";

export function AddStudent() {
  const [name, setName] = useState("");
  const [parentName, setParentName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [eventList, setEventList] = useState([]);
  const [eventIds, setEventIds] = useState([]);
  const navigate = useNavigate();
  const status = "Active";

  useEffect(() => {
    const initializeEvents = async () => {
      const allEvents = await getEvents();
      setEventList(allEvents);
    };
    initializeEvents();
  }, []);

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeParentName(e) {
    setParentName(e.target.value);
  }

  function handleChangeContactNumber(e) {
    setContactNumber(e.target.value);
  }

  function handleChangeEventType(e) {
    const options = e.target.options;
    const selectedEvents = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selectedEvents.push(options[i].value);
    }
    setEventIds(selectedEvents);
  }

  async function handleAddStudent(student, eventIds, status) {
    const studentId = await addStudent(student);
    for (const eventId of eventIds) {
      const studentRef = doc(db, "students", studentId);
      const eventRef = doc(db, "events", eventId);
      const eventSnapshot = await getDoc(eventRef);
      const feeAmount = eventSnapshot.data().baseFee;
      const mapping = {
        studentId: studentRef,
        eventId: eventRef,
        status,
        feeAmount,
        pauseStart: "",
        pauseEnd: "",
      };
      await addStudentEventMapping(mapping);
    }
    navigate("/students");
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    if (!name || !parentName || !contactNumber) return;

    const newStudent = {
      name,
      parentName,
      contactNumber: contactNumber.split(","),
    };

    // Calling handleAddStudent immediately updates the student list but might still be running asynchronous operations.
    // Use a callback in setState to ensure state updates are handled properly and avoid unnecessary re-renders.
    handleAddStudent(newStudent, eventIds, status).then(() => {
      setName("");
      setParentName("");
      setContactNumber("");
      setEventList([]);
      setEventIds([]);
    });
  }

  return (
    <div className="container">
      <h1>Add Student</h1>
      <form className="form" onSubmit={handleFormSubmit}>
        <div>
          <strong>Student Name: </strong>
          <input type="text" value={name} onChange={handleChangeName}></input>
        </div>
        <div>
          <strong>Parent Name: </strong>
          <input
            type="text"
            value={parentName}
            onChange={handleChangeParentName}
          ></input>
        </div>
        <div>
          <strong>Contact Numbers: </strong>
          <input
            type="text"
            value={contactNumber}
            onChange={handleChangeContactNumber}
          ></input>
        </div>
        <div>
          <strong>Event Type: </strong>
          <select value={eventIds} multiple onChange={handleChangeEventType}>
            <option value="" disabled>
              --Please select an event--
            </option>
            {eventList.map((event) => (
              <option key={event.id} value={event.id}>
                {event.eventType}
              </option>
            ))}
          </select>
        </div>
        <button>Add Student</button>
      </form>
    </div>
  );
}
