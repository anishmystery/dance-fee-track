import { useEffect, useState } from "react";
import {
  addTransaction,
  getEventById,
  getEvents,
  getStudentEventMappingByEventId,
  getStudentEventMappingByStudentIdAndEventId,
  getStudents,
} from "../firestoreServices";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebaseConfigurations";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";

export function AddTransaction() {
  const location = useLocation();
  const { transactionType } = location.state || {};

  return (
    <div className="container">
      <h2>Add Transaction</h2>
      {transactionType === "Ulpa's Dance Academy" ? (
        <UlpasDanceAcademy transactionType={transactionType} />
      ) : (
        <GeethasDanceAcademy transactionType={transactionType} />
      )}
    </div>
  );
}

function UlpasDanceAcademy({ transactionType }) {
  const [studentList, setStudentList] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [eventList, setEventList] = useState([]);
  const [eventId, setEventId] = useState("");
  const [amount, setAmount] = useState("");
  const [isWaivedOff, setIsWaivedOff] = useState(false);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [showStudentField, setShowStudentField] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeStudents = async () => {
      const allStudents = await getStudents();
      setStudentList(allStudents);
    };
    initializeStudents();
  }, []);

  useEffect(() => {
    const initializeEvents = async () => {
      const allEvents = await getEvents();
      setEventList(allEvents);
    };
    initializeEvents();
  }, []);

  async function filterStudentsByEventId(eventId) {
    const mappings = await getStudentEventMappingByEventId(eventId);
    setShowStudentField(mappings.length !== 0 ? true : false);
    const students = [];
    for (const mapping of mappings) {
      const docRef = mapping.studentId;
      const studentDoc = await getDoc(docRef);
      students.push({ id: studentDoc.id, ...studentDoc.data() });
    }
    setStudentList(students);
  }

  async function getFeeAmountByEventId(studentId = "", eventId) {
    if (!eventId) return "";
    const querySnapshot = showStudentField
      ? await getStudentEventMappingByStudentIdAndEventId(studentId, eventId)
      : await getEventById(eventId);
    const docSnapshot = querySnapshot.docs[0];
    const mapping = { ...docSnapshot.data() };
    return showStudentField ? mapping.feeAmount : mapping.baseFee;
  }

  function handleChangeStudentName(e) {
    setStudentId(e.target.value);
    if (showStudentField)
      getFeeAmountByEventId(e.target.value, eventId).then((feeAmount) => {
        setAmount(feeAmount);
      });
    if (e.target.value)
      setErrors((errors) => ({ ...errors, studentRequired: undefined }));
  }

  function handleChangeEventType(e) {
    setEventId(e.target.value);
    filterStudentsByEventId(e.target.value);
    if (e.target.value)
      setErrors((errors) => ({
        ...errors,
        eventRequired: undefined,
        amountRequired: undefined,
      }));
  }

  function handleChangeAmount(e) {
    setAmount(e.target.value);
    if (e.target.value)
      setErrors((errors) => ({ ...errors, amountRequired: undefined }));
  }

  function handleToggleWaivedOff(e) {
    const isChecked = e.target.checked;
    setIsWaivedOff(isChecked);
    if (isChecked) setAmount(0);
    else
      getFeeAmountByEventId(studentId, eventId).then((feeAmount) => {
        setAmount(feeAmount);
      });
  }

  function handleChangeNotes(e) {
    setNotes(e.target.value);
  }

  function handleBlurStudentName(e) {
    if (!e.target.value && showStudentField)
      setErrors((errors) => ({
        ...errors,
        studentRequired: "Student is required",
      }));
  }

  function handleBlurEventType(e) {
    if (!e.target.value)
      setErrors((errors) => ({
        ...errors,
        eventRequired: "Event is required",
      }));
  }

  function handleBlurAmount(e) {
    if (!e.target.value)
      setErrors((errors) => ({
        ...errors,
        amountRequired: "Amount is required",
      }));
  }

  async function handleAddTransaction(transaction, transactionType) {
    await addTransaction(transaction, transactionType);
    navigate("/transactions");
  }

  function validateForm() {
    const newErrors = {};
    if (!studentId && showStudentField)
      newErrors.studentRequired = "Student is required";
    if (!eventId) newErrors.eventRequired = "Event is required";
    if (!amount) newErrors.amountRequired = "Amount is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    const newTransaction = {
      studentId: studentId ? doc(db, "students", studentId) : null,
      eventId: doc(db, "events", eventId),
      amount: Number(amount),
      status: isWaivedOff ? "Waived Off" : "Paid",
      notes,
    };

    handleAddTransaction(newTransaction, transactionType).then(() => {
      setStudentId("");
      setEventId("");
      setAmount("");
      setIsWaivedOff(false);
    });
  }

  return (
    <form className="form" onSubmit={handleFormSubmit}>
      <FormControl
        fullWidth
        margin="normal"
        size="small"
        error={!!errors.eventRequired}
      >
        <InputLabel id="events-label">Events</InputLabel>
        <Select
          labelId="events-label"
          value={eventId}
          onChange={handleChangeEventType}
          label="Events"
          onBlur={handleBlurEventType}
        >
          {eventList.map((event) => (
            <MenuItem key={event.id} value={event.id}>
              {event.eventType}
            </MenuItem>
          ))}
        </Select>
        {errors.eventRequired && (
          <FormHelperText>{errors.eventRequired}</FormHelperText>
        )}
      </FormControl>
      {showStudentField && (
        <FormControl
          fullWidth
          margin="normal"
          size="small"
          error={!!errors.studentRequired}
        >
          <InputLabel id="students-label">Students</InputLabel>
          <Select
            labelId="students-label"
            value={studentId}
            onChange={handleChangeStudentName}
            label="Students"
            onBlur={handleBlurStudentName}
          >
            {studentList.map((student) => (
              <MenuItem key={student.id} value={student.id}>
                {student.name}
              </MenuItem>
            ))}
          </Select>
          {errors.studentRequired && (
            <FormHelperText>{errors.studentRequired}</FormHelperText>
          )}
        </FormControl>
      )}
      <FormControl
        fullWidth
        size="small"
        margin="normal"
        error={!!errors.amountRequired}
      >
        <InputLabel htmlFor="amount-label">Amount</InputLabel>
        <OutlinedInput
          id="amount-label"
          label="Amount"
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          value={amount}
          onChange={handleChangeAmount}
          onBlur={handleBlurAmount}
        ></OutlinedInput>
        {errors.amountRequired && (
          <FormHelperText>{errors.amountRequired}</FormHelperText>
        )}
      </FormControl>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox checked={isWaivedOff} onChange={handleToggleWaivedOff} />
          }
          label="Waived Off"
        />
      </FormGroup>
      <TextField
        variant="outlined"
        fullWidth
        label="Notes"
        margin="normal"
        size="small"
        multiline
        rows={3}
        placeholder="Notes regarding the transaction..."
        value={notes}
        onChange={handleChangeNotes}
      ></TextField>
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ marginTop: "16px" }}
      >
        Save
      </Button>
    </form>
  );
}

