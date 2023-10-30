import { observer } from "mobx-react-lite";
import { Card, Dimmer, Grid, Loader, Placeholder } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { useEffect, useState } from "react";
import { PagingParams } from "../../app/models/pagination";
import ProfileEventCard from "./ProfileEventCard";
import { UserActivityFilter } from "../../app/models/userActivityFilter";

interface Props {
  predicate: string;
}

export default observer(function ProfileEventsList({ predicate }: Props) {
  const { profileStore } = useStore();
  const { activityRegistry, loadActivities, setPagingParams, pagination, setActivityFilter, loadingActivitiesInitial } =
    profileStore;
  const [loadingNext, setLoadingNext] = useState(false);
  const { profile } = profileStore;
  const username = profile?.username || "";

  useEffect(() => {
    setActivityFilter(new UserActivityFilter(username, predicate));
  }, [setActivityFilter, username, predicate]);

  function handleGetMore() {
    if (loadingNext) return;
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage + 1, pagination?.itemsPerPage));
    loadActivities().then(() => setLoadingNext(false));
  }

  if (loadingActivitiesInitial) {
    return (
      <Grid width={16}>
        <Grid.Column>
          <Card.Group itemsPerRow={4}>
            <Card>
              <Card>
                <Placeholder>
                  <Placeholder.Image rectangular />
                </Placeholder>
                <Card.Content>
                  <Placeholder>
                    <Placeholder.Header>
                      <Placeholder.Line />
                    </Placeholder.Header>
                    <Placeholder.Paragraph>
                      <Placeholder.Line />
                    </Placeholder.Paragraph>
                  </Placeholder>
                </Card.Content>
              </Card>
            </Card>
          </Card.Group>
        </Grid.Column>
      </Grid>
    );
  }

  return (
    <>
      <Grid width={16}>
        <Grid.Column>
          <Card.Group itemsPerRow={4}>
            {activityRegistry.map((activity) => (
              <ProfileEventCard key={activity.id} activity={activity} />
            ))}
            {pagination && pagination.currentPage < pagination.totalPages && (
              <Card onClick={handleGetMore}>
                {(!loadingNext && (
                  <Card.Content>
                    <Card.Header textAlign="center">More...</Card.Header>
                  </Card.Content>
                )) || (
                  <Dimmer active={true} inverted={true}>
                    <Loader />
                  </Dimmer>
                )}
              </Card>
            )}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </>
  );
});
