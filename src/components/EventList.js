import { Event } from "./Event";

export function EventList({ eventList, onDelete }) {
  return (
    <>
      <h1>Event List</h1>
      {eventList.map((event) => (
        <Event key={event.id} event={event} onDelete={onDelete} />
      ))}
    </>
  );
}
