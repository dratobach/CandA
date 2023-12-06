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

export const AllocateHours: React.FunctionComponent<any> = (props: any) => {
  const form = useForm({
    initialValues: {
      ContractID: "",
      TrackDate: new Date(),
      ContractHoursCredited: 0,
    },
    validate: {
      TrackDate: (value) => (value == null ? "Invalid date" : null),
      ContractHoursCredited: (value) =>
        value < 1 ? "Please enter the Hours Credited" : null,
      ContractID: (value) =>
        value.length < 2 ? "Contract ID must have at least 2 letters" : null,
    },
  });

  const allocateHours = () => {
    addNewCustomerHistory(
      props.context,
      props.siteUrl,
      props.customer[0].Id,
      form.values,
      "Hours Allocated"
    ).then((resp) => {
      if (resp === "ok") {
        showNotification({
          title: "Success",
          message: "Hours Allocated",
          color: "Green",
        });
        props.setOpened(false);
        let newAmount =
          props.customer[0].TotalHours + form.values.ContractHoursCredited;
        let newBalance =
          props.customer[0].RemainingHours + form.values.ContractHoursCredited;
        updateCustomerTotalHours(
          props.context,
          props.siteUrl,
          props.customer[0].Id,
          newAmount,
          props.customer[0].TotalUsedHours,
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
      title="Allocate Hours"
    >
      <form onSubmit={form.onSubmit(allocateHours)}>
        <Stack>
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
