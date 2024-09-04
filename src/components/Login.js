import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, FormHelperText, TextField } from "@mui/material";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChangeEmail(e) {
    setEmail(e.target.value);
    if (e.target.value)
      setErrors((errors) => ({
        ...errors,
        emailRequired: undefined,
      }));
  }

  function handleBlurEmail(e) {
    if (!e.target.value)
      setErrors((errors) => ({
        ...errors,
        emailRequired: "Email is required",
      }));
  }

  function handleChangePassword(e) {
    setPassword(e.target.value);
    if (e.target.value)
      setErrors((errors) => ({
        ...errors,
        passwordRequired: undefined,
      }));
  }

  function handleBlurPassword(e) {
    if (!e.target.value)
      setErrors((errors) => ({
        ...errors,
        passwordRequired: "Password is required",
      }));
  }

  function validateForm() {
    const newErrors = {};
    if (!email) newErrors.emailRequired = "Email is required";
    if (!password) newErrors.passwordRequired = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setErrors((errors) => ({
        ...errors,
        loginError: "Incorrect credentials",
      }));
    }
  }

  return (
    <div className="login">
      <form className="form" onSubmit={handleFormSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          value={email}
          onChange={handleChangeEmail}
          onBlur={handleBlurEmail}
          error={!!errors.emailRequired}
          size="small"
          helperText={errors.emailRequired}
        ></TextField>
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={handleChangePassword}
          onBlur={handleBlurPassword}
          error={!!errors.passwordRequired}
          size="small"
          helperText={errors.passwordRequired}
        ></TextField>
        {errors.loginError && (
          <FormHelperText error>{errors.loginError}</FormHelperText>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ marginTop: "16px" }}
        >
          Login
        </Button>
      </form>
    </div>
  );
}
