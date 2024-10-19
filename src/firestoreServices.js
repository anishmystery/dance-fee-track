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
  limit,
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
      // where("status", "==", "Active")
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
      where("eventId", "==", eventRef),
      where("status", "==", "Active")
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
    await updateDoc(docRef, { ...updatedMapping, modifiedOn: Timestamp.now() });
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

export async function addTransaction(transaction, transactionType) {
  try {
    if (transactionType === "Ulpa's Dance Academy") {
      const docRef = await addDoc(collection(db, "transactions"), {
        ...transaction,
        createdOn: Timestamp.now(),
        modifiedOn: Timestamp.now(),
      });
      console.log(`Transaction successfully created with id: ${docRef.id}`);
    } else {
      const docRef = await addDoc(collection(db, "geethaAcademyTransactions"), {
        ...transaction,
        createdOn: Timestamp.now(),
        modifiedOn: Timestamp.now(),
      });
      console.log(
        `Transaction successfully created for Geetha's Academy with id: ${docRef.id}`
      );
    }
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
    if (!pausedTransactionExists) {
      const start = new Date(pauseStart);
      const end = new Date(pauseEnd);
      const formattedPauseStart = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }).format(new Date(pauseStart));
      const formattedPauseEnd = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }).format(new Date(pauseEnd));

      // Set dates to the first day of the month
      start.setDate(1);
      end.setDate(1);

      while (start <= end) {
        const newTransaction = {
          studentId: doc(db, "students", studentId),
          eventId: doc(db, "events", eventId),
          amount: 0,
          status: "Paused",
          notes: `Enrollment paused from ${formattedPauseStart} to ${formattedPauseEnd}`,
          transactionDate: Timestamp.fromDate(start),
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

export async function getOldestAndNewestTransactionYears() {
  const oldestTransactionQuery = query(
    collection(db, "transactions"),
    orderBy("transactionDate", "asc"),
    limit(1)
  );
  const oldestTransactionSnapshot = await getDocs(oldestTransactionQuery);
  const oldestTransaction = oldestTransactionSnapshot.docs[0]
    .data()
    .transactionDate.toDate()
    .getFullYear();
  const newestTransactionQuery = query(
    collection(db, "transactions"),
    orderBy("transactionDate", "desc"),
    limit(1)
  );
  const newestTransactionSnapshot = await getDocs(newestTransactionQuery);
  const newestTransaction = newestTransactionSnapshot.docs[0]
    .data()
    .transactionDate.toDate()
    .getFullYear();

  return { oldestTransaction, newestTransaction };
}

export async function getTrasactionsForYear(year, reportType) {
  try {
    const startOfYear = Timestamp.fromDate(new Date(year, 0, 1));
    const endOfYear = Timestamp.fromDate(new Date(year, 11, 31, 23, 59, 59));

    const transactionQuery =
      reportType === "Geetha's Dance Academy"
        ? query(
            collection(db, "geethaAcademyTransactions"),
            where("transactionDate", ">=", startOfYear),
            where("transactionDate", "<=", endOfYear)
          )
        : query(
            collection(db, "transactions"),
            where("transactionDate", ">=", startOfYear),
            where("transactionDate", "<=", endOfYear)
          );

    const querySnapshot = await getDocs(transactionQuery);
    const transactions = [];

    querySnapshot.docs.map((doc) =>
      transactions.push({ id: doc.id, ...doc.data() })
    );
    return transactions;
  } catch (e) {
    console.error(`Error fetching transactions for the year ${year}: ${e}`);
  }
}

export async function generateReport(year, reportType) {
  try {
    const transactions = await getTrasactionsForYear(year, reportType);
    const report = {};
    const verticalTotals = Array(12).fill(0);
    const numberOfStudents = Array(12).fill(0);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    if (reportType === "Students" || reportType === "Events") {
      const entities =
        reportType === "Students" ? await getStudents() : await getEvents();
      const entityMap =
        reportType === "Students"
          ? new Map(entities.map((student) => [student.id, student.name]))
          : new Map(entities.map((event) => [event.id, event.eventType]));
      let eventMap;

      entities.forEach((entity) => {
        report[entityMap.get(entity.id)] = {
          payments: Array(12).fill(0),
          total: 0,
          ...(reportType === "Students" && {
            paymentDetails: Array(12)
              .fill(null)
              .map(() => []),
          }),
        };
      });

      if (reportType === "Students") {
        const events = await getEvents();
        eventMap = new Map(events.map((event) => [event.id, event.eventType]));

        for (const student of entities) {
          const mappings = await getStudentEventMappingByStudentId(student.id);
          const enrollmentMonth = student.createdOn.toDate().getMonth();
          const enrollmentYear = student.createdOn.toDate().getFullYear();

          if (enrollmentYear > year) {
            // Set payments for all months to null if the student was not enrolled in the report year
            report[entityMap.get(student.id)].payments.fill(null);
            continue;
          }

          for (let month = 0; month < 12; month++) {
            if (year === enrollmentYear && month < enrollmentMonth) {
              report[entityMap.get(student.id)].payments[month] = null;
              continue;
            }
            if (year === currentYear && month > currentMonth) {
              report[entityMap.get(student.id)].payments[month] = null;
            }
          }

          mappings.forEach((mapping) => {
            const eventName = eventMap.get(mapping.eventId.id);
            const inactiveDateMonth = mapping.inactiveDate
              ? mapping.inactiveDate.toDate().getMonth()
              : null;
            const inactiveDateYear = mapping.inactiveDate
              ? mapping.inactiveDate.toDate().getFullYear()
              : null;
            for (let month = 0; month < 12; month++)
              if (
                inactiveDateYear === year &&
                inactiveDateMonth !== null &&
                month >= inactiveDateMonth
              ) {
                report[entityMap.get(student.id)].payments[month] = NaN;
                report[entityMap.get(student.id)].paymentDetails[month].push({
                  eventName,
                  amount: NaN,
                  status: "Inactive",
                  notes: "",
                });
              } else
                report[entityMap.get(student.id)].paymentDetails[month].push({
                  eventName,
                  amount: 0,
                  status: "Not Paid",
                  notes: "",
                });
          });
        }
      }

      if (reportType === "Events") {
        for (const event of entities) {
          // Handle future months for the current year
          for (let month = 0; month < 12; month++) {
            if (year === currentYear && month > currentMonth) {
              report[entityMap.get(event.id)].payments[month] = null;
              continue;
            }
          }
        }
      }

      const filteredTransactions =
        reportType === "Students"
          ? transactions.filter((transaction) => transaction.studentId !== null)
          : transactions;

      filteredTransactions.forEach((transaction) => {
        const { studentId, eventId, amount, transactionDate, status, notes } =
          transaction;
        const entityName =
          reportType === "Students"
            ? entityMap.get(studentId.id)
            : entityMap.get(eventId.id);
        if (entityName) {
          const monthIndex = transactionDate.toDate().getMonth();

          if (
            reportType === "Students" &&
            transactionDate.toDate().getMonth() > monthIndex
          ) {
            report[entityName].payments[monthIndex] = null;
          }

          report[entityName].payments[monthIndex] += amount;
          report[entityName].total += amount;

          if (reportType === "Students") {
            const payDetail = report[entityName].paymentDetails[
              monthIndex
            ].find((item) => item.eventName === eventMap.get(eventId.id));
            if (payDetail && payDetail.status !== "Inactive") {
              payDetail.amount += amount;
              payDetail.status = status;
              payDetail.notes = notes;
            }
          }
          verticalTotals[monthIndex] += amount;
        }
      });

      // if (reportType === "Students") {
      //   for (const student in report) {
      //     for (let month = 0; month < 12; month++) {
      //       const paymentDetails = report[student].paymentDetails[month];
      //       const allInactive = paymentDetails.every(
      //         (detail) => detail.status === "Inactive"
      //       );
      //       if (allInactive) report[student].payments[month] = "N/A";
      //     }
      //   }
      // }
    } else if (reportType === "Geetha's Dance Academy") {
      transactions.forEach((transaction) => {
        const monthIndex = transaction.transactionDate.toDate().getMonth();
        verticalTotals[monthIndex] += transaction.amount;
        numberOfStudents[monthIndex] += transaction.numberOfStudents || 0;
      });
    }

    const grandTotal = verticalTotals.reduce((acc, curr) => acc + curr, 0);

    return reportType === "Geetha's Dance Academy"
      ? { report: [], numberOfStudents, verticalTotals, grandTotal }
      : { report, verticalTotals, grandTotal };
  } catch (e) {
    console.error(
      `Error generating ${reportType.toLowerCase()} report for the year ${year}: ${e}`
    );
  }
}
