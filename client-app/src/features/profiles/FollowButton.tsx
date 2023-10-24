import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { Reveal, Button } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { SyntheticEvent } from "react";

interface Props {
  profile: Profile;
}

export default observer(function FollowButton({ profile }: Props) {
  const { profileStore, userStore } = useStore();
  const { updateFollowing, loading } = profileStore;
  
  if (userStore.user?.username === profile.username) return null;
  
  function handleFollow(e: SyntheticEvent, username: string) {
    e.preventDefault();
    updateFollowing(username, !profile.following);
  }

  return (
    <>
      <Reveal animated="move">
        <Reveal.Content visible style={{ width: "100%" }}>
          <Button
            fluid
            color="teal"
            content={profile.following ? "Following" : "Not following"}
            onClick={(e) => handleFollow(e, profile.username)}
            loading={loading}
          />
        </Reveal.Content>
        <Reveal.Content hidden>
          <Button
            loading={loading}
            onClick={(e) => handleFollow(e, profile.username)}
            fluid
            basic
            color={profile.following ? "red" : "green"}
            content={profile.following ? "Unfollow" : "Follow"}
          />
        </Reveal.Content>
      </Reveal>
    </>
  );
});
