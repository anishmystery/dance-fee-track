import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  addPausedTransaction,
  addStudentEventMapping,
  getEvents,
  getStudentById,
  getStudentEventMappingByStudentId,
  updateStudent,
  updateStudentEventMapping,
} from "../firestoreServices";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebaseConfigurations";
import { Add, Close, Delete, Edit } from "@mui/icons-material";
import {
  Button,
  Chip,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";

export function EditStudent() {
  const { id } = useParams();
  const [initialStudent, setInitialStudent] = useState({});
  const [initialEventList, setInitialEventList] = useState([]);
  const [name, setName] = useState("");
  const [parentName, setParentName] = useState("");
  const [contactNumbers, setContactNumbers] = useState([""]);
  const [enrollmentDate, setEnrollmentDate] = useState("");
  const [eventList, setEventList] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [selectedNewEvent, setSelectedNewEvent] = useState("");
  const [showNewEventEnrollment, setShowNewEventEnrollment] = useState(false);
  const [newEventAdded, setNewEventAdded] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      const selectedStudent = await getStudentById(id);
      setName(selectedStudent.name);
      setParentName(selectedStudent.parentName);
      setContactNumbers(selectedStudent.contactNumbers);
      setEnrollmentDate(selectedStudent.createdOn.toDate());

      setInitialStudent({
        name: selectedStudent.name,
        parentName: selectedStudent.parentName,
        contactNumbers: selectedStudent.contactNumbers,
        enrollmentDate: selectedStudent.createdOn.toDate(),
      });
    };
    fetchStudent();
  }, [id]);

  useEffect(() => {
    const fetchStudentEventMapping = async () => {
      const mappings = await getStudentEventMappingByStudentId(id);
      const events = [];
      for (const mapping of mappings) {
        const pauseStart = mapping.pauseStart;
        const formattedPauseStart = mapping.pauseStart
          ? mapping.pauseStart.toDate().toISOString().split("T")[0]
          : mapping.pauseStart;
        const pauseEnd = mapping.pauseEnd;
        const formattedPauseEnd = mapping.pauseEnd
          ? mapping.pauseEnd.toDate().toISOString().split("T")[0]
          : mapping.pauseEnd;
        const eventRef = mapping.eventId;
        const eventDoc = await getDoc(eventRef);
        events.push({
          id: eventDoc.id,
          ...eventDoc.data(),
          status: mapping.status,
          pauseStart,
          pauseEnd,
          formattedPauseStart,
          formattedPauseEnd,
          enrollmentDate: mapping.createdOn,
          inactiveDate: mapping.inactiveDate,
        });
      }
      setEventList(events);
      setInitialEventList(events);
    };
    fetchStudentEventMapping();
  }, [id, newEventAdded]);

  useEffect(() => {
    const initializeEvents = async () => {
      const events = await getEvents();
      const enrolledEvents = eventList.map((event) => event.id);
      setAvailableEvents(
        events.filter((event) => !enrolledEvents.includes(event.id))
      );
    };
    initializeEvents();
  }, [eventList]);

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
      setErrors((errors) => ({ ...errors, nameRequired: undefined }));
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

  function handleEnableEditMode() {
    setIsEditMode(true);
  }

  function handleDisableEditMode() {
    setIsEditMode(false);
    setName(initialStudent.name);
    setParentName(initialStudent.parentName);
    setContactNumbers(initialStudent.contactNumbers);
    setEnrollmentDate(initialStudent.enrollmentDate);
    setEventList(initialEventList);
  }

  function handleChangeStatus(e, eventId) {
    setEventList((eventList) =>
      eventList.map((event) =>
        event.id === eventId ? { ...event, status: e.target.value } : event
      )
    );
  }

  function handleChangePauseStart(e, eventId) {
    setEventList((eventList) =>
      eventList.map((event) =>
        event.id === eventId
          ? { ...event, formattedPauseStart: e.target.value }
          : event
      )
    );
  }

  function handleChangePauseEnd(e, eventId) {
    setEventList((eventList) =>
      eventList.map((event) =>
        event.id === eventId
          ? { ...event, formattedPauseEnd: e.target.value }
          : event
      )
    );
  }

  function handleToggleShowNewEventEnrollment() {
    setShowNewEventEnrollment(true);
  }

  function handleChangeNewEvent(e) {
    setSelectedNewEvent(e.target.value);
    if (e.target.value)
      setErrors((errors) => ({ ...errors, eventRequired: undefined }));
  }

  function validateNewEventEnrollment() {
    const newErrors = {};
    if (!selectedNewEvent) newErrors.eventRequired = "Event is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleOnClickOK() {
    if (!validateNewEventEnrollment()) return;
    const studentRef = doc(db, "students", id);
    const eventRef = doc(db, "events", selectedNewEvent);
    const eventSnapshot = await getDoc(eventRef);
    const feeAmount = eventSnapshot.data().baseFee;
    const mapping = {
      studentId: studentRef,
      eventId: eventRef,
      status: "Active",
      feeAmount,
      pauseStart: "",
      pauseEnd: "",
    };
    await addStudentEventMapping(mapping);
    setNewEventAdded((newEventAdded) => !newEventAdded);
    setShowNewEventEnrollment(false);
  }

  function handleOnClickCancel() {
    setSelectedNewEvent("");
    setShowNewEventEnrollment(false);
    setErrors((errors) => ({ ...errors, eventRequired: undefined }));
  }

  function validateForm() {
    const contactNumberRegex = /^\(\d{3}\)-\d{3}-\d{4}$/;
    const newErrors = {};
    if (!name) newErrors.nameRequired = "Student Name is required";
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

  async function handleUpdateStudent(student, eventList) {
    await updateStudent(id, student);
    await Promise.all(
      eventList.map(async (event) => {
        const updatedMapping = {
          status: event.status,
          pauseStart:
            event.status === "Paused" && event.formattedPauseStart
              ? Timestamp.fromDate(new Date(event.formattedPauseStart))
              : "",
          pauseEnd:
            event.status === "Paused" && event.formattedPauseEnd
              ? Timestamp.fromDate(new Date(event.formattedPauseEnd))
              : "",
          inactiveDate: event.status === "Inactive" ? Timestamp.now() : "",
        };
        await updateStudentEventMapping(id, event.id, updatedMapping);
        if (event.status === "Paused") {
          await addPausedTransaction(
            id,
            event.id,
            event.formattedPauseStart,
            event.formattedPauseEnd
          );
        }
      })
    );
    navigate("/students");
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    const updatedStudent = {
      name,
      parentName,
      contactNumbers: contactNumbers.filter(Boolean),
    };

    handleUpdateStudent(updatedStudent, eventList).then(() => {
      setName("");
      setParentName("");
      setContactNumbers([""]);
      setEventList([]);
    });
  }

  return (
    <div className="container">
      <div className="edit-student">
        {!isEditMode ? (
          <>
            <h2>{name}</h2>
            <Edit sx={{ color: "black" }} onClick={handleEnableEditMode}></Edit>
          </>
        ) : (
          <>
            <FormControl
              margin="normal"
              size="small"
              sx={{ marginLeft: "10px" }}
              fullWidth
              error={!!errors.nameRequired}
            >
              <InputLabel htmlFor="student-name-label">Student Name</InputLabel>
              <OutlinedInput
                id="student-name-label"
                label="Student Name"
                value={name}
                onChange={handleChangeName}
                onBlur={handleBlurName}
              ></OutlinedInput>
              {errors.nameRequired && (
                <FormHelperText>{errors.nameRequired}</FormHelperText>
              )}
            </FormControl>
            <Close
              sx={{ color: "black" }}
              onClick={handleDisableEditMode}
            ></Close>
          </>
        )}
      </div>
      <hr></hr>
      {!isEditMode ? (
        <>
          <div className="student-details">
            <p>Parent Name: {parentName}</p>
            <p>Contact Number: {contactNumbers}</p>
            <p>
              Enrollment Date:{" "}
              {new Intl.DateTimeFormat("en-US", {
                month: "long",
                day: "2-digit",
                year: "numeric",
              }).format(enrollmentDate)}
            </p>
          </div>
          <div className="event-details">
            <p>Events: </p>
            {eventList.map((event) => (
              <div className="card-view shadow" key={event.id}>
                <div className="card-content">
                  <div className="card-data">
                    <p>{event.eventType}</p>
                    <p>
                      Enrolled On:{" "}
                      {new Intl.DateTimeFormat("en-US", {
                        month: "long",
                        day: "2-digit",
                        year: "numeric",
                      }).format(event.enrollmentDate.toDate())}
                    </p>
                    <p style={{ display: "inline-block", marginRight: "5px" }}>
                      Enrollment Status:{" "}
                    </p>
                    <Chip
                      label={event.status}
                      variant="outlined"
                      color={
                        event.status === "Active"
                          ? "success"
                          : event.status === "Paused"
                          ? "warning"
                          : "error"
                      }
                      size="small"
                      sx={{ margin: "10px 0 10px 0" }}
                    ></Chip>
                    {event.status === "Paused" ? (
                      <p>
                        Enrollment paused from{" "}
                        {new Intl.DateTimeFormat("en-US", {
                          month: "long",
                          day: "2-digit",
                          year: "numeric",
                        }).format(event.pauseStart.toDate())}{" "}
                        to{" "}
                        {new Intl.DateTimeFormat("en-US", {
                          month: "long",
                          day: "2-digit",
                          year: "numeric",
                        }).format(event.pauseEnd.toDate())}
                      </p>
                    ) : null}
                    {event.status === "Inactive" ? (
                      <p>
                        Inactive since{" "}
                        {new Intl.DateTimeFormat("en-US", {
                          month: "long",
                          day: "2-digit",
                          year: "numeric",
                        }).format(event.inactiveDate.toDate())}{" "}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <form className="form" onSubmit={handleFormSubmit}>
          <FormControl size="small" fullWidth margin="normal">
            <InputLabel htmlFor="parent-name-label">Parent Name</InputLabel>
            <OutlinedInput
              id="parent-name-label"
              label="Parent Name"
              value={parentName}
              onChange={handleChangeParentName}
            ></OutlinedInput>
          </FormControl>
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
                  <FormHelperText>
                    {errors.contactNumberRequired}
                  </FormHelperText>
                )}
              </FormControl>
              <Add onClick={handleAddMoreContactNumbers}></Add>
              {contactNumbers.length > 1 && (
                <Delete
                  onClick={() => handleRemoveContactNumber(index)}
                ></Delete>
              )}
            </div>
          ))}
          {eventList.map((event) => (
            <div className="card-view shadow" key={event.id}>
              <p>{event.eventType}</p>
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel id="enrollment-status-label">
                  Enrollment Status
                </InputLabel>
                <Select
                  labelId="enrollment-status-label"
                  value={event.status}
                  onChange={(e) => handleChangeStatus(e, event.id)}
                  label="Enrollment Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Paused">Paused</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              {event.status === "Paused" ? (
                <>
                  <FormControl size="small" fullWidth margin="normal">
                    <InputLabel shrink htmlFor="pause-start-label">
                      Pause Start
                    </InputLabel>
                    <TextField
                      variant="outlined"
                      id="pause-start-label"
                      label="Pause Start"
                      value={event.formattedPauseStart}
                      onChange={(e) => {
                        handleChangePauseStart(e, event.id);
                      }}
                      type="date"
                      InputLabelProps={{ shrink: true }}
                    ></TextField>
                  </FormControl>
                  <FormControl size="small" fullWidth margin="normal">
                    <InputLabel shrink htmlFor="pause-end-label">
                      Pause End
                    </InputLabel>
                    <TextField
                      variant="outlined"
                      id="pause-end-label"
                      label="Pause End"
                      value={event.formattedPauseEnd}
                      onChange={(e) => {
                        handleChangePauseEnd(e, event.id);
                      }}
                      type="date"
                      InputLabelProps={{ shrink: true }}
                    ></TextField>
                  </FormControl>
                </>
              ) : null}
            </div>
          ))}
          {!showNewEventEnrollment ? (
            <Button
              fullWidth
              sx={{ marginTop: "16px" }}
              onClick={handleToggleShowNewEventEnrollment}
            >
              + Enroll to a new event
            </Button>
          ) : (
            <div className="card-view shadow">
              <div className="card-content">
                <div className="card-data">
                  {availableEvents.length !== 0 ? (
                    <FormControl
                      fullWidth
                      margin="normal"
                      size="small"
                      error={!!errors.eventRequired}
                    >
                      <InputLabel id="event-label">Event</InputLabel>
                      <Select
                        labelId="event-label"
                        value={selectedNewEvent}
                        onChange={handleChangeNewEvent}
                        label="Event"
                      >
                        {availableEvents.map((event) => (
                          <MenuItem key={event.id} value={event.id}>
                            {event.eventType}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.eventRequired && (
                        <FormHelperText>{errors.eventRequired}</FormHelperText>
                      )}
                    </FormControl>
                  ) : (
                    <strong>No events to enroll</strong>
                  )}
                </div>
              </div>
              <Button
                variant="contained"
                sx={{ marginTop: "10px", marginRight: "10px" }}
                onClick={handleOnClickOK}
              >
                OK
              </Button>
              <Button
                variant="contained"
                sx={{ marginTop: "10px" }}
                onClick={handleOnClickCancel}
              >
                Cancel
              </Button>
            </div>
          )}
          <Button
            type="submit"
            variant="contained"
            sx={{ marginTop: "16px", marginBottom: "10px" }}
            fullWidth
          >
            Update
          </Button>
        </form>
      )}
    </div>
  );
}
