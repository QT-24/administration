import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Label,
  Row,
} from "reactstrap";
import { LI, UL } from "../../AbstractElements";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import CommonButtonsToolTip from "../../Component/Buttons/CommonButtons/CommonButtonsToolTip";
import { confirmModal } from "../../Component/confirmModal";
import { N } from "../../name-conversion";
import { tablequalifyingGen } from "../../Service/tablequalifying";
import {
  tablequalifyingMatchCreate,
  tablequalifyingMatchDelete,
  tablequalifyingMatchUpdate,
} from "../../Service/tablequalifyingMatch";
import { useTablequalifyingMatchStore } from "../../store/tablequalifyingMatch";
import { TTablequalifyingMatch } from "../../type/tablequalifyingMatch";
import { SearchTableButton } from "../../utils/Constant";
import { convertToDate } from "../../utils/date";
import { useTablequalifyingMatchModal } from "./TablequalifyingMatchForm";

type TTablequalifyingColumn = Omit<TTablequalifyingMatch, "list_member_id">;

const TablequalifyingTableAction = ({
  tablequalifyingMatch,
}: {
  tablequalifyingMatch: TTablequalifyingColumn;
}) => {
  const { updateTablequalifyingMatch, deleteTablequalifyingMatch } =
    useTablequalifyingMatchStore();
  const { t } = useTranslation();
  const handleUpdateTablequalifyingMatch = (
    tablequalifyingMatch: TTablequalifyingMatch
  ) => {
    // console.log({ handleUpdateTablequalifyingMatch: tablequalifyingMatch });
    tablequalifyingMatchUpdate(tablequalifyingMatch)
      .then((res) => {
        const { status, data } = res;
        if (status === 200) {
          console.log({ data });
          // updateTablequalifyingMatch(data as TTablequalifyingMatch);
          updateTablequalifyingMatch(tablequalifyingMatch);
          toast.success(t("success"));
          return;
        }

        return Promise.reject(status);
      })
      .catch((err) => {
        toast.error(t("error"));
        console.log({ err });
      });
  };
  const {
    handleToggle: handleToggleUpdateModal,
    TablequalifyingMatchModal: TablequalifyingUpdateModal,
  } = useTablequalifyingMatchModal({
    onSubmit: handleUpdateTablequalifyingMatch,
    tablequalifyingMatch,
  });

  const handleConfirmDel = async () => {
    const { confirm } = await confirmModal();
    if (confirm) {
      tablequalifyingMatchDelete(tablequalifyingMatch.id)
        .then((res) => {
          const { status, data } = res;
          console.log({ status, data });
          if (status === 200) {
            toast.success(t("success"));
            deleteTablequalifyingMatch(tablequalifyingMatch.id);
            return;
          }
          return Promise.reject(status);
        })
        .catch((err) => {
          toast.error(t(err?.response?.data || "error"));
          console.log({ err });
        });
    }
    return;
  };

  return (
    <UL className="action simple-list flex-row" id={tablequalifyingMatch.id}>
      <LI className="edit btn">
        <i className="icon-pencil-alt" onClick={handleToggleUpdateModal} />
        <TablequalifyingUpdateModal />
      </LI>
      <LI className="delete btn">
        <i className="icon-trash cursor-pointer" onClick={handleConfirmDel} />
      </LI>
      <LI className="btn">
        <i className="icon-summernote cursor-pointer" />
      </LI>
      {/* <LI className="btn">
        <i className="icon-summernote cursor-pointer">Lập lịch</i>
      </LI>
      <LI className="btn">
        <i className="icon-square cursor-pointer">Nhập kết quả</i>
      </LI> */}
    </UL>
  );
};

interface IListTablequalifyingMatch {
  showAction?: boolean;
  selectableRows?: boolean;
  onRowSelect?: (
    row: TTablequalifyingMatch,
    e: React.MouseEvent<Element, MouseEvent>
  ) => void;
  onSelectedRowsChange?: (v: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: TTablequalifyingMatch[];
  }) => void;
  columns?: TableColumn<TTablequalifyingColumn>[];
  data?: TTablequalifyingMatch[];
  selectableRowSelected?: (row: TTablequalifyingMatch) => boolean;
  loading?: boolean;
}

const tableColumns = (
  [
    "indexs",
    // "created?",
    "team1_name",
    "team2_name",
    "match_day",
    "match_hour",
    "match_location",
    "match_location_chid",
  ] as (keyof TTablequalifyingColumn)[]
).map((c) => ({
  name: N[c],
  sortable: true,
  selector: (row: TTablequalifyingColumn) => {
    const col = c as keyof TTablequalifyingColumn;
    switch (col) {
      case "match_day":
        return row[col] ? convertToDate(row[col]) : "";
    }
    return row?.[col]
      ? (row[col as keyof TTablequalifyingColumn] || "").toString()
      : ("" as string | number);
  },
}));

