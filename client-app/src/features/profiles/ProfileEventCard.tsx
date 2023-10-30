import { observer } from "mobx-react-lite";
import { Card, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { UserActivity } from "../../app/models/userActivity";
import { format } from "date-fns";

interface Props {
  activity: UserActivity;
}
export default observer(function ProfileCard({ activity }: Props) {
  return (
    <Card as={Link} to={`/activities/${activity.id}`}>
      <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
      <Card.Content>
        <Card.Header textAlign="center">{activity.title}</Card.Header>
        <Card.Meta textAlign="center">{format(activity.date!, "dd MMM yyyy HH:mm")}</Card.Meta>
      </Card.Content>
    </Card>
  );
});
