import { useEffect, useState } from "react";
import axios from "axios";
import { Container } from "semantic-ui-react";
import { Activity } from "../models/activity";
import NavBar from "./navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import {v4 as uuid} from 'uuid';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, selectActivity] = useState<Activity | undefined>();
  const [editMode, setEditMode] = useState(false);

  function handleDeselectActivity() {
    selectActivity(undefined);
  }
  function handleSelectActivity(id: string) {
    selectActivity(activities.find((a) => a.id === id));
  }
  function handleOpenForm(id?: string) {
    id ? handleSelectActivity(id) : handleDeselectActivity();
    setEditMode(true);
  }

  function handleCloseForm() {
    setEditMode(false);
  }

  function handleUpdateActivity(activity: Activity) {
    setActivities([...activities.filter((a) => a.id !== activity.id), activity]);
    setEditMode(false);
    selectActivity(activity);
  }

  function handleCreateActivity(activity: Activity) {
    setActivities([...activities, {...activity, id: uuid()}]);
    setEditMode(false);
    selectActivity(activity);
  }

  function handleDeleteActivity(id: string) {
    setActivities([...activities.filter(a => a.id !== id)]);
    (selectedActivity && id === selectedActivity.id) && selectActivity(undefined);
  }

  useEffect(() => {
    axios
      .get<Activity[]>("http://localhost:5000/api/activities")
      .then((response) => {
        setActivities(response.data);
      });
  }, []);

  return (
    <>
      <NavBar openForm={handleOpenForm} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          deselectActivity={handleDeselectActivity}
          editMode={editMode}
          openForm={handleOpenForm}
          closeForm={handleCloseForm}
          updateActivity={handleUpdateActivity}
          createActivity={handleCreateActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </>
  );
}

export default App;
