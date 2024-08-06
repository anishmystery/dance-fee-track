import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
  getDoc,
  updateDoc,
  Timestamp,
  orderBy,
} from "firebase/firestore";

import { db } from "./firebaseConfigurations";

export async function getStudents() {
  const studentQuery = query(collection(db, "students"), orderBy("name"));
  const querySnapshot = await getDocs(studentQuery);
  const students = [];
  querySnapshot.docs.map((doc) => students.push({ id: doc.id, ...doc.data() }));
  return students;
}

export async function addStudent(student) {
  try {
    const docRef = await addDoc(collection(db, "students"), {
      ...student,
      createdOn: Timestamp.now(),
      modifiedOn: Timestamp.now(),
    });
    console.log(`Student successfully created with id: ${docRef.id}`);
    return docRef.id;
  } catch (e) {
    console.error(`Error creating student: ${e}`);
  }
}

export async function deleteStudent(studentId) {
  try {
    await deleteDoc(doc(db, "students", studentId));
    console.log(`Student successfully removed with id: ${studentId}`);
  } catch (e) {
    console.error(`Error removing student with id ${studentId}: ${e}`);
  }
}

export async function getStudentById(studentId) {
  const docRef = doc(db, "students", studentId);
  const docSnapshot = await getDoc(docRef);
  if (docSnapshot.exists())
    return { id: docSnapshot.id, ...docSnapshot.data() };
  else {
    console.error(`No student found with id: ${studentId}`);
    return null;
  }
}

export async function updateStudent(studentId, updatedStudent) {
  try {
    const docRef = doc(db, "students", studentId);
    await updateDoc(docRef, {
      ...updatedStudent,
      modifiedOn: Timestamp.now(),
    });
    console.log(`Student successfully updated for id: ${studentId}`);
  } catch (e) {
    console.error(`Error updating student for id ${studentId}: ${e}`);
  }
}

export async function getEvents() {
  const eventQuery = query(collection(db, "events"), orderBy("eventType"));
  const querySnapshot = await getDocs(eventQuery);
  const events = [];
  querySnapshot.docs.map((doc) => events.push({ id: doc.id, ...doc.data() }));
  return events;
}

export async function addEvent(event) {
  try {
    const docRef = await addDoc(collection(db, "events"), {
      ...event,
      createdOn: Timestamp.now(),
      modifiedOn: Timestamp.now(),
    });
    console.log(`Event successfully created with id: ${docRef.id}`);
  } catch (e) {
    console.error(`Error creating event: ${e}`);
  }
}

export async function deleteEvent(eventId) {
  try {
    await deleteDoc(doc(db, "events", eventId));
    console.log("Event successfully removed with id: ", eventId);
  } catch (e) {
    console.error(`Error removing event with id ${eventId}: ${e}`);
  }
}

export async function getEventById(eventId) {
  const docRef = doc(db, "events", eventId);
  const docSnapshot = await getDoc(docRef);
  if (docSnapshot.exists())
    return {
      id: docSnapshot.id,
      ...docSnapshot.data(),
    };
  else {
    console.error(`No event found with id: ${eventId}`);
    return null;
  }
}

export async function updateEvent(eventId, updatedEvent) {
  try {
    const docRef = doc(db, "events", eventId);
    await updateDoc(docRef, {
      ...updatedEvent,
      modifiedOn: Timestamp.now(),
    });
    console.log(`Event successfully updated for id: ${eventId}`);
  } catch (e) {
    console.error(`Error updating event for id ${eventId}: ${e}`);
  }
}

export async function addStudentEventMapping(mapping) {
  try {
    const docRef = await addDoc(collection(db, "studentsEventsMapping"), {
      ...mapping,
      createdOn: Timestamp.now(),
      modifiedOn: Timestamp.now(),
    });
    console.log(
      `Student-Event mapping successfully created with id: ${docRef.id}`
    );
  } catch (e) {
    console.error(`Error creating student-event mapping: ${e}`);
  }
}

export async function getStudentEventMappingByStudentId(studentId) {
  try {
    const studentRef = doc(db, "students", studentId);
    const mappingQuery = query(
      collection(db, "studentsEventsMapping"),
      where("studentId", "==", studentRef)
    );
    const querySnapshot = await getDocs(mappingQuery);
    const mappings = [];
    querySnapshot.docs.map((doc) =>
      mappings.push({ id: doc.id, ...doc.data() })
    );
    return mappings;
  } catch (e) {
    console.error(
      `Error fetching student-event mapping with studentId ${studentId}: ${e}`
    );
  }
}

export async function getStudentEventMappingByEventId(eventId) {
  try {
    const eventRef = doc(db, "events", eventId);
    const mappingQuery = query(
      collection(db, "studentsEventsMapping"),
      where("eventId", "==", eventRef)
    );
    const querySnapshot = await getDocs(mappingQuery);
    const mappings = [];
    querySnapshot.docs.map((doc) =>
      mappings.push({ id: doc.id, ...doc.data() })
    );
    return mappings;
  } catch (e) {
    console.error(
      `Error fetching student-event mapping with eventId ${eventId}: ${e}`
    );
  }
}

