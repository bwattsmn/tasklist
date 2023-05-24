import { Delete } from "@mui/icons-material";
import { Box, Button, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, TextField, Typography } from "@mui/material";
import { TaskStatusEnum } from "@prisma/client";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { api } from "~/utils/api";

const Home: NextPage = () => {

    const session = useSession();

    const user = session.data?.user.email;

    const [newTask, setNewTask] = useState<string>("");
    const { data, error, isLoading } = api.example.getTasks.useQuery();
    const addTaskMutation = api.example.addTask.useMutation();
    const updateTaskMutation = api.example.updateTask.useMutation();
    const deleteTaskMutation = api.example.deleteTask.useMutation();
    const util = api.useContext();

    return (
        <>
            <Box sx={{ width: "100%", paddingTop: "4em" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center">
                            Welcome {user}! Please find your tasks below.
                        </Typography>
                    </Grid>
                    <Grid item xs={1} md={4}>

                    </Grid>
                    <Grid item xs={10} md={4}>
                        <TextField
                            fullWidth
                            label="New Task"
                            name="newTask"
                            variant="outlined"
                            onChange={(e) => setNewTask(e.target.value)}
                            value={newTask}
                        />
                    </Grid>
                    <Grid item xs={1} md={4}>

                    </Grid>
                    <Grid item xs={4}>

                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={async () => {
                                const data = await addTaskMutation.mutateAsync({ task: newTask });
                                void util.example.getTasks.invalidate();
                                alert(`Added task: ${data.taskName} - ${data.id} `);
                            }}
                        >
                            Add Task
                        </Button>
                    </Grid>
                    <Grid item xs={4}>

                    </Grid>
                    <Grid item xs={1} md={4}>

                    </Grid>
                    <Grid item xs={10} md={4}>
                        <List sx={{ width: "100%" }}>
                            {
                                data && data.map(
                                    (task) => {
                                        return (
                                            <ListItem
                                                key={task.id}
                                                sx={{ padding: "1.5em" }}
                                                secondaryAction={
                                                    <TextField
                                                        select
                                                        label="Status"
                                                        name="status"
                                                        variant="standard"
                                                        value={task.status}
                                                        sx={{ width: "15em" }}
                                                        onChange={async (e) => {
                                                            await updateTaskMutation.mutateAsync({ id: task.id, status: e.target.value as TaskStatusEnum });
                                                            void util.example.getTasks.invalidate();
                                                            alert(`Updated task: ${task.taskName} - ${task.id} `);
                                                        }
                                                        }
                                                    >
                                                        <MenuItem value={TaskStatusEnum.PENDING}>Pending</MenuItem>
                                                        <MenuItem value={TaskStatusEnum.INPROGRESS}>In Progress</MenuItem>
                                                        <MenuItem value={TaskStatusEnum.COMPLETED}>Completed</MenuItem>
                                                    </TextField>
                                                }
                                            >
                                                <ListItemButton
                                                    onClick={async () => {
                                                        await deleteTaskMutation.mutateAsync({ id: task.id });
                                                        void util.example.getTasks.invalidate();
                                                        alert(`Deleted task: ${task.id} `);
                                                    }
                                                    }
                                                >
                                                    <ListItemIcon>
                                                        <Delete color="error" />
                                                    </ListItemIcon>
                                                    <ListItemText>
                                                        {task.taskName}
                                                    </ListItemText>
                                                </ListItemButton>
                                            </ListItem>
                                        )
                                    }
                                )
                            }
                        </List>
                    </Grid>
                    <Grid item xs={1} md={4}>

                    </Grid>
                </Grid>
            </Box >
        </>
    );
};

export default Home;