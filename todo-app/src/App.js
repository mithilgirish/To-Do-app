import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

// Create a custom theme
const theme = createTheme({
  palette: {
    background: {
      default: '#92736C', // Custom background color
    },
  },
});

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (taskInput) {
      setTasks([...tasks, { id: Date.now(), text: taskInput, dueDate: dueDate || null, completed: false }]);
      setTaskInput('');
      setDueDate('');
    }
  };

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Sort tasks: tasks without a due date come first, then by due date
  const sortedTasks = tasks.slice().sort((a, b) => {
    if (!a.dueDate) return -1;
    if (!b.dueDate) return 1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  // Get today's date in YYYY-MM-DD format for date input
  const today = new Date().toISOString().split('T')[0];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ textAlign: 'center', pt: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom color="#FDF1F5">
          To-Do App
        </Typography>
        <Box sx={{ my: 4 }}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                fullWidth
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Add a new task"
                variant="outlined"
                size="small"
              />
              <TextField
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ ml: 1, flexShrink: 0 }}
                inputProps={{ min: today }} // Prevent past dates
              />
              <Button
                variant="contained"
                color="info"
                startIcon={<AddIcon />}
                onClick={addTask}
                sx={{ ml: 1 }}
              >
                Add
              </Button>
            </Box>
          </Paper>
          <Paper elevation={3}>
            <List>
              {sortedTasks.map((task) => (
                <ListItem
                  key={task.id}
                  sx={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                  }}
                >
                  <ListItemText
                    primary={task.text}
                    secondary={task.dueDate ? `Due: ${task.dueDate}` : 'No Due Date'}
                    sx={{ textAlign: 'center' }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="complete"
                      onClick={() => toggleTaskCompletion(task.id)}
                      color={task.completed ? 'primary' : 'default'}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => deleteTask(task.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
