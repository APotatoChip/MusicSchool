import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";

export default function ClassModal({ cls, onClose, refresh }) {
  const [students, setStudents] = useState(cls.students || []);

  const handleAddStudent = async () => {
    // temporary mock
    const newStudent = { id: Date.now(), name: "New Student" };
    setStudents([...students, newStudent]);
  };

  const handleDeleteStudent = async (id) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const handlePayment = (method) => {
    alert(`Payment by ${method} recorded (mock)`);
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{cls.name}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">Teacher: {cls.teacherName}</Typography>
        <Typography variant="body1">Type: {cls.type}</Typography>
        <Typography variant="body1">Price: ${cls.price}</Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>
          Students
        </Typography>
        <List>
          {students.map((s) => (
            <ListItem
              key={s.id}
              secondaryAction={
                <Button onClick={() => handleDeleteStudent(s.id)} color="error">
                  Remove
                </Button>
              }>
              <ListItemText primary={s.name} />
            </ListItem>
          ))}
        </List>

        <Button variant="outlined" onClick={handleAddStudent}>
          Add Student
        </Button>

        <Typography variant="h6" sx={{ mt: 3 }}>
          Receive Payment
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <Button variant="contained" onClick={() => handlePayment("Cash")}>
            Cash
          </Button>
          <Button variant="contained" onClick={() => handlePayment("Card")}>
            Card
          </Button>
          <Button
            variant="contained"
            onClick={() => handlePayment("Bank Transfer")}>
            Bank Transfer
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
