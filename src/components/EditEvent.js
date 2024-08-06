import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById, updateEvent } from "../firestoreServices";

export function EditEvent() {
  const { id } = useParams();
  const [eventType, setEventType] = useState("");
  const [baseFee, setBaseFee] = useState("");
  const navigate = useNavigate();

  function handleChangeEventType(e) {
    setEventType(e.target.value);
  }

  function handleChangeBaseFee(e) {
    setBaseFee(Number(e.target.value));
  }

  useEffect(() => {
    const fetchEvents = async () => {
      const selectedEvent = await getEventById(id);
      setEventType(selectedEvent.eventType);
      setBaseFee(selectedEvent.baseFee);
    };
    fetchEvents();
  }, [id]);

  async function handleUpdateEvent(event) {
    await updateEvent(id, event);
    navigate("/events");
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    if (!eventType) return;

    const updatedEvent = {
      eventType,
      baseFee,
    };

    handleUpdateEvent(updatedEvent).then(() => {
      setEventType("");
      setBaseFee("");
    });
  }

  return (
    <div className="container">
      <h1>Add Event</h1>
      <form className="form" onSubmit={handleFormSubmit}>
        <div>
          <strong>Event Type: </strong>
          <input
            type="text"
            value={eventType}
            onChange={handleChangeEventType}
          ></input>
        </div>
        <div>
          <strong>Base Fee: </strong>
          <input
            type="text"
            value={baseFee}
            onChange={handleChangeBaseFee}
          ></input>
        </div>
        <button>Update</button>
      </form>
    </div>
  );
}
