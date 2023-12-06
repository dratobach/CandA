import * as React from "react";
import type { ICandAProps } from "./ICandAProps";

import { Alert, Box, Center, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useEffect, useState } from "react";
import {
  checkUserAccess,
  filterCustomers,
  getAllCustomers,
  checkIsAdmin,
} from "../services/api";
import { CustomerList } from "./customerList";
import { IconAlertCircle } from "@tabler/icons-react";

export const CandA: React.FC<ICandAProps> = (props) => {
  const [noAccess, setNoAccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);

  const getCustomers = (column: any, direction: any) => {
    getAllCustomers(props.context, props.siteUrl, column, direction).then(
      (programmeResp: any) => {
        setCustomers(programmeResp);
        setLoading(false);
        console.log(programmeResp);
      }
    );
  };

  const filterCustomersList = (search: any) => {
    console.log("Search : ", search);
    search.length === 0
      ? getCustomers("CustomerName", "asc")
      : filterCustomers(props.context, props.siteUrl, search).then(
          (resp: any) => {
            setCustomers(resp);
          }
        );
  };

  useEffect(() => {
    checkUserAccess(props.context, props.siteUrl).then((resp: any) => {
      if (resp.ok) {
        checkIsAdmin(props.context, props.siteUrl).then((resp: any) => {
          if (resp.ok) {
            setIsAdmin(true);
          }
          getCustomers("CustomerName", "asc");
        });
      } else {
        setLoading(false);
        setNoAccess(true);
      }
    });
  }, []);

  return (
    <MantineProvider withGlobalStyles>
      <NotificationsProvider>
        <Box sx={{ position: "relative" }}>
          {noAccess && !loading && (
            <Center>
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                title="Permissions error"
              >
                You do not have access to this Application
              </Alert>
            </Center>
          )}
          {!noAccess && !loading && (
            <CustomerList
              isAdmin={isAdmin}
              context={props.context}
              siteUrl={props.siteUrl}
              getCustomers={getCustomers}
              filterCustomersList={filterCustomersList}
              customers={customers}
              loading={loading}
            ></CustomerList>
            // </Box>
          )}
        </Box>
      </NotificationsProvider>
    </MantineProvider>
  );
};
