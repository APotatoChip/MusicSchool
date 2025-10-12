import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import api from "../api";

export default function CreateClass() {
  const [form, setForm] = useState({
    teacherId: "",
    classTypeId: "",
    price: "",
    capacity: "",
    date: "", // datetime-local combined value
  });
  const [teachers, setTeachers] = useState([]);
  const [classTypes, setClassTypes] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch teachers and class types
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersRes, typesRes] = await Promise.all([
          api.get("/teachers"),
          api.get("/class-types"),
        ]);
        setTeachers(teachersRes.data);
        setClassTypes(typesRes.data);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    fetchData();
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
      // Split the datetime-local into separate date/time values
      const [datePart, timePart] = form.date.split("T");

      const payload = {
        teacherId: Number(form.teacherId),
        classTypeId: Number(form.classTypeId),
        price: form.price,
        capacity: form.capacity,
        date: datePart,
        time: timePart,
      };

      await api.post("/classes", payload);

      setSuccess(true);
      setForm({
        teacherId: "",
        classTypeId: "",
        price: "",
        capacity: "",
        date: "",
      });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Грешка при създаването на нов урок!"
      );
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Създай нов урок
      </Typography>

      {success && <Alert severity="success">Урокът е създаден успешно!</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 3, display: "grid", gap: 2 }}>
        {/* Teacher dropdown */}
        <FormControl fullWidth required>
          <InputLabel id="teacher-label">Учител</InputLabel>
          <Select
            labelId="teacher-label"
            name="teacherId"
            value={form.teacherId}
            label="Teacher"
            onChange={handleChange}>
            {teachers.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.firstName ? `${t.firstName} ${t.lastName}` : t.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Class type dropdown */}
        <FormControl fullWidth required>
          <InputLabel id="classType-label">Вид урок</InputLabel>
          <Select
            labelId="classType-label"
            name="classTypeId"
            value={form.classTypeId}
            label="Class Type"
            onChange={handleChange}>
            {classTypes.map((ct) => (
              <MenuItem key={ct.id} value={ct.id}>
                {ct.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Цена ($)"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />
        <TextField
          label="Капацитет"
          name="capacity"
          type="number"
          value={form.capacity}
          onChange={handleChange}
          required
        />
        {/* DateTime Picker */}
        <TextField
          label="Дата и час"
          name="date"
          type="datetime-local"
          value={form.date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />

        <Button type="submit" variant="contained">
          Създай урок
        </Button>
      </Box>
    </Container>
  );
}
