import {
  Alert,
  Box,
  Button,
  Center,
  Divider,
  Group,
  Loader,
  Modal,
  Space,
  Text,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconArrowBack,
  IconCircleMinus,
  IconCirclePlus,
  IconEdit,
  IconHistory,
  IconTrash,
  IconUserEdit,
} from "@tabler/icons-react";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  getCustomerHistory,
  deleteSingleHistory,
  updateCustomerTotalHours,
} from "../services/api";
import { AllocateHours } from "./allocateHours";
import { EditCustomer } from "./editCustomer";
import { EditHistory } from "./editHistory";
import {
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  IDetailsColumnRenderTooltipProps,
  IDetailsHeaderProps,
  IRenderFunction,
  SelectionMode,
  Selection,
  TooltipHost,
} from "office-ui-fabric-react";

import * as moment from "moment";
import { DeAllocateHours } from "./deAllocateHours";
import { showNotification } from "@mantine/notifications";

export const UpdateHours: React.FunctionComponent<any> = (props: any) => {
  const [history, setHistory] = useState([]);
  const [currentColumns, setCurrentColumns] = useState<any>([]);
  const [deAllocateOpened, setDeAllocateOpened] = useState(false);
  const [editNameOpened, setEditNameOpened] = useState(false);
  const [editHoursOpened, setEditHoursOpened] = useState(false);
  const [deleteHoursOpened, setDeleteHoursOpened] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<any>([]);

  const [allocateOpened, setAllocateOpened] = useState(false);
  const [loading, setLoading] = useState(true);

  const selection = new Selection({
    onSelectionChanged: () => {
      setSelectedHistory([]);
      setSelectedHistory([...selection.getSelection()]);
    },
  });

  const deleteCustomerRecord = () => {
    deleteSingleHistory(
      props.context,
      props.siteUrl,
      selectedHistory[0].Id
    ).then((resp: any) => {
      console.log("response from history delete ", resp);
      if (resp.ok === true) {
        if (selectedHistory[0].Title === "Hours Allocated") {
          let newAmount =
            props.customer[0].TotalHours -
            selectedHistory[0].ContractHoursCredited;
          let newBalance =
            props.customer[0].RemainingHours -
            selectedHistory[0].ContractHoursCredited;
          updateCustomerTotalHours(
            props.context,
            props.siteUrl,
            props.customer[0].Id,
            newAmount,
            props.customer[0].TotalUsedHours,
            newBalance
          ).then((resp: any) => {
            console.log("should run after : ", resp);
            setDeleteHoursOpened(false);
            props.refreshCustomer();
            getHistory();
            showNotification({
              title: "Success",
              message: "Record Deleted",
              color: "Blue",
            });
          });
        } else {
          let newAmount =
            props.customer[0].TotalUsedHours - selectedHistory[0].HoursUsed;
          let newBalance =
            props.customer[0].RemainingHours + selectedHistory[0].HoursUsed;
          updateCustomerTotalHours(
            props.context,
            props.siteUrl,
            props.customer[0].Id,
            props.customer[0].TotalHours,
            newAmount,

            newBalance
          ).then((resp: any) => {
            console.log("should run after : ", resp);
            setDeleteHoursOpened(false);
            props.refreshCustomer();
            getHistory();
            showNotification({
              title: "Success",
              message: "Record Deleted",
              color: "Blue",
            });
          });
        }
      } else {
        showNotification({
          title: "Error",
          message: "Error Deleting Record",
          color: "Red",
        });
      }
    });
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
    getHistory(1000, column.key, direction);
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

  const _renderItemColumn = (item: any, index: number, column: IColumn) => {
    const fieldContent = item[column.fieldName as keyof any] as string;

    switch (column.data) {
      case "date":
        return moment(fieldContent).isValid()
          ? moment(fieldContent).format("DD/MM/YYYY")
          : "";

      default:
        return fieldContent;
    }
  };

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

  const getHistory = (top = 3, field = "TrackDate", direction = "desc") => {
    console.log("history amount : ", top);
    getCustomerHistory(
      props.context,
      props.siteUrl,
      props.customer[0].ID,
      top,
      field,
      direction
    ).then((resp: any) => {
      setLoading(false);
      setHistory(resp);
      console.log(resp);
    });
  };
  const columns: IColumn[] = [
    {
      key: "TrackDate",
      name: "Track Date",
      fieldName: "TrackDate",
      minWidth: 150,
      maxWidth: 150,
      isRowHeader: true,
      isResizable: true,
      isSorted: false,
      isSortedDescending: false,
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      onColumnClick: onColumnClick,
      data: "date",
    },
    {
      key: "Title",
      name: "Action",
      fieldName: "Title",
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
      key: "ZendeskRefID",
      name: "Zendesk ID",
      fieldName: "ZendeskRefID",
      minWidth: 150,
      maxWidth: 150,
      isRowHeader: true,
      isResizable: true,
      isSorted: false,
      isSortedDescending: false,
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      onColumnClick: onColumnClick,
      data: "string",
    },
    {
      key: "RemedyRefID",
      name: "Remedy ID",
      fieldName: "RemedyRefID",
      minWidth: 150,
      maxWidth: 150,
      isRowHeader: true,
      isResizable: true,
      isSorted: false,
      isSortedDescending: false,
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      onColumnClick: onColumnClick,
      data: "string",
    },
    {
      key: "ContractID",
      name: "Contract ID",
      fieldName: "ContractID",
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
      key: "ContractHoursCredited",
      name: "Contract Hours Credited",
      fieldName: "ContractHoursCredited",
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
      key: "HoursUsed",
      name: "Hours Used",
      fieldName: "HoursUsed",
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
    console.log("View all list props ", props.customer[0]);
    //setWorking(true);
    setCurrentColumns(columns);
    getHistory(3);
  }, []);

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          "z-index": "200",
          backgroundColor: "white",
          width: "100%",
          paddingTop: 10,
        }}
      >
        <Box sx={{ "z-index": "2" }}>
          <Group sx={{ "margin-bottom": "10px" }}>
            <Button
              leftIcon={<IconArrowBack />}
              variant="white"
              onClick={() => {
                props.setEditMode(false);
                props.setSelectedCustomer("");
                props.getNewCustomers();
                props.setHistoryAmount(3);
              }}
            >
              Return
            </Button>
            <Button
              leftIcon={<IconCirclePlus />}
              variant="white"
              onClick={() => {
                setAllocateOpened(true);
              }}
            >
              Allocate Hours
            </Button>
            <Button
              disabled={props.customer[0].RemainingHours === 0}
              leftIcon={<IconCircleMinus />}
              variant="white"
              onClick={() => {
                setDeAllocateOpened(true);
              }}
            >
              De-Allocate Hours
            </Button>
          </Group>
        </Box>
        <Divider></Divider>
      </Box>
      <Box
        sx={{
          paddingTop: 65,
          paddingLeft: 10,
          paddingRight: 10,
          "z-index": "1",
        }}
      >
        <Box>
          <Box
            sx={{ border: "1px solid #eee", borderRadius: "3px", padding: 10 }}
          >
            <Group>
              <Text sx={{ fontSize: 30 }} fw={700}>
                {props.customer[0].CustomerName}
              </Text>
              {props.isAdmin && (
                <Button
                  leftIcon={<IconEdit />}
                  variant="white"
                  onClick={() => {
                    setEditNameOpened(true);
                  }}
                ></Button>
              )}
            </Group>

            <Box sx={{ paddingTop: 30 }}>
              <Text size="lg" weight={500}>
                Summary
              </Text>
            </Box>
            <Group position="left" mt="md" mb="xs">
              <Box>
                <Text size="md">Total Hours</Text>
                <Text size="sm" color="dimmed" align="right">
                  {props.customer[0].TotalHours}
                </Text>
              </Box>
              <Box>
                <Text size="md">Total Used Hours</Text>
                <Text size="sm" color="dimmed" align="right">
                  {props.customer[0].TotalUsedHours}
                </Text>
              </Box>
              <Box>
                <Text size="md">Remaining Hours</Text>
                <Text size="sm" color="dimmed" align="right">
                  {props.customer[0].RemainingHours}
                </Text>
              </Box>
            </Group>
            <Box sx={{ paddingTop: 30 }}>
              <Group>
                {" "}
                <Text size="lg" weight={500}>
                  Recent History
                </Text>{" "}
                <Button
                  disabled={loading}
                  leftIcon={<IconHistory />}
                  variant="white"
                  onClick={() => {
                    setLoading(true);

                    // props.setHistoryAmount(3000);
                    getHistory(3000);
                  }}
                >
                  Expand history
                </Button>
                {props.isAdmin && (
                  <Button
                    disabled={!selectedHistory.length}
                    leftIcon={<IconUserEdit />}
                    variant="white"
                    onClick={() => {
                      setEditHoursOpened(true);
                    }}
                  >
                    Edit Hours
                  </Button>
                )}
                {props.isAdmin && (
                  <Button
                    disabled={
                      !selectedHistory.length ||
                      selectedHistory[0].Title === "Customer Created"
                    }
                    leftIcon={<IconTrash />}
                    variant="white"
                    onClick={() => {
                      setDeleteHoursOpened(true);
                    }}
                  >
                    Delete Record
                  </Button>
                )}
              </Group>

              <DetailsList
                selection={selection}
                selectionMode={SelectionMode.single}
                // selectionMode={
                //   props.isAdmin ? SelectionMode.single : SelectionMode.none
                // }
                onRenderDetailsHeader={onRenderDetailsHeader}
                columns={currentColumns}
                items={history}
                data-is-scrollable="true"
                onRenderItemColumn={_renderItemColumn}
                layoutMode={DetailsListLayoutMode.fixedColumns}
              />
              {loading && (
                <Center sx={{ "padding-top": "80px", "z-index": "1" }}>
                  <Loader variant="bars" size={48} />
                </Center>
              )}
              <EditCustomer
                refreshCustomer={props.refreshCustomer}
                customer={props.customer}
                context={props.context}
                siteUrl={props.siteUrl}
                opened={editNameOpened}
                setOpened={setEditNameOpened}
              />
              {/* {selectedHistory.length > 0 &&
                selectedHistory[0].Title !== "Hours DeAllocated" && (
                  <EditAllocations
                    selectedHistory={selectedHistory}
                    refreshCustomer={props.refreshCustomer}
                    customer={props.customer}
                    context={props.context}
                    siteUrl={props.siteUrl}
                    getHistory={getHistory}
                    opened={editHoursOpened}
                    setOpened={setEditHoursOpened}
                  />
                )} */}

              <Modal
                onClose={() => {
                  setEditHoursOpened(false);
                }}
                opened={editHoursOpened}
              >
                <EditHistory
                  customer={props.customer}
                  refreshCustomer={props.refreshCustomer}
                  context={props.context}
                  siteUrl={props.siteUrl}
                  selectedHistory={selectedHistory[0]}
                  opened={editHoursOpened}
                  setEditHoursOpened={setEditHoursOpened}
                  getHistory={getHistory}
                />
              </Modal>

              <AllocateHours
                refreshCustomer={props.refreshCustomer}
                customer={props.customer}
                context={props.context}
                siteUrl={props.siteUrl}
                opened={allocateOpened}
                setOpened={setAllocateOpened}
                getHistory={getHistory}
              />
              <DeAllocateHours
                refreshCustomer={props.refreshCustomer}
                customer={props.customer}
                context={props.context}
                siteUrl={props.siteUrl}
                opened={deAllocateOpened}
                setOpened={setDeAllocateOpened}
                getHistory={getHistory}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Modal
        opened={deleteHoursOpened}
        onClose={() => {
          setDeleteHoursOpened(false);
        }}
        centered
        withCloseButton={false}
      >
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Caution!"
          color="red"
        >
          This record will be deleted.
        </Alert>
        <Space h="md" />

        <Group position="right">
          {" "}
          <Button
            onClick={() => {
              setDeleteHoursOpened(false);
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
