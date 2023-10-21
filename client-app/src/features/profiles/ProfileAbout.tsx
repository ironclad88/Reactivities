import { useState } from "react";
import { Button, Grid, Header, Tab } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import ProfileEditForm from "./ProfileEditForm";
import { Profile } from "../../app/models/profile";

interface Props {
  profile: Profile;
}

export default function ProfileAbout({ profile }: Props) {
  const {
    profileStore: { isCurrentUser },
  } = useStore();
  const [editMode, setEditMode] = useState(false);

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header icon="user" content="About" floated="left" />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={editMode ? "Cancel" : "Edit"}
              onClick={() => setEditMode(!editMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {editMode ? (
            <ProfileEditForm profile={profile} setEditMode={setEditMode} />
          ) : (
            <span style={{ whiteSpace: "pre-wrap" }}>{profile.bio}</span>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
}
