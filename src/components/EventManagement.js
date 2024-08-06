import { useState, useEffect } from "react";
import {
  getEvents,
  deleteEvent,
  getStudentEventMappingByEventId,
  deleteStudentEventMapping,
} from "../firestoreServices";
import { Link } from "react-router-dom";
import { EventList } from "./EventList";
import { ConfirmationModal } from "./ConfirmationModal";

export function EventManagement() {
  const [eventList, setEventList] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const initializeEvents = async () => {
      const allEvents = await getEvents();
      setEventList(allEvents);
    };
    initializeEvents();
  }, []);

  function handleOnDelete(student) {
    setIsModalOpen(true);
    setSelectedEvent(student);
  }

  function handleModalClose() {
    setIsModalOpen(false);
    setSelectedEvent();
  }

  async function handleModalConfirm() {
    if (selectedEvent) {
      await deleteEvent(selectedEvent.id);
      const mappings = await getStudentEventMappingByEventId(selectedEvent.id);
      for (const mapping of mappings) {
        await deleteStudentEventMapping(mapping.id);
      }
      setEventList((eventList) =>
        eventList.filter((event) => event.id !== selectedEvent.id)
      );
      handleModalClose();
    }
  }

  return (
    <div className="container">
      <h1>Event Management</h1>
      <Link to="/events/add">
        <button>Add Event</button>
      </Link>
      <EventList eventList={eventList} onDelete={handleOnDelete} />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        message={`Are you sure you want to delete ${
          selectedEvent ? selectedEvent.name : ""
        }`}
      />
    </div>
  );
}