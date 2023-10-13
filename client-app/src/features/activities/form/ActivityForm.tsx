import { Button, Form, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { ChangeEvent, useState } from "react";

interface Props {
  activity: Activity | undefined;
  closeForm: () => void;
  updateActivity: (activity: Activity) => void;
  createActivity: (activity: Activity) => void;
  submitting: boolean;
}

export default function ActivityForm({
  activity: selectedActivity,
  closeForm,
  updateActivity,
  createActivity,
  submitting,
}: Props) {
  const initialState = selectedActivity ?? {
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: "",
  };

  const [activity, setActivity] = useState(initialState);

  function handleSubmit() {
    activity.id ? updateActivity(activity) : createActivity(activity);
  }

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setActivity({ ...activity, [name]: value });
  }
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
        type='date'
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
        <Button loading={submitting} floated="right" positive type="submit" content="Submit" />
        <Button
          floated="right"
          type="button"
          content="Cancel"
          onClick={closeForm}
        />
      </Form>
    </Segment>
  );
}
