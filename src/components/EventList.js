import { Event } from "./Event";

export function EventList({ eventList, onDelete }) {
  return (
    <div className="list-view">
      {eventList.map((event) => (
        <Event key={event.id} event={event} onDelete={onDelete} />
      ))}
    </div>
  );
}