const ListTablequalifyingMatch = ({
  showAction,
  onRowSelect,
  onSelectedRowsChange,
  columns = [...tableColumns],
  data = [],
  selectableRowSelected,
  loading,
}: IListTablequalifyingMatch) => {
  const [filterText, setFilterText] = useState("");
  const filteredItems = data.filter((item) => item);

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div
        id="basic-1_filter"
        className="dataTables_filter d-flex align-items-center"
      >
        <Label className="me-2">{SearchTableButton}:</Label>
        <Input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFilterText(e.target.value)
          }
          type="search"
          value={filterText}
        />
      </div>
    );
  }, [filterText]);

  let displayColumns = [...columns];
  if (showAction) {
    displayColumns = [
      ...displayColumns,
      {
        name: "#",
        cell: (row: TTablequalifyingColumn) => (
          <TablequalifyingTableAction tablequalifyingMatch={row} />
        ),
        sortable: true,
      },
    ];
  }
  return (
    <div className="table-responsive">
      <DataTable
        columns={displayColumns}
        data={filteredItems}
        pagination
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        highlightOnHover
        striped
        persistTableHead
        selectableRowsHighlight
        onRowClicked={onRowSelect}
        onSelectedRowsChange={onSelectedRowsChange}
        selectableRows={!!onRowSelect || !!onSelectedRowsChange}
        progressPending={loading}
      />
    </div>
  );
};

const PageTablequalifyingMatch = () => {
  const { t } = useTranslation();
  const {
    updateTableId,
    addTablequalifyingMatch,
    tablequalifyingMatchs,
    addTablequalifyingMatchs,
  } = useTablequalifyingMatchStore();
  const { table_id } = useParams();

  useEffect(() => {
    if (table_id) {
      // const filterValue = getFilterByValue("sport_id", "=", table_id);
      updateTableId(table_id);
    } else {
      // updateGetFilter({ ...filters, filter: "" });
    }
  }, [table_id]);

  const handleAddTablequalifyingMatch = (
    tablequalifyingMatch: TTablequalifyingMatch
  ) => {
    console.log({ handleAddTablequalifyingMatch: tablequalifyingMatch });
    const { id, ...rests } = tablequalifyingMatch;
    tablequalifyingMatchCreate(rests)
      .then((res) => {
        const { status, data } = res;
        console.log({ addTablequalifyingMatchResult: data });
        if (status === 200) {
          const newData = {
            ...tablequalifyingMatch,
            ...data,
          } as TTablequalifyingMatch;
          console.log({ tablequalifyingMatchCreate: newData });
          addTablequalifyingMatch(newData);
          toast.info(t("success"));
          return;
        }
        return Promise.reject(status);
      })
      .catch((err) => {
        toast.error(err?.data ? err.data : t("error"));
        console.log({ err });
      });
  };

  const {
    handleToggle: handleToggleAddModal,
    TablequalifyingMatchModal: TablequalifyingAddModal,
  } = useTablequalifyingMatchModal({
    onSubmit: handleAddTablequalifyingMatch,
    tablequalifyingMatch: {
      table_id: table_id || "",
      team1_id: "",
      team2_id: "",
      indexs: 0,
      match_day: new Date().toISOString(),
      match_time: "",
    },
  });

  const handleGenTablequalifying = useCallback(async () => {
    if (table_id) {
      console.log({ table_id });
      const { confirm } = await confirmModal(
        "Sinh lịch đấu sẽ thiết lập lại cả các lịch cũ"
      );
      if (confirm)
        tablequalifyingGen(table_id)
          .then((res) => {
            const { data, status } = res;
            console.log({ data, status });
            if (status === 200) {
              addTablequalifyingMatchs(data);
              toast.success(N["success"]);
            }
          })
          .catch((err) => {
            toast.error(err?.data ? err.data : toast.error(N["failed"]));
            console.log({ err });
          });
    }
  }, [table_id]);

  return (
    <div className="page-body">
      <Breadcrumbs mainTitle={"Lịch thi đấu"} parent={"HTTQ2024"} />
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CardHeader className="pb-0 card-no-border">
                <div className="flex gap-2">
                  <div
                    className="btn btn-primary"
                    onClick={handleToggleAddModal}
                  >
                    <i className="fa fa-plus" />
                    {"Thêm mới"}
                  </div>
                  <div
                    className="btn btn-danger"
                    id="gen-table"
                    onClick={handleGenTablequalifying}
                  >
                    <i className="fa fa-plus" />
                    {"Sinh lịch đấu"}
                  </div>
                  <CommonButtonsToolTip
                    toolTipText="Sinh lịch đấu sẽ thiết lập lại cả các lịch cũ"
                    id="gen-table"
                  />
                </div>
                <TablequalifyingAddModal />
              </CardHeader>
              <CardBody>
                <ListTablequalifyingMatch
                  data={tablequalifyingMatchs}
                  showAction
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export { ListTablequalifyingMatch, PageTablequalifyingMatch };
