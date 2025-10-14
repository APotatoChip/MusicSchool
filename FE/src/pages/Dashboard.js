import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Autocomplete,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import api from "../api";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [addStudentModal, setAddStudentModal] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch classes whenever the date changes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const date = selectedDate.format("YYYY-MM-DD");
        const res = await api.get(`/classes?date=${date}`);
        setClasses(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClasses();
  }, [selectedDate]);

  // ✅ Search students dynamically
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!searchTerm.trim()) return setStudents([]);

      setLoadingStudents(true);
      try {
        const res = await api.get(`/students?search=${searchTerm}`);
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoadingStudents(false);
      }
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleOpenClass = (cls) => {
    setSelectedClass(cls);
    setSuccess(false);
    setError("");
  };

  const handleClose = () => {
    setSelectedClass(null);
  };

  const handleAddExistingStudent = async (student) => {
    if (!selectedClass) return;
    try {
      await api.post(`/classes/${selectedClass.id}/add-student`, {
        studentId: student.id,
      });
      setSuccess(true);
      setSelectedClass({
        ...selectedClass,
        students: [...selectedClass.students, student],
      });
    } catch (err) {
      console.error(err);
      setError("Грешка при добавяне на ученик към урока!");
    }
  };

  const handleOpenAddStudentModal = () => {
    setAddStudentModal(true);
  };

  const handleCreateNewStudent = async () => {
    try {
      const res = await api.post("/students", newStudentForm);
      const newStudent = res.data;
      await handleAddExistingStudent(newStudent);
      setAddStudentModal(false);
      setNewStudentForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      });
    } catch (err) {
      console.error(err);
      setError("Грешка при създаването на ученик!");
    }
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/classes/${selectedClass.id}/students/${studentId}`,
        {
          method: "DELETE",
        }
      );
      const updated = await res.json();
      setSelectedClass(updated);
      // Optional: also refresh class list if you show summaries
      setClasses((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
    } catch (err) {
      console.error("Error removing student:", err);
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Днешни уроци
      </Typography>

      {/* ✅ Date Picker */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Избери дата"
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
          sx={{ mb: 3 }}
        />
      </LocalizationProvider>

      {/* ✅ List of classes */}
      <Box display="grid" gap={2}>
        {classes.length === 0 ? (
          <Typography>Няма уроци за избраната дата.</Typography>
        ) : (
          classes.map((cls) => (
            <Card
              key={cls.id}
              sx={{ cursor: "pointer" }}
              onClick={() => handleOpenClass(cls)}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {cls.classTypeName} с {cls.teacherName}
                </Typography>
                <Typography>
                  Час: {cls.time} — {cls.price} лв — 👥 {cls.students.length}/
                  {cls.capacity}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* ✅ Class details modal */}
      <Dialog open={!!selectedClass} onClose={handleClose} fullWidth>
        <DialogTitle>
          {selectedClass?.classTypeName} с {selectedClass?.teacherName}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Час: {selectedClass?.time} <br />
            Цена: {selectedClass?.price} лв <br />
            Капацитет: {selectedClass?.students.length}/
            {selectedClass?.capacity}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="subtitle1" fontWeight="bold">
            Ученици:
          </Typography>
          <List dense>
            {selectedClass?.students.map((s) => (
              <ListItem key={s.id}>
                <ListItemText primary={`${s.name}`} />
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleRemoveStudent(s.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
            {selectedClass?.students.length === 0 && (
              <Typography>Няма добавени ученици.</Typography>
            )}
          </List>

          <Divider sx={{ mt: 2, mb: 2 }} />

          {success && <Alert severity="success">Ученикът е добавен!</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          {/* ✅ Autocomplete Student Search */}
          <Autocomplete
            options={students}
            getOptionLabel={(option) =>
              `${option.firstName} ${option.lastName}`.trim()
            }
            loading={loadingStudents}
            noOptionsText={
              <Button
                color="primary"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleOpenAddStudentModal}>
                ➕ Добави нов ученик
              </Button>
            }
            onInputChange={(e, value) => setSearchTerm(value)}
            onChange={(e, value) => {
              if (value) handleAddExistingStudent(value);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Търси ученик" variant="outlined" />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Затвори</Button>
        </DialogActions>
      </Dialog>

      {/* ✅ New Student Modal */}
      <Dialog open={addStudentModal} onClose={() => setAddStudentModal(false)}>
        <DialogTitle>Добави нов ученик</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, mt: 2 }}>
          <TextField
            label="Име"
            name="firstName"
            value={newStudentForm.firstName}
            onChange={(e) =>
              setNewStudentForm({
                ...newStudentForm,
                firstName: e.target.value,
              })
            }
          />
          <TextField
            label="Фамилия"
            name="lastName"
            value={newStudentForm.lastName}
            onChange={(e) =>
              setNewStudentForm({ ...newStudentForm, lastName: e.target.value })
            }
          />
          <TextField
            label="Имейл"
            name="email"
            value={newStudentForm.email}
            onChange={(e) =>
              setNewStudentForm({ ...newStudentForm, email: e.target.value })
            }
          />
          <TextField
            label="Телефон"
            name="phone"
            value={newStudentForm.phone}
            onChange={(e) =>
              setNewStudentForm({ ...newStudentForm, phone: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddStudentModal(false)}>Откажи</Button>
          <Button variant="contained" onClick={handleCreateNewStudent}>
            Създай
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
