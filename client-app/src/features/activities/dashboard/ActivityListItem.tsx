import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import ActivityListItemAttendee from "./ActivityListItemAttendee";
interface Props {
  activity: Activity;
}
export default function ActivityListItem({ activity }: Props) {
  const followingStyles= {
    borderColor: 'orange',
    borderWidth: 2,
    marginBottom: 4,
  }
  return (
    <Segment.Group>
      <Segment>
        {activity.isCancelled && (
          <Label
            attached="top"
            color="red"
            content="Cancelled"
            style={{ textAlign: "center" }}
          />
        )}
        <Item.Group>
          <Item>
            <Item.Image
              style={activity.host?.following ? followingStyles : { marginBottom: 4 }}
              size="tiny"
              circular
              src={activity.host?.image || "/assets/user.png"}
              as={Link} to={`/profiles/${activity.hostUsername}`}
              bordered
            />
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>
                Hosted by <Link to={`/profiles/${activity.hostUsername}`}>{activity.host?.displayName}</Link>
              </Item.Description>
              {(activity.isHost && (
                <Item.Description>
                  <Label basic color="orange">
                    You are hosting this activity.
                  </Label>
                </Item.Description>
              )) ||
                (activity.isGoing && (
                  <Item.Description>
                    <Label basic color="green">
                      You are going to this activity.
                    </Label>
                  </Item.Description>
                ))}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name="clock" /> {format(activity.date!, "dd MMM yyyy h:mm aa")}
          <Icon name="marker" /> {activity.venue}
        </span>
      </Segment>
      <Segment secondary>
        <ActivityListItemAttendee attendees={activity.attendees!} />
      </Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          as={Link}
          to={`/activities/${activity.id}`}
          color="teal"
          floated="right"
          content="View"
        />
      </Segment>
    </Segment.Group>
  );
}
