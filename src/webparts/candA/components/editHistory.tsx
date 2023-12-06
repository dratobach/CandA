import * as React from "react";
import { Box } from "@mantine/core";

import { EditAllocation } from "./editAllocation";
import { EditDeAllocation } from "./editDeAllocation";

export const EditHistory: React.FunctionComponent<any> = (props: any) => {
  return (
    <Box>
      {props.selectedHistory.Title == "Hours DeAllocated" && (
        <EditDeAllocation
          getHistory={props.getHistory}
          setOpened={props.setEditHoursOpened}
          customer={props.customer}
          refreshCustomer={props.refreshCustomer}
          context={props.context}
          siteUrl={props.siteUrl}
          history={props.selectedHistory}
        />
      )}
      {props.selectedHistory.Title !== "Hours DeAllocated" && (
        <EditAllocation
          getHistory={props.getHistory}
          setOpened={props.setEditHoursOpened}
          customer={props.customer}
          refreshCustomer={props.refreshCustomer}
          context={props.context}
          siteUrl={props.siteUrl}
          history={props.selectedHistory}
        />
      )}
    </Box>
  );
};
