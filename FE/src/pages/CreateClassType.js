import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../api";

export default function CreateClassType() {
  const [name, setName] = useState("");
  const [classTypes, setClassTypes] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing class types
  const fetchClassTypes = async () => {
    try {
      const res = await api.get("/class-types");
      setClassTypes(res.data);
    } catch (err) {
      console.error("Error fetching class types:", err);
    }
  };

  useEffect(() => {
    fetchClassTypes();
  }, []);

  // Create new class type
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name.trim()) {
      setError("Моля, въведете име на тип урок.");
      return;
    }

    try {
      await api.post("/class-types", { name });
      setSuccess(true);
      setName("");
      fetchClassTypes(); // refresh list
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Грешка при създаването на тип урок!"
      );
    }
  };

  // Delete a class type
  const handleDelete = async (id) => {
    if (!window.confirm("Сигурни ли сте, че искате да изтриете този тип урок?"))
      return;
    try {
      await api.delete(`/class-types/${id}`);
      fetchClassTypes();
    } catch (err) {
      console.error("Error deleting class type:", err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Управление на типове уроци
      </Typography>

      {success && <Alert severity="success">Тип урок е добавен успешно!</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", gap: 2, mt: 2 }}>
        <TextField
          label="Име на тип урок"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
        />
        <Button type="submit" variant="contained">
          Добави
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mt: 4 }}>
        Съществуващи типове уроци
      </Typography>

      <List>
        {classTypes.length === 0 && (
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Няма налични типове уроци.
          </Typography>
        )}
        {classTypes.map((ct) => (
          <ListItem
            key={ct.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleDelete(ct.id)}>
                <DeleteIcon />
              </IconButton>
            }>
            {ct.name}
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
