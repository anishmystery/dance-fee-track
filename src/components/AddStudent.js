import { useState, useEffect } from "react";
import {
  getEvents,
  addStudent,
  addStudentEventMapping,
} from "../firestoreServices";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfigurations";
import {
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

export function AddStudent() {
  const [name, setName] = useState("");
  const [parentName, setParentName] = useState("");
  const [contactNumbers, setContactNumbers] = useState([""]);
  const [eventList, setEventList] = useState([]);
  const [eventIds, setEventIds] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const status = "Active";

  useEffect(() => {
    const initializeEvents = async () => {
      const allEvents = await getEvents();
      setEventList(allEvents);
    };
    initializeEvents();
  }, []);

  function formatContactNumber(contactNumber) {
    const cleaned = ("" + contactNumber).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

    if (match) {
      return !match[2]
        ? match[1]
        : `(${match[1]})-${match[2]}${match[3] ? "-" + match[3] : ""}`;
    }
    return contactNumber;
  }

  function handleChangeName(e) {
    setName(e.target.value);
    if (e.target.value)
      setErrors((errors) => ({
        ...errors,
        nameRequired: undefined,
      }));
  }

  function handleBlurName(e) {
    if (!e.target.value)
      setErrors((errors) => ({
        ...errors,
        nameRequired: "Student Name is required",
      }));
  }

  function handleChangeParentName(e) {
    setParentName(e.target.value);
  }

  function handleChangeContactNumber(e, index) {
    const newContactNumbers = contactNumbers.slice();
    newContactNumbers[index] = formatContactNumber(e.target.value);
    setContactNumbers(newContactNumbers);

    if (e.target.value)
      setErrors((errors) => ({
        ...errors,
        [`contactNumberFormat_${index}`]: undefined,
        contactNumberRequired: undefined,
      }));
  }

  function handleAddMoreContactNumbers() {
    setContactNumbers([...contactNumbers, ""]);
    if (contactNumbers.filter(Boolean).length > 0)
      setErrors((errors) => ({
        ...errors,
        contactNumberRequired: undefined,
      }));
  }

  function handleRemoveContactNumber(index) {
    const newContactNumbers = contactNumbers.slice();
    newContactNumbers.splice(index, 1);
    setContactNumbers(newContactNumbers);
    setErrors((errors) => ({
      ...errors,
      [`contactNumberFormat_${index}`]: undefined,
    }));
  }

  function handleBlurContactNumber(e, index) {
    const contactNumberRegex = /^\(\d{3}\)-\d{3}-\d{4}$/;
    const contactNumber = contactNumbers[index];
    const newErrors = { ...errors };

    if (!contactNumber) {
      newErrors.contactNumberRequired = "At least 1 contact number is required";
    } else if (!contactNumberRegex.test(contactNumber)) {
      newErrors[`contactNumberFormat_${index}`] =
        "Contact number should be in (XXX)-XXX-XXXX format";
    }
    setErrors(newErrors);
  }

  function handleChangeEventType(e) {
    const options = e.target.options;
    const selectedEvents = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selectedEvents.push(options[i].value);
    }
    setEventIds(selectedEvents);
    if (selectedEvents.length > 0) {
      setErrors((errors) => ({
        ...errors,
        eventRequired: undefined,
      }));
    }
  }

  function handleBlurEventType(e) {
    if (eventIds.length === 0)
      setErrors((errors) => ({
        ...errors,
        eventRequired: "At least 1 event is required",
      }));
  }

  async function handleAddStudent(student, eventIds, status) {
    const studentId = await addStudent(student);
    for (const eventId of eventIds) {
      const studentRef = doc(db, "students", studentId);
      const eventRef = doc(db, "events", eventId);
      const eventSnapshot = await getDoc(eventRef);
      const feeAmount = eventSnapshot.data().baseFee;
      const mapping = {
        studentId: studentRef,
        eventId: eventRef,
        status,
        feeAmount,
        pauseStart: "",
        pauseEnd: "",
      };
      await addStudentEventMapping(mapping);
    }
    navigate("/students");
  }

  function validateForm() {
    const contactNumberRegex = /^\(\d{3}\)-\d{3}-\d{4}$/;
    const newErrors = {};
    if (!name) newErrors.nameRequired = "Student Name is required";
    console.log(eventIds.length);
    if (eventIds.length === 0)
      newErrors.eventRequired = "At least 1 event is required";
    if (contactNumbers.filter(Boolean).length === 0)
      newErrors.contactNumberRequired = "At least 1 contact number is required";
    contactNumbers.forEach((contactNumber, index) => {
      if (contactNumber && !contactNumberRegex.test(contactNumber))
        newErrors[`contactNumberFormat_${index}`] =
          "Contact number should be in (XXX)-XXX-XXXX format";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    const newStudent = {
      name,
      parentName,
      contactNumbers: contactNumbers.filter(Boolean),
    };

    // Calling handleAddStudent immediately updates the student list but might still be running asynchronous operations.
    // Use a callback in setState to ensure state updates are handled properly and avoid unnecessary re-renders.
    handleAddStudent(newStudent, eventIds, status).then(() => {
      setName("");
      setParentName("");
      setContactNumbers([""]);
      setEventList([]);
      setEventIds([]);
    });
  }

  return (
    <div className="container">
      <h2>Add Student</h2>
      <form className="form" onSubmit={handleFormSubmit}>
        <TextField
          label="Student Name"
          variant="outlined"
          margin="normal"
          size="small"
          value={name}
          onChange={handleChangeName}
          fullWidth
          error={!!errors.nameRequired}
          helperText={errors.nameRequired}
          onBlur={handleBlurName}
        ></TextField>
        <TextField
          label="Parent Name"
          variant="outlined"
          margin="normal"
          size="small"
          value={parentName}
          onChange={handleChangeParentName}
          fullWidth
        ></TextField>
        {contactNumbers.map((contactNumber, index) => (
          <div className="contact-numbers" key={index}>
            <FormControl
              fullWidth
              size="small"
              margin="normal"
              error={
                !!errors.contactNumberRequired ||
                !!errors[`contactNumberFormat_${index}`]
              }
            >
              <InputLabel htmlFor="contact-number-label">{`Contact Number ${
                index + 1
              }`}</InputLabel>
              <OutlinedInput
                id="contact-number-label"
                label={`Contact Number ${index + 1}`}
                startAdornment={
                  <InputAdornment position="start">+1</InputAdornment>
                }
                value={contactNumber}
                placeholder="(XXX)-XXX-XXXX"
                onChange={(e) => handleChangeContactNumber(e, index)}
                onBlur={(e) => handleBlurContactNumber(e, index)}
                inputProps={{ maxLength: "14" }}
              ></OutlinedInput>
              {errors[`contactNumberFormat_${index}`] && (
                <FormHelperText>
                  {errors[`contactNumberFormat_${index}`]}
                </FormHelperText>
              )}
              {errors.contactNumberRequired && (
                <FormHelperText>{errors.contactNumberRequired}</FormHelperText>
              )}
            </FormControl>
            <Add onClick={handleAddMoreContactNumbers}></Add>
            {contactNumbers.length > 1 && (
              <Delete onClick={() => handleRemoveContactNumber(index)}></Delete>
            )}
          </div>
        ))}
        <FormControl
          variant="outlined"
          margin="normal"
          fullWidth
          error={!!errors.eventRequired}
        >
          <InputLabel shrink htmlFor="events-label">
            Events
          </InputLabel>
          <Select
            label="Events"
            value={eventIds}
            onChange={handleChangeEventType}
            multiple
            native
            inputProps={{ id: "events-label" }}
            onBlur={handleBlurEventType}
          >
            {eventList.map((event) => (
              <option key={event.id} value={event.id}>
                {event.eventType}
              </option>
            ))}
          </Select>
          {errors.eventRequired && (
            <FormHelperText>{errors.eventRequired}</FormHelperText>
          )}
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ marginTop: "16px", marginBottom: "10px" }}
        >
          Save
        </Button>
      </form>
    </div>
  );
}