export async function getStudentEventMappingByStudentIdAndEventId(
  studentId,
  eventId
) {
  try {
    const studentRef = doc(db, "students", studentId);
    const eventRef = doc(db, "events", eventId);
    const mappingQuery = query(
      collection(db, "studentsEventsMapping"),
      where("studentId", "==", studentRef),
      where("eventId", "==", eventRef)
    );
    const querySnapshot = await getDocs(mappingQuery);

    return querySnapshot;
  } catch (e) {
    console.error(
      `Error fetching student-event mapping with studentId ${studentId} and eventId ${eventId}: ${e}`
    );
  }
}

export async function deleteStudentEventMapping(mappingId) {
  try {
    await deleteDoc(doc(db, "studentsEventsMapping", mappingId));
    console.log(
      `Student-Event mapping successfully removed with id: ${mappingId}`
    );
  } catch (e) {
    console.error(`Error removing student-event mapping ${mappingId}: ${e}`);
  }
}

export async function updateStudentEventMapping(
  studentId,
  eventId,
  updatedMapping
) {
  try {
    const querySnapshot = await getStudentEventMappingByStudentIdAndEventId(
      studentId,
      eventId
    );
    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, updatedMapping);
    console.log(
      `Student-Event mapping successfully updated for studentId ${studentId} and eventId ${eventId}`
    );
  } catch (e) {
    console.error(
      `Error updating student-event mapping for studentId ${studentId} and eventId ${eventId}: ${e}`
    );
  }
}

export async function getTransactions() {
  const transacationQuery = query(
    collection(db, "transactions"),
    orderBy("createdOn", "desc")
  );
  const querySnapshot = await getDocs(transacationQuery);
  const transactions = [];
  querySnapshot.docs.map((doc) =>
    transactions.push({ id: doc.id, ...doc.data() })
  );
  return transactions;
}

export async function addTransaction(transaction) {
  try {
    const docRef = await addDoc(collection(db, "transactions"), {
      ...transaction,
      createdOn: Timestamp.now(),
      modifiedOn: Timestamp.now(),
    });
    console.log(`Transaction successfully created with id: ${docRef.id}`);
  } catch (e) {
    console.error(`Error creating transaction: ${e}`);
  }
}

export async function checkExistingPausedTransactions(
  studentId,
  eventId,
  pauseStart,
  pauseEnd
) {
  const transactionQuery = query(
    collection(db, "transactions"),
    where("studentId", "==", studentId),
    where("eventId", "==", eventId),
    where("status", "==", "Paused"),
    where("pauseStart", ">=", pauseStart),
    where("pauseEnd", "<=", pauseEnd)
  );

  const querySnapshot = await getDocs(transactionQuery);
  return !querySnapshot.empty;
}

export async function addPausedTransaction(
  studentId,
  eventId,
  pauseStart,
  pauseEnd
) {
  try {
    const pausedTransactionExists = await checkExistingPausedTransactions(
      studentId,
      eventId,
      pauseStart,
      pauseEnd
    );
    if (pausedTransactionExists) {
      const start = new Date(pauseStart);
      const end = new Date(pauseEnd);

      // Set dates to the first day of the month
      start.setDate(1);
      end.setDate(1);

      while (start <= end) {
        const newTransaction = {
          studentId: doc(db, "students", studentId),
          eventId: doc(db, "events", eventId),
          amount: 0,
          status: "Paused",
          notes: `Enrollment paused from ${pauseStart} to ${pauseEnd}`,
          createdOn: Timestamp.fromDate(start),
          modifiedOn: Timestamp.fromDate(start),
        };
        const docRef = await addDoc(collection(db, "transactions"), {
          ...newTransaction,
        });
        console.log(`Transaction successfully created with id: ${docRef.id}`);
        start.setMonth(start.getMonth() + 1);
      }
    }
  } catch (e) {
    console.error(`Error creating transaction: ${e}`);
  }
}

// export async function deleteTransaction(transactionId) {
//   try {
//     await deleteDoc(doc(db, "transactions", transactionId));
//     console.log(`Transaction successfully removed with id: ${transactionId}`);
//   } catch (e) {
//     console.error(`Error removing transaction with id ${transactionId}: ${e}`);
//   }
// }

export async function deleteTransaction(transactionId) {
  try {
    const docRef = doc(db, "transactions", transactionId);
    await updateDoc(docRef, { status: "Cancelled" });
    console.log(`Transaction successfully deleted for id: ${transactionId}`);
  } catch (e) {
    console.error(`Error deleting transaction for id ${transactionId}: ${e}`);
  }
}
