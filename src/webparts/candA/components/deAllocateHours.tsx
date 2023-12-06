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
import {
  addNewCustomerHistory,
  updateCustomerTotalHours,
} from "../services/api";
import { showNotification } from "@mantine/notifications";

export const DeAllocateHours: React.FunctionComponent<any> = (props: any) => {
  const form = useForm({
    initialValues: {
      TrackDate: new Date(),
      HoursUsed: 0,
      ZendeskRefID: "",
      RemedyRefID: "",
    },
    validate: {
      TrackDate: (value) => (value == null ? "Invalid date" : null),
      HoursUsed: (value) =>
        value > props.customer[0].RemainingHours
          ? "Insufficient Hours Remaining"
          : value < 0
          ? "Hours cannot be negative"
          : null,
      ZendeskRefID: (value) =>
        value.length < 2 ? "Zendesk ID must have at least 2 characters" : null,
      RemedyRefID: (value) =>
        value.length < 2 ? "Remedy ID must have at least 2 characters" : null,
    },
  });

  const allocateHours = () => {
    addNewCustomerHistory(
      props.context,
      props.siteUrl,
      props.customer[0].Id,
      form.values,
      "Hours DeAllocated"
    ).then((resp) => {
      console.log(resp);
      if (resp === "ok") {
        showNotification({
          title: "Success",
          message: "Hours Allocated",
          color: "Green",
        });
        props.setOpened(false);
        let newAmount =
          props.customer[0].TotalUsedHours + form.values.HoursUsed;
        let newBalance =
          props.customer[0].RemainingHours - form.values.HoursUsed;
        updateCustomerTotalHours(
          props.context,
          props.siteUrl,
          props.customer[0].Id,
          props.customer[0].TotalHours,
          newAmount,
          newBalance
        ).then((resp) => {
          console.log("should run after : ", resp);
          props.refreshCustomer();
          props.getHistory();
          form.reset();
        });
      } else {
        showNotification({
          title: "Error",
          message: "Please try again later",
          color: "Red",
        });
      }
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
      title="DeAllocate Hours"
    >
      <form onSubmit={form.onSubmit(allocateHours)}>
        <Stack>
          <TextInput
            withAsterisk
            placeholder="Zendesk ID"
            label="Zendesk ID"
            {...form.getInputProps("ZendeskRefID")}
          />
          <TextInput
            withAsterisk
            placeholder="Remedy ID"
            label="Remedy ID"
            {...form.getInputProps("RemedyRefID")}
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
            label="Hours Used"
            required
            withAsterisk
            {...form.getInputProps("HoursUsed")}
          />
        </Stack>
        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Modal>
  );
};
