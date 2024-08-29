import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStudentEventMappingByStudentId } from "../firestoreServices";
import { getDoc } from "firebase/firestore";
import { Chip } from "@mui/material";

export function Student({ student, onDelete }) {
  const [eventTypes, setEventTypes] = useState([]);

  useEffect(() => {
    const fetchStudentEventMapping = async () => {
      const mappings = await getStudentEventMappingByStudentId(student.id);
      const events = [];
      for (const mapping of mappings) {
        const eventRef = mapping.eventId;
        const eventDoc = await getDoc(eventRef);
        events.push(eventDoc.data().eventType);
      }
      setEventTypes(events);
    };
    fetchStudentEventMapping();
  }, [student]);
  return (
    <Link className="no-underline" to={`/students/edit/${student.id}`}>
      <div className="card-view shadow" key={student.id}>
        <div className="card-content">
          <div className="card-data">
            <p>{student.name}</p>
            <p>
              Enrollment Date:{" "}
              {new Intl.DateTimeFormat("en-US", {
                month: "long",
                day: "2-digit",
                year: "numeric",
              }).format(student.createdOn.toDate())}
            </p>
            {eventTypes.map((eventType) => (
              <Chip
                key={eventType}
                label={eventType}
                variant="outlined"
                color="primary"
                size="small"
                sx={{ marginTop: "10px", marginRight: "5px" }}
              ></Chip>
            ))}
          </div>
          {/* <i onClick={() => onDelete(student)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000"
          >
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM400-280q17 0 28.5-11.5T440-320v-280q0-17-11.5-28.5T400-640q-17 0-28.5 11.5T360-600v280q0 17 11.5 28.5T400-280Zm160 0q17 0 28.5-11.5T600-320v-280q0-17-11.5-28.5T560-640q-17 0-28.5 11.5T520-600v280q0 17 11.5 28.5T560-280ZM280-720v520-520Z" />
          </svg>
        </i> */}
        </div>
      </div>
    </Link>
  );
}
