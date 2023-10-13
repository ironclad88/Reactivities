import { Grid } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";

interface Props {
  activities: Activity[];
  selectedActivity: Activity | undefined;
  selectActivity: (id: string) => void;
  deselectActivity: () => void;
  editMode: boolean;
  openForm: (id: string) => void;
  closeForm: () => void;
  updateActivity: (activity: Activity) => void;
  createActivity: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
}
export default function ActivityDashboard({
  activities,
  selectedActivity,
  selectActivity,
  deselectActivity,
  editMode,
  openForm,
  closeForm,
  updateActivity,
  createActivity,
  deleteActivity,
}: Props) {
  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList
          activities={activities}
          setSelectedActivity={selectActivity}
          closeForm={closeForm}
          deleteActivity={deleteActivity}
        />
      </Grid.Column>
      <Grid.Column width="6">
        {selectedActivity && !editMode && (
          <ActivityDetails
            activity={selectedActivity}
            deselectActivity={deselectActivity}
            openForm={openForm}
          />
        )}
        {editMode && (
          <ActivityForm
            activity={selectedActivity}
            closeForm={closeForm}
            updateActivity={updateActivity}
            createActivity={createActivity}
          />
        )}
      </Grid.Column>
    </Grid>
  );
}
