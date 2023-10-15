import { Button, Form, Segment } from "semantic-ui-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { v4 as uuid } from "uuid";

export default observer(function ActivityForm() {
  const { activityStore } = useStore();
  const {
    updateActivity,
    createActivity,
    loading,
    loadActivity,
    loadingInitial,
  } = activityStore;
  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState<Activity>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: "",
  });

  useEffect(() => {
    if (id) loadActivity(id).then((activity) => setActivity(activity!));
  }, [id, loadActivity]);

  function handleSubmit() {
    if (!activity.id) {
      activity.id = uuid();
      createActivity(activity).then(() => {
        navigate(`/activities/${activity.id}`);
      });
    } else {
      updateActivity(activity).then(() =>
        navigate(`/activities/${activity.id}`)
      );
    }
  }

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setActivity({ ...activity, [name]: value });
  }
  if (loadingInitial) return <LoadingComponent content="Loading activity..." />;
  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit} autoComplete="off">
        <Form.Input
          onChange={handleInputChange}
          name="title"
          value={activity.title}
          placeholder={"Title"}
        />
        <Form.TextArea
          onChange={handleInputChange}
          name="description"
          value={activity.description}
          placeholder={"Description"}
        />
        <Form.Input
          onChange={handleInputChange}
          name="category"
          value={activity.category}
          placeholder={"Category"}
        />
        <Form.Input
          type="date"
          onChange={handleInputChange}
          name="date"
          value={activity.date}
          placeholder={"Date"}
        />
        <Form.Input
          onChange={handleInputChange}
          name="city"
          value={activity.city}
          placeholder={"City"}
        />
        <Form.Input
          onChange={handleInputChange}
          name="venue"
          value={activity.venue}
          placeholder={"Venue"}
        />
        <Button
          loading={loading}
          floated="right"
          positive
          type="submit"
          content="Submit"
        />
        <Button as={Link} to='/activities'  floated="right" type="button" content="Cancel" />
      </Form>
    </Segment>
  );
});
