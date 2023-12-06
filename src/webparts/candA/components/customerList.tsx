import * as React from "react";
// import { Button, Group, TextInput, Text } from "@mantine/core";
// import {
//   IconCirclePlus,
//   IconEditCircle,
//   IconFilter,
// } from "@tabler/icons-react";
import {
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  IDetailsHeaderProps,
  IRenderFunction,
  IDetailsColumnRenderTooltipProps,
  TooltipHost,
  Selection,
  SelectionMode,
} from "office-ui-fabric-react";
import { useEffect, useState } from "react";
import { AddCustomer } from "./addCustomer";
import {
  Button,
  Group,
  TextInput,
  Text,
  Divider,
  Box,
  Loader,
  Center,
  Alert,
  Modal,
  Space,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconCirclePlus,
  IconEditCircle,
  IconFilter,
  IconTrash,
} from "@tabler/icons-react";
import { UpdateHours } from "./updateHours";
import { deleteCustomerHistory, getCustomer } from "../services/api";
import { deleteCustomer } from "../services/api";
import { showNotification } from "@mantine/notifications";

export const CustomerList: React.FunctionComponent<any> = (props: any) => {
  const [currentColumns, setCurrentColumns] = useState<any>([]);
  const [value, setValue] = useState("");
  const [opened, setOpened] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>([]);
  const [historyAmount, setHistoryAmount] = useState(3);

  const selection = new Selection({
    onSelectionChanged: () => {
      setSelectedCustomer([...selection.getSelection()]);
    },
  });

  const onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (
    props,
    defaultRender
  ) => {
    if (!props) {
      return null;
    }
    const onRenderColumnHeaderTooltip: IRenderFunction<
      IDetailsColumnRenderTooltipProps
    > = (tooltipHostProps) => <TooltipHost {...tooltipHostProps} />;
    return defaultRender!({
      ...props,
      onRenderColumnHeaderTooltip,
    });
  };
  const deleteCustomerRecord = () => {
    deleteCustomer(props.context, props.siteUrl, selectedCustomer[0].Id).then(
      (resp) => {
        console.log("response from delete customer ", resp);
        if (resp === true) {
          deleteCustomerHistory(
            props.context,
            props.siteUrl,
            selectedCustomer[0].Id
          ).then((resp) => {
            console.log("response from delete history ", resp);
            showNotification({
              title: "Success",
              message: "Customer Deleted",
              color: "Green",
            });
            setDeleteMode(false);
            getNewCustomers();
          });
        }
      }
    );
  };
  const onColumnClick = (event: any, column: any): any => {
    const newColumns: IColumn[] = columns.slice();
    const currColumn: IColumn = newColumns.filter(
      (currCol) => column.key === currCol.key
    )[0];
    console.log("event : ", event, column);
    // column.isSorted = true;
    let direction = "asc";
    if (currColumn.isSortedDescending == false) {
      direction = "desc";
    }
    props.getCustomers(column.key, direction);
    console.log(columns);
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    setCurrentColumns(newColumns);
  };
  const getNewCustomers = () => {
    props.getCustomers("Modified", "desc");
    setSelectedCustomer([]);
  };
  const refreshCustomer = () => {
    console.log("selected customer : ", selectedCustomer);
    getCustomer(props.context, props.siteUrl, selectedCustomer[0].Id).then(
      (resp) => {
        setSelectedCustomer(resp);
        console.log("Single Customer : ", resp);
      }
    );
  };
  const columns: IColumn[] = [
    {
      key: "CustomerName",
      name: "Customer",
      fieldName: "CustomerName",
      minWidth: 150,
      maxWidth: 200,
      isRowHeader: true,
      isResizable: true,
      isSorted: false,
      isSortedDescending: false,
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      // eslint-disable-next-line no-use-before-define
      onColumnClick: onColumnClick,
      data: "string",
    },
    {
      key: "TotalHours",
      name: "Total Hours",
      fieldName: "TotalHours",
      minWidth: 150,
      maxWidth: 150,
      isRowHeader: true,
      isResizable: true,
      isSorted: false,
      isSortedDescending: false,
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      onColumnClick: onColumnClick,
      data: "integer",
    },
    {
      key: "TotalUsedHours",
      name: "Total Used Hours",
      fieldName: "TotalUsedHours",
      minWidth: 150,
      maxWidth: 150,
      isRowHeader: true,
      isResizable: true,
      isSorted: false,
      isSortedDescending: false,
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      onColumnClick: onColumnClick,
      data: "integer",
    },
    {
      key: "RemainingHours",
      name: "Remaining Hours",
      fieldName: "RemainingHours",
      minWidth: 150,
      maxWidth: 150,
      isRowHeader: true,
      isResizable: true,
      isSorted: false,
      isSortedDescending: false,
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      onColumnClick: onColumnClick,
      data: "integer",
    },
  ];

  useEffect(() => {
    console.log("View all list props ", props);
    console.log("CUSTOMER LIST");
    //setWorking(true);
    setCurrentColumns(columns);
  }, []);
  return (
    <>
      {!editMode && (
        <Box>
          <Box
            sx={{
              // position: "fixed",
              // "z-index": "200",
              backgroundColor: "white",
              width: "100%",
              paddingTop: 10,
            }}
          >
            <Box sx={{ "z-index": "1" }}>
              <Group sx={{ "margin-bottom": "10px" }}>
                <Button
                  leftIcon={<IconCirclePlus />}
                  variant="white"
                  onClick={() => {
                    setOpened(true);
                  }}
                >
                  New Customer
                </Button>
                <Button
                  disabled={!selectedCustomer.length}
                  leftIcon={<IconEditCircle />}
                  variant="white"
                  onClick={() => {
                    setEditMode(true);
                  }}
                >
                  Update Hours
                </Button>
                <Button
                  disabled={!selectedCustomer.length}
                  leftIcon={<IconTrash />}
                  variant="white"
                  onClick={() => {
                    setDeleteMode(true);
                  }}
                >
                  Delete Customer
                </Button>
                <Group>
                  <Group spacing="xs">
                    <IconFilter color="#228be6" size={24} />
                    <Text
                      fw="600"
                      c="blue"
                      sx={{ fontSize: "14px", fontFamily: "inherit" }}
                    >
                      Filter by Customer
                    </Text>
                  </Group>
                  <TextInput
                    value={value}
                    onChange={(event: any) => {
                      setValue(event.currentTarget.value);
                      props.filterCustomersList(event.currentTarget.value);
                    }}
                  />
                </Group>
              </Group>
            </Box>
            <Divider></Divider>
          </Box>
          {props.loading && (
            <Center sx={{ "padding-top": "80px", "z-index": "1" }}>
              <Loader variant="bars" size={48} />
            </Center>
          )}

          <Box>
            {!props.loading && props.customers.length === 0 && (
              <Box sx={{ width: "33pc", padding: "20px" }}>
                <Alert
                  icon={<IconAlertCircle size="1rem" />}
                  title="No records!"
                  color="cyan"
                  radius="md"
                  variant="filled"
                >
                  There are currently no customer records. Start adding
                  customers using 'New Customer'.
                </Alert>
              </Box>
            )}
            {!props.loading && props.customers.length !== 0 && (
              <DetailsList
                selection={selection}
                selectionMode={SelectionMode.single}
                onRenderDetailsHeader={onRenderDetailsHeader}
                columns={currentColumns}
                items={props.customers}
                data-is-scrollable="true"
                layoutMode={DetailsListLayoutMode.fixedColumns}
              />
            )}
            <AddCustomer
              getCustomers={props.getCustomers}
              context={props.context}
              siteUrl={props.siteUrl}
              opened={opened}
              setOpened={setOpened}
            />
          </Box>
        </Box>
      )}
      {editMode && (
        <UpdateHours
          isAdmin={props.isAdmin}
          refreshCustomer={refreshCustomer}
          context={props.context}
          siteUrl={props.siteUrl}
          setSelectedCustomer={setSelectedCustomer}
          setEditMode={setEditMode}
          customer={selectedCustomer}
          getNewCustomers={getNewCustomers}
          historyAmount={historyAmount}
          setHistoryAmount={setHistoryAmount}
        />
      )}

      <Modal
        opened={deleteMode}
        onClose={() => {
          setDeleteMode(false);
        }}
        centered
        withCloseButton={false}
      >
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Caution!"
          color="red"
        >
          This will delete the Customer record and all history recorded.
        </Alert>
        <Space h="md" />

        <Group position="right">
          {" "}
          <Button
            onClick={() => {
              setDeleteMode(false);
            }}
          >
            No
          </Button>
          <Button
            onClick={() => {
              deleteCustomerRecord();
            }}
            color="red"
          >
            Yes
          </Button>
        </Group>
      </Modal>
    </>
  );
};
