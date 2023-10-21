import { Formik } from "formik";
import { Button, Form, Header, Segment } from "semantic-ui-react";
import MyTextArea from "../../app/common/form/MyTextArea";
import MyTextInput from "../../app/common/form/MyTextInput";
import * as Yup from "yup";
import { Profile, ProfileFormValues } from "../../app/models/profile";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";

interface Props {
  profile: Profile;
  setEditMode: (mode: boolean) => void;
}
export default observer(function EditProfileForm({ profile, setEditMode }: Props) {
  const { profileStore } = useStore();
  const { updateProfile } = profileStore;

  const validationSchema = Yup.object({
    displayName: Yup.string().required("A display name is requried"),
  });

  function handleFormSubmit(profile: ProfileFormValues) {
    updateProfile(profile).then(() => setEditMode(false));
  }

  return (
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={profile}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput name="displayName" placeholder="Display Name" />
            <MyTextArea rows={3} name="bio" placeholder={"Bio"} />
            <Button
              loading={isSubmitting}
              floated="right"
              positive
              type="submit"
              content="Update profile"
              disabled={isSubmitting || !dirty || !isValid}
            />
          </Form>
        )}
      </Formik>
  );
});
