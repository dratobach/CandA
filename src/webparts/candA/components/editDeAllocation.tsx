import * as React from "react";
import {
  Box,
  Button,
  Group,
  NumberInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useEffect } from "react";
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { editCustomerHistory, updateCustomerTotalHours } from "../services/api";

export const EditDeAllocation: React.FunctionComponent<any> = (props: any) => {
  const form = useForm({
    initialValues: {
      ZendeskRefID: props.history.ZendeskRefID,
      RemedyRefID: props.history.RemedyRefID,
      TrackDate: new Date(),
      HoursUsed: props.history.HoursUsed,
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

  const editAllocateHours = () => {
    editCustomerHistory(
      props.context,
      props.siteUrl,
      props.history.Id,
      form.values
    ).then((resp) => {
      if (resp === true) {
        showNotification({
          title: "Success",
          message: "Hours Allocated",
          color: "Green",
        });
        props.setOpened(false);
        console.log(
          "Original Contract Hours Credited ",
          props.history.ContractHoursCredited
        );
        let HoursDifference = props.history.HoursUsed - form.values.HoursUsed;
        console.log(HoursDifference);
        if (HoursDifference != 0) {
          let newAmount = props.customer[0].HoursUsed - HoursDifference;
          let newBalance = props.customer[0].RemainingHours - HoursDifference;
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
          props.getHistory();
          form.reset();
        }
      } else {
        showNotification({
          title: "Error",
          message: "Please try again later",
          color: "Red",
        });
      }
    });
  };

  useEffect(() => {
    // console.log("edit hours : ", props.history.ZendeskRefID);
  }, []);
  return (
    <Box>
      <form onSubmit={form.onSubmit(editAllocateHours)}>
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
    </Box>
  );
};
