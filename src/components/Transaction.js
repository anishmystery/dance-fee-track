import { getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export function Transaction({ transaction, onDelete }) {
  const [studentName, setStudentName] = useState("");
  const [eventType, setEventType] = useState("");

  useEffect(() => {
    const fetchStudentEventDetailsFromTransaction = async () => {
      const studentRef = transaction.studentId;
      const studentDoc = await getDoc(studentRef);
      setStudentName(studentDoc.data().name);
      const eventRef = transaction.eventId;
      const eventDoc = await getDoc(eventRef);
      setEventType(eventDoc.data().eventType);
    };
    fetchStudentEventDetailsFromTransaction();
  }, [transaction]);
  return (
    <div className="card-view" key={transaction.id}>
      <div className="card-content">
        <div className="card-data">
          <p>
            <strong>Student Name: </strong>
            {studentName}
          </p>
          <p>
            <strong>Event Type: </strong>
            {eventType}
          </p>
          <p>
            <strong>Amount: </strong>${transaction.amount}
          </p>
          <p>
            <strong>Status: </strong>
            {transaction.status}
          </p>
          <p>
            <strong>Transaction Date: </strong>
            {transaction.createdOn.toDate().toLocaleString()}
          </p>
          <p>
            {transaction.notes ? (
              <>
                <strong>Notes: </strong>
                {transaction.notes}
              </>
            ) : null}
          </p>
        </div>
        <i onClick={() => onDelete(transaction)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16px"
            viewBox="0 -960 960 960"
            width="16px"
            fill="#000"
          >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </i>
      </div>
    </div>
  );
}
