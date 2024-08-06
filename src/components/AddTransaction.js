import { useEffect, useState } from "react";
import {
  addTransaction,
  getEvents,
  getStudentEventMappingByStudentId,
  getStudentEventMappingByStudentIdAndEventId,
  getStudents,
} from "../firestoreServices";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfigurations";

export function AddTransaction() {
  const [studentList, setStudentList] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [eventList, setEventList] = useState([]);
  const [eventId, setEventId] = useState("");
  const [amount, setAmount] = useState("");
  const [isWaivedOff, setIsWaivedOff] = useState(false);
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const initializeStudents = async () => {
      const allStudents = await getStudents();
      setStudentList(allStudents);
    };
    initializeStudents();
  }, []);

  useEffect(() => {
    const initializeEvents = async () => {
      const allEvents = await getEvents();
      setEventList(allEvents);
    };
    initializeEvents();
  }, []);

  async function filterEventsByStudentId(studentId) {
    const mappings = await getStudentEventMappingByStudentId(studentId);
    const events = [];
    for (const mapping of mappings) {
      const docRef = mapping.eventId;
      const eventDoc = await getDoc(docRef);
      events.push({ id: eventDoc.id, ...eventDoc.data() });
    }
    setEventList(events);
  }

  async function getFeeAmountByEventId(studentId, eventId) {
    const querySnapshot = await getStudentEventMappingByStudentIdAndEventId(
      studentId,
      eventId
    );
    const docSnapshot = querySnapshot.docs[0];
    const mapping = { ...docSnapshot.data() };
    return mapping.feeAmount;
  }

  function handleChangeStudentName(e) {
    setStudentId(e.target.value);
    filterEventsByStudentId(e.target.value);
  }

  function handleChangeEventType(e) {
    setEventId(e.target.value);
    getFeeAmountByEventId(studentId, e.target.value).then((feeAmount) => {
      setAmount(feeAmount);
    });
  }

  function handleChangeAmount(e) {
    setAmount(Number(e.target.value));
  }

  function handleToggleWaivedOff(e) {
    const isChecked = e.target.checked;
    setIsWaivedOff(isChecked);
    if (isChecked) setAmount(0);
    else
      getFeeAmountByEventId(studentId, eventId).then((feeAmount) => {
        setAmount(feeAmount);
      });
  }

  function handleChangeNotes(e) {
    setNotes(e.target.value);
  }

  async function handleAddTransaction(transaction) {
    await addTransaction(transaction);
    navigate("/transactions");
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    if (!studentId || !eventId) return;

    const newTransaction = {
      studentId: doc(db, "students", studentId),
      eventId: doc(db, "events", eventId),
      amount,
      status: isWaivedOff ? "Waived Off" : "Paid",
      notes,
    };

    handleAddTransaction(newTransaction).then(() => {
      setStudentId("");
      setEventId("");
      setAmount("");
      setIsWaivedOff(false);
    });
  }

  return (
    <div className="container">
      <h1>Add Transaction</h1>
      <form className="form" onSubmit={handleFormSubmit}>
        <div>
          <strong>Student Name: </strong>
          <select value={studentId} onChange={handleChangeStudentName}>
            <option value="" disabled></option>
            {studentList.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <strong>Event Type: </strong>
          <select value={eventId} onChange={handleChangeEventType}>
            <option value="" disabled></option>
            {eventList.map((event) => (
              <option key={event.id} value={event.id}>
                {event.eventType}
              </option>
            ))}
          </select>
        </div>
        <div>
          <strong>Amount: </strong>
          <input
            type="number"
            value={amount}
            onChange={handleChangeAmount}
          ></input>
        </div>
        <div>
          <strong>Waived Off: </strong>
          <input
            type="checkbox"
            checked={isWaivedOff}
            onChange={handleToggleWaivedOff}
          ></input>
        </div>
        <div>
          <strong>Notes: </strong>
          <textarea
            value={notes}
            onChange={handleChangeNotes}
            placeholder="Add notes regarding the transacation..."
            rows={4}
            cols={22}
          ></textarea>
        </div>
        <button>Add Transaction</button>
      </form>
    </div>
  );
}
