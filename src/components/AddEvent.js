import { useState } from "react";
import { addEvent } from "../firestoreServices";
import { useNavigate } from "react-router-dom";

export function AddEvent() {
  const [eventType, setEventType] = useState("");
  const [baseFee, setBaseFee] = useState("");
  const navigate = useNavigate();

  function handleChangeEventType(e) {
    setEventType(e.target.value);
  }

  function handleChangeBaseFee(e) {
    setBaseFee(Number(e.target.value));
  }

  async function handleAddEvent(event) {
    await addEvent(event);
    navigate("/events");
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    if (!eventType) return;

    const newEvent = {
      eventType,
      baseFee,
    };

    handleAddEvent(newEvent).then(() => {
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
        <button>Add Event</button>
      </form>
    </div>
  );
}
