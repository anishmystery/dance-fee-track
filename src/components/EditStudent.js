import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  addPausedTransaction,
  addStudentEventMapping,
  getEvents,
  getStudentById,
  getStudentEventMappingByStudentId,
  updateStudent,
  updateStudentEventMapping,
} from "../firestoreServices";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebaseConfigurations";

export function EditStudent() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [parentName, setParentName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [eventList, setEventList] = useState([]);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [selectedNewEvent, setSelectedNewEvent] = useState("");
  const [showNewEventEnrollment, setShowNewEventEnrollment] = useState(false);
  const [newEventAdded, setNewEventAdded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      const selectedStudent = await getStudentById(id);
      setName(selectedStudent.name);
      setParentName(selectedStudent.parentName);
      setContactNumber(selectedStudent.contactNumber.join(","));
    };
    fetchStudent();
  }, [id]);

  useEffect(() => {
    const fetchStudentEventMapping = async () => {
      const mappings = await getStudentEventMappingByStudentId(id);
      const events = [];
      for (const mapping of mappings) {
        const pauseStart = mapping.pauseStart
          ? mapping.pauseStart.toDate().toISOString().split("T")[0]
          : mapping.pauseStart;
        const pauseEnd = mapping.pauseEnd
          ? mapping.pauseEnd.toDate().toISOString().split("T")[0]
          : mapping.pauseEnd;
        const eventRef = mapping.eventId;
        const eventDoc = await getDoc(eventRef);
        events.push({
          id: eventDoc.id,
          ...eventDoc.data(),
          status: mapping.status,
          pauseStart,
          pauseEnd,
        });
      }
      setEventList(events);
    };
    fetchStudentEventMapping();
  }, [id, newEventAdded]);

  useEffect(() => {
    const initializeEvents = async () => {
      const events = await getEvents();
      const enrolledEvents = eventList.map((event) => event.id);
      setAvailableEvents(
        events.filter((event) => !enrolledEvents.includes(event.id))
      );
    };
    initializeEvents();
  }, [eventList]);

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeParentName(e) {
    setParentName(e.target.value);
  }

  function handleChangeContactNumber(e) {
    setContactNumber(e.target.value);
  }

  function handleChangeStatus(e, eventId) {
    setEventList((eventList) =>
      eventList.map((event) =>
        event.id === eventId ? { ...event, status: e.target.value } : event
      )
    );
  }

  function handleChangePauseStart(e, eventId) {
    setEventList((eventList) =>
      eventList.map((event) =>
        event.id === eventId ? { ...event, pauseStart: e.target.value } : event
      )
    );
  }

  function handleChangePauseEnd(e, eventId) {
    setEventList((eventList) =>
      eventList.map((event) =>
        event.id === eventId ? { ...event, pauseEnd: e.target.value } : event
      )
    );
  }

  function handleToggleShowNewEventEnrollment() {
    setShowNewEventEnrollment(true);
  }

  function handleChangeNewEvent(e) {
    setSelectedNewEvent(e.target.value);
  }

  async function handleOnClickOK() {
    if (selectedNewEvent) {
      const studentRef = doc(db, "students", id);
      const eventRef = doc(db, "events", selectedNewEvent);
      const eventSnapshot = await getDoc(eventRef);
      const feeAmount = eventSnapshot.data().baseFee;
      const mapping = {
        studentId: studentRef,
        eventId: eventRef,
        status: "Active",
        feeAmount,
        pauseStart: "",
        pauseEnd: "",
      };
      await addStudentEventMapping(mapping);
      setNewEventAdded((newEventAdded) => !newEventAdded);
      setShowNewEventEnrollment(false);
    }
  }

  function handleOnClickCancel() {
    setSelectedNewEvent("");
    setShowNewEventEnrollment(false);
  }

  async function handleUpdateStudent(student, eventList) {
    await updateStudent(id, student);
    await Promise.all(
      eventList.map(async (event) => {
        const updatedMapping = {
          status: event.status,
          pauseStart: event.pauseStart
            ? Timestamp.fromDate(new Date(event.pauseStart))
            : event.pauseStart,
          pauseEnd: event.pauseEnd
            ? Timestamp.fromDate(new Date(event.pauseEnd))
            : event.pauseEnd,
        };
        await updateStudentEventMapping(id, event.id, updatedMapping);
        if (event.status === "Paused") {
          await addPausedTransaction(
            id,
            event.id,
            event.pauseStart,
            event.pauseEnd
          );
        }
      })
    );
    navigate("/students");
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    if (!name || !parentName || !contactNumber) return null;

    const updatedStudent = {
      name,
      parentName,
      contactNumber: contactNumber.split(","),
    };

    handleUpdateStudent(updatedStudent, eventList).then(() => {
      setName("");
      setParentName("");
      setContactNumber("");
      setEventList([]);
    });
  }

  return (
    <div className="container">
      <h1>Edit Student</h1>
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
          <strong>Event Details: </strong>
          {eventList.map((event) => (
            <div key={event.id} className="card-view">
              <p>Event Name: {event.eventType}</p>
              <span>Enrollment Status: </span>
              <select
                value={event.status}
                onChange={(e) => {
                  handleChangeStatus(e, event.id);
                }}
              >
                <option value="" disabled></option>
                <option value="Active">Active</option>
                <option value="Paused">Pause</option>
                <option value="Inactive">Inactive</option>
              </select>
              {event.status === "Paused" ? (
                <>
                  <div>
                    <span>Enrollment Pause Start: </span>
                    <input
                      type="date"
                      value={event.pauseStart}
                      onChange={(e) => {
                        handleChangePauseStart(e, event.id);
                      }}
                    ></input>
                  </div>
                  <div>
                    <span>Enrollment Pause End: </span>
                    <input
                      type="date"
                      value={event.pauseEnd}
                      onChange={(e) => {
                        handleChangePauseEnd(e, event.id);
                      }}
                    ></input>
                  </div>
                </>
              ) : null}
            </div>
          ))}
        </div>
        <div>
          {!showNewEventEnrollment ? (
            <button type="button" onClick={handleToggleShowNewEventEnrollment}>
              Enroll to a new event
            </button>
          ) : (
            <div className="card-view">
              <div>
                {availableEvents.length !== 0 ? (
                  <select
                    value={selectedNewEvent}
                    onChange={handleChangeNewEvent}
                  >
                    <option value="" disabled>
                      --Select an event--
                    </option>
                    {availableEvents.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.eventType}
                      </option>
                    ))}
                  </select>
                ) : (
                  <strong>No events to enroll</strong>
                )}
              </div>
              <button type="button" onClick={handleOnClickOK}>
                OK
              </button>
              <button type="button" onClick={handleOnClickCancel}>
                Cancel
              </button>
            </div>
          )}
        </div>
        <button>Update</button>
      </form>
    </div>
  );
}
