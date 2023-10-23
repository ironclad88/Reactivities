import { Grid } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActiivityDetailedHeader from "./ActivityDetailedHeader";
import ActiivityDetailedInfo from "./ActivityDetailedInfo";
import ActiivityDetailedChat from "./ActivityDetailedChat";
import ActiivityDetailedSidebar from "./ActivityDetailedSidebar";

export default observer(function ActivityDetails() {
  const { activityStore } = useStore();
  const {id } = useParams();
  const {
    selectedActivity: activity,
    loadActivity,
    loadingInitial,
    clearSelectedActivity,
  } = activityStore;
  useEffect(() => {
    if(id) loadActivity(id);
    return () => clearSelectedActivity();
  }, [id, loadActivity, clearSelectedActivity])

  if (loadingInitial || !activity) return <LoadingComponent/>;
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActiivityDetailedHeader activity={activity}/>
        <ActiivityDetailedInfo activity={activity}/>
        <ActiivityDetailedChat activityId={activity.id}/>
      </Grid.Column>
      <Grid.Column width={6}>
        <ActiivityDetailedSidebar activity={activity}/>
      </Grid.Column>
    </Grid>
  );
});
