import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import api from "../api";

export default function CreateTeacher() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    classTypeId: "",
  });
  const [classTypes, setClassTypes] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch available class types (instruments)
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await api.get("/class-types");
        setClassTypes(res.data);
      } catch (err) {
        console.error("Error loading class types:", err);
      }
    };
    fetchTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      await api.post("/teachers", form);
      setSuccess(true);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        classTypeId: "",
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Грешка при добавянето на учител!");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Добави нов учител
      </Typography>

      {success && (
        <Alert severity="success">✅ Успешно добавихте нов учител!</Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 3, display: "grid", gap: 2 }}>
        <TextField
          label="Име"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <TextField
          label="Фамилия"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Телефон"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />

        {/* 🎸 Instrument Dropdown - from DB */}
        <FormControl fullWidth required>
          <InputLabel id="instrument-label">Инструмент</InputLabel>
          <Select
            labelId="instrument-label"
            name="classTypeId"
            value={form.classTypeId}
            label="Инструмент"
            onChange={handleChange}>
            {classTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained">
          Добави учител
        </Button>
      </Box>
    </Container>
  );
}
