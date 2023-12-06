import * as React from "react";
import {
  Modal,
  Stack,
  NumberInput,
  TextInput,
  Group,
  Button,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { addCustomer, addNewCustomerHistory } from "../services/api";
import { showNotification } from "@mantine/notifications";

export const AddCustomer: React.FunctionComponent<any> = (props: any) => {
  const form = useForm({
    initialValues: {
      CustomerName: "",
      ContractID: "",
      TrackDate: new Date(),
      ContractHoursCredited: 0,
    },
    validate: {
      CustomerName: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      TrackDate: (value) => (value == null ? "Invalid date" : null),
      ContractHoursCredited: (value) =>
        value < 1 ? "Please enter the Hours Credited" : null,
      ContractID: (value) =>
        value.length < 2 ? "Contract ID must have at least 2 letters" : null,
    },
  });

  const addNewCustomer = () => {
    console.log(form.values);
    addCustomer(props.context, props.siteUrl, form.values).then((resp) => {
      if (resp === "error") {
        showNotification({
          title: "Error accessing datastore",
          message: "Please try again later",
        });
      } else {
        addNewCustomerHistory(
          props.context,
          props.siteUrl,
          resp,
          form.values,
          "Customer Created"
        ).then((resp) => {
          if (resp === "ok") {
            showNotification({
              title: "Success",
              message: "Customer details added",
              color: "Green",
            });
            props.setOpened(false);
            form.reset();
            props.getCustomers("Created", "desc");
          } else {
            showNotification({
              title: "Error",
              message: "Please try again later",
              color: "Red",
            });
          }
        });
      }
      console.log("response from add customer", resp);
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
      title="Add New Customer"
    >
      <form onSubmit={form.onSubmit(addNewCustomer)}>
        <Stack>
          <TextInput
            withAsterisk
            placeholder="Customer Name"
            label="Customer Name"
            {...form.getInputProps("CustomerName")}
          />
          <TextInput
            withAsterisk
            placeholder="Contract ID"
            label="Contract ID"
            {...form.getInputProps("ContractID")}
          />
          <DatePicker
            defaultValue={new Date()}
            placeholder="Track Date"
            label="Track Date"
            withAsterisk
            {...form.getInputProps("TrackDate")}
          />
          <NumberInput
            defaultValue={0}
            placeholder="Hours"
            label="Contract Hours Credited"
            withAsterisk
            {...form.getInputProps("ContractHoursCredited")}
          />
        </Stack>
        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Modal>
  );
};
