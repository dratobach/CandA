import * as React from "react";
import { Modal, Stack, TextInput, Group, Button } from "@mantine/core";

import { useForm } from "@mantine/form";
import { updateCustomerName } from "../services/api";
import { showNotification } from "@mantine/notifications";

export const EditCustomer: React.FunctionComponent<any> = (props: any) => {
  const form = useForm({
    initialValues: {
      CustomerName: props.customer[0].CustomerName,
    },
    validate: {
      CustomerName: (value) =>
        value.length < 2 ? "Contract ID must have at least 2 letters" : null,
    },
  });

  const updateCustomer = () => {
    updateCustomerName(
      props.context,
      props.siteUrl,
      props.customer[0].Id,
      form.values.CustomerName
    ).then((resp) => {
      console.log("responsesss : ", resp);
      if (resp === true) {
        showNotification({
          title: "Success",
          message: "Name Changed",
          color: "Green",
        });
      } else {
        showNotification({
          title: "Error",
          message: "Please try again later",
          color: "Red",
        });
      }
      props.setOpened(false);
      props.refreshCustomer();
    });
  };

  return (
    <Modal
      size="md"
      centered
      opened={props.opened}
      onClose={() => {
        form.reset();
        props.setOpened(false);
      }}
      title="Edit Customer"
    >
      <form onSubmit={form.onSubmit(updateCustomer)}>
        <Stack>
          <TextInput
            withAsterisk
            placeholder="Customer Name"
            label="Customer Name"
            {...form.getInputProps("CustomerName")}
          />
        </Stack>
        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Modal>
  );
};