function GeethasDanceAcademy({ transactionType }) {
  const baseFee = 100;
  const [numberOfStudents, setNumberOfStudents] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function handleChangeNumberOfStudents(e) {
    setNumberOfStudents(e.target.value);
    if (e.target.value) {
      setAmount(Number(e.target.value) * baseFee);
      setErrors((errors) => ({
        ...errors,
        numberOfStudentsRequired: undefined,
      }));
    } else setAmount("");
  }

  function handleBlurNumberOfStudents(e) {
    if (!e.target.value)
      setErrors((errors) => ({
        ...errors,
        numberOfStudentsRequired: "Number of students is required",
      }));
  }

  function handleChangeAmount(e) {
    setAmount(e.target.value);
    if (e.target.value)
      setErrors((errors) => ({
        ...errors,
        amountRequired: undefined,
      }));
  }

  function handleBlurAmount(e) {
    if (!e.target.value)
      setErrors((errors) => ({
        ...errors,
        amountRequired: "Amount is required",
      }));
  }

  function handleChangeTransactionDate(e) {
    setTransactionDate(e.target.value);
    if (e.target.value)
      setErrors((errors) => ({
        ...errors,
        transactionDateRequired: undefined,
      }));
  }

  function handleBlurTransactionDate(e) {
    if (!e.target.value)
      setErrors((errors) => ({
        ...errors,
        transactionDateRequired: "Transaction date is required",
      }));
  }

  function validateForm() {
    const newErrors = {};
    if (!numberOfStudents)
      newErrors.numberOfStudentsRequired = "Number of students is required";
    if (!amount) newErrors.amountRequired = "Amount is required";
    if (!transactionDate)
      newErrors.transactionDateRequired = "Transaction date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleAddTransaction(transaction, transactionType) {
    await addTransaction(transaction, transactionType);
    navigate("/transactions");
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const newTransaction = {
      numberOfStudents: Number(numberOfStudents),
      amount: Number(amount),
      transactionDate: Timestamp.fromDate(new Date(transactionDate)),
      status: "Paid",
    };

    handleAddTransaction(newTransaction, transactionType).then(() => {
      setNumberOfStudents("");
      setAmount("");
      setTransactionDate("");
    });
  }

  return (
    <form className="form" onSubmit={handleFormSubmit}>
      <TextField
        label="Number of Students"
        margin="normal"
        size="small"
        fullWidth
        type="number"
        value={numberOfStudents}
        onChange={handleChangeNumberOfStudents}
        onBlur={handleBlurNumberOfStudents}
        error={!!errors.numberOfStudentsRequired}
        helperText={errors.numberOfStudentsRequired}
      ></TextField>
      <FormControl
        fullWidth
        size="small"
        margin="normal"
        error={!!errors.amountRequired}
      >
        <InputLabel htmlFor="amount-label">Amount</InputLabel>
        <OutlinedInput
          id="amount-label"
          label="Amount"
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          value={amount}
          onChange={handleChangeAmount}
          onBlur={handleBlurAmount}
        ></OutlinedInput>
        {errors.amountRequired && (
          <FormHelperText>{errors.amountRequired}</FormHelperText>
        )}
      </FormControl>
      <FormControl size="small" fullWidth margin="normal">
        <InputLabel shrink htmlFor="transaction-date-label">
          Transaction Date
        </InputLabel>
        <TextField
          variant="outlined"
          id="transaction-date-label"
          label="Transaction Date"
          type="date"
          value={transactionDate}
          onChange={handleChangeTransactionDate}
          onBlur={handleBlurTransactionDate}
          InputLabelProps={{ shrink: true }}
          helperText={errors.transactionDateRequired}
          error={!!errors.transactionDateRequired}
        ></TextField>
      </FormControl>
      <Button
        variant="contained"
        type="submit"
        sx={{ marginTop: "16px" }}
        fullWidth
      >
        Save
      </Button>
    </form>
  );
}
