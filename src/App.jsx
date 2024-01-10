import {
  Button,
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useState, useRef, useEffect } from "react";
import { MoonStars, Sun, Trash } from "tabler-icons-react";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [todos, setTodos] = useState([]);
  const [opened, setOpened] = useState(false);

  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  // Switch screen modes function
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const taskTitle = useRef("");

  // Create a task
  const createTask = () => {
    setTasks([
      ...tasks,
      {
        title: taskTitle.current.value,
      },
    ]);

    saveTasks([
      ...tasks,
      {
        title: taskTitle.current.value,
      },
    ]);
  };

  // Delete a task
  const deleteTask = (index) => {
    const clonedTasks = [...tasks];

    clonedTasks.splice(index, 1);

    setTasks(clonedTasks);

    saveTasks([...clonedTasks]);
  };

  // Delete fetched task from a list, not from server
  const handleDeleteItem = (id) => {
    const updateTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updateTodos);
  };

  // When the page is refreshed, loads tasks
  const loadTasks = () => {
    let loadedTasks = localStorage.getItem("tasks");

    let tasks = JSON.parse(loadedTasks);

    if (tasks) {
      setTasks(tasks);
    }
  };

  // Save tasks to local storage
  const saveTasks = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/todos");
        if (!res.ok) {
          throw new Error("Failed to fetch todos");
        }
        const data = await res.json();
        setTodos(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchTodos();
    loadTasks();
  }, []);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, defaultRadius: "md" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <div className="App">
          {/* Add task to list */}
          <Modal
            opened={opened}
            size={"md"}
            title={"New Task"}
            withCloseButton={false}
            onClose={() => {
              setOpened(false);
            }}
            centered
          >
            <TextInput
              mt={"md"}
              ref={taskTitle}
              placeholder={"Task Title"}
              required
              label={"Title"}
            />
            <Group mt={"md"} position={"apart"}>
              <Button
                onClick={() => {
                  setOpened(false);
                }}
                variant={"subtle"}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  createTask();
                  setOpened(false);
                }}
              >
                Create Task
              </Button>
            </Group>
          </Modal>

          {/* List of all tasks */}
          <Container size={550} my={40}>
            <Group position={"apart"}>
              <Title
                sx={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 900,
                })}
              >
                My Tasks
              </Title>
              <ActionIcon
                color={"blue"}
                onClick={() => toggleColorScheme()}
                size="lg"
              >
                {colorScheme === "dark" ? (
                  <Sun size={16} />
                ) : (
                  <MoonStars size={16} />
                )}
              </ActionIcon>
            </Group>

            {/* Adds a task to the list */}
            {todos &&
              tasks.map((task, index) => {
                return (
                  <Card withBorder key={index} mt={"sm"}>
                    <Group position={"apart"}>
                      <Text weight={"bold"}>{task.title}</Text>
                      <ActionIcon
                        onClick={() => {
                          deleteTask(index);
                        }}
                        color={"red"}
                        variant={"transparent"}
                      >
                        <Trash />
                      </ActionIcon>
                    </Group>
                  </Card>
                );
              })}

            {/* tasks which came from API */}
            {todos &&
              todos.slice(0, 10).map((todo, index) => {
                return (
                  <Card withBorder key={index} mt={"sm"}>
                    <Group position={"apart"}>
                      <Text weight={"bold"}>
                        {todo.completed ? <s>{todo.title}</s> : todo.title}
                      </Text>

                      <ActionIcon
                        onClick={() => {
                          handleDeleteItem(todo.id);
                        }}
                        color={"red"}
                        variant={"transparent"}
                      >
                        <Trash />
                      </ActionIcon>
                    </Group>
                  </Card>
                );
              })}
            <Button
              onClick={() => {
                setOpened(true);
              }}
              fullWidth
              mt={"md"}
            >
              New Task
            </Button>
          </Container>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
