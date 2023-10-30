import { observer } from "mobx-react-lite";
import { Grid, Header, Tab } from "semantic-ui-react";
import ProfileEventsList from "./ProfileEventsList";
import { useStore } from "../../app/stores/store";

export default observer(function ProfileEvents() {
  const {
    profileStore: { profile },
  } = useStore();
  if (!profile) return null;

  const panes = [
    { menuItem: "Future Events", render: () => <ProfileEventsList predicate="future" /> },
    { menuItem: "Past Events", render: () => <ProfileEventsList predicate="past" /> },
    { menuItem: "Hosting", render: () => <ProfileEventsList predicate="hosting" /> },
  ];

  return (
    <>
      <Tab.Pane>
        <Grid>
          <Grid.Column width={16}>
            <Header icon="calendar" content="Activities" floated="left" />
          </Grid.Column>
          <Grid.Column width={16}>
            <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
          </Grid.Column>
        </Grid>
      </Tab.Pane>
    </>
  );
});
