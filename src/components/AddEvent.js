import { useState } from "react";
import { addEvent } from "../firestoreServices";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";

export function AddEvent() {
  const [eventType, setEventType] = useState("");
  const [baseFee, setBaseFee] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function handleChangeEventType(e) {
    setEventType(e.target.value);
    if (e.target.value)
      setErrors((errors) => ({
        ...errors,
        eventTypeRequired: undefined,
      }));
  }

  function handleChangeBaseFee(e) {
    setBaseFee(e.target.value);
    if (e.target.value)
      setErrors((errors) => ({
        ...errors,
        baseFeeRequired: undefined,
      }));
  }

  function handleBlurEventType(e) {
    if (!e.target.value)
      setErrors((errors) => ({
        ...errors,
        eventTypeRequired: "Event Name is required",
      }));
  }

  function handleBlurBaseFee(e) {
    if (!e.target.value)
      setErrors((errors) => ({
        ...errors,
        baseFeeRequired: "Base Fee is required",
      }));
  }

  async function handleAddEvent(event) {
    await addEvent(event);
    navigate("/events");
  }

  function validateForm() {
    const newErrors = {};
    if (!eventType) newErrors.eventTypeRequired = "Event Name is required";
    if (!baseFee) newErrors.baseFeeRequired = "Base Fee is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    const newEvent = {
      eventType,
      baseFee: Number(baseFee),
    };

    handleAddEvent(newEvent).then(() => {
      setEventType("");
      setBaseFee("");
    });
  }
  return (
    <div className="container">
      <h2>Add Event</h2>
      <form className="form" onSubmit={handleFormSubmit}>
        <TextField
          label="Event Name"
          variant="outlined"
          margin="normal"
          size="small"
          value={eventType}
          onChange={handleChangeEventType}
          fullWidth
          error={!!errors.eventTypeRequired}
          helperText={errors.eventTypeRequired}
          onBlur={handleBlurEventType}
        ></TextField>
        <FormControl
          fullWidth
          size="small"
          margin="normal"
          error={!!errors.baseFeeRequired}
        >
          <InputLabel htmlFor="base-fee-label">Base Fee</InputLabel>
          <OutlinedInput
            id="base-fee-label"
            label="Base Fee"
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            value={baseFee}
            onChange={handleChangeBaseFee}
            onBlur={handleBlurBaseFee}
          ></OutlinedInput>
          {errors.baseFeeRequired && (
            <FormHelperText>{errors.baseFeeRequired}</FormHelperText>
          )}
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ marginTop: "16px" }}
        >
          Save
        </Button>
      </form>
    </div>
  );
}
