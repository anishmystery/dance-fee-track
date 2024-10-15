import { Alert, Chip } from "@mui/material";
import { getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export function Transaction({ transaction, onDelete }) {
  const [studentName, setStudentName] = useState("");
  const [eventType, setEventType] = useState("");

  useEffect(() => {
    const fetchStudentEventDetailsFromTransaction = async () => {
      if (transaction.studentId) {
        const studentRef = transaction.studentId;
        const studentDoc = await getDoc(studentRef);
        setStudentName(studentDoc.data().name);
      } else setStudentName("");
      const eventRef = transaction.eventId;
      const eventDoc = await getDoc(eventRef);
      setEventType(eventDoc.data().eventType);
    };
    fetchStudentEventDetailsFromTransaction();
  }, [transaction]);
  return (
    <div className="card-view shadow" key={transaction.id}>
      <div className="card-content">
        <div className="card-data">
          <p>{studentName}</p>
          <Chip
            label={eventType}
            variant="outlined"
            color="primary"
            size="small"
            sx={{ margin: "0 0 10px 0" }}
          ></Chip>
          <p
            className={
              transaction.status === "Paid"
                ? "paid"
                : transaction.status === "Paused"
                ? "paused"
                : "waived-off"
            }
          >
            {transaction.status}
          </p>
          <p>
            {new Intl.DateTimeFormat("en-US", {
              month: "long",
              day: "2-digit",
              year: "numeric",
            }).format(transaction.transactionDate.toDate())}
          </p>
        </div>
        <strong>${transaction.amount}</strong>
      </div>
      {transaction.notes ? (
        <Alert
          severity="info"
          color={
            transaction.status === "Paid"
              ? "success"
              : transaction.status === "Paused"
              ? "warning"
              : "info"
          }
          sx={{ marginTop: "10px" }}
        >
          {transaction.notes}
        </Alert>
      ) : null}
    </div>
  );
}
