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

export const EditAllocation: React.FunctionComponent<any> = (props: any) => {
  const form = useForm({
    initialValues: {
      ContractID: props.history.ContractID,
      TrackDate: new Date(),
      ContractHoursCredited: props.history.ContractHoursCredited,
    },
    validate: {
      ContractID: (value) =>
        value.length < 2 ? "Contract ID must have at least 2 letters" : null,
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
        let HoursDifference =
          props.history.ContractHoursCredited -
          form.values.ContractHoursCredited;
        console.log(HoursDifference);
        if (HoursDifference != 0) {
          let newAmount = props.customer[0].TotalHours - HoursDifference;
          let newBalance = props.customer[0].RemainingHours - HoursDifference;
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
    </Box>
  );
};
