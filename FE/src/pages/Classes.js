import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Paper, Button, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import api from "../api ";
import ClassModal from "../components/ClassModal";

export default function ClassesPage() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    fetchClasses(selectedDate);
  }, [selectedDate]);

  const fetchClasses = async (date) => {
    try {
      const res = await api.get(`/classes?date=${date.format("YYYY-MM-DD")}`);
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Classes on {selectedDate.format("MMMM D, YYYY")}
      </Typography>

      <Box mb={3}>
        <DatePicker
          label="Pick a date"
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
        />
      </Box>

      <Grid container spacing={2}>
        {classes.length ? (
          classes.map((cls) => (
            <Grid item xs={12} key={cls.id}>
              <Paper
                sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h6">{cls.name}</Typography>
                  <Typography variant="body2">
                    {cls.time} — {cls.type}
                  </Typography>
                  <Typography variant="body2">
                    Teacher: {cls.teacherName}
                  </Typography>
                  <Typography variant="body2">
                    Students: {cls.students?.length || 0}/{cls.capacity}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={() => setSelectedClass(cls)}>
                  Manage
                </Button>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ m: 2 }}>
            No classes scheduled for this date.
          </Typography>
        )}
      </Grid>

      {/* Modal for managing class */}
      {selectedClass && (
        <ClassModal
          cls={selectedClass}
          onClose={() => setSelectedClass(null)}
          refresh={() => fetchClasses(selectedDate)}
        />
      )}
    </Container>
  );
}
