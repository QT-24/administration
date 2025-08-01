import { useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { toast } from "react-toastify";
import { Card, CardBody, Col, Container, Input, Label, Row } from "reactstrap";
import { LI, UL } from "../../AbstractElements";
import Breadcrumbs from "../../CommonElements/Breadcrumbs/Breadcrumbs";
import { N } from "../../name-conversion";
import { sportLocationUpdate, sportNameUpdate } from "../../Service/sport";
import { useSportStore } from "../../store/sport";
import { TSport } from "../../type/sport";
import { useSportModal } from "./SportForm";

type TSportColumn = TSport;

const SportTableAction = ({ sport }: { sport: TSportColumn }) => {
  const { updateSport } = useSportStore();

  const handleUpdateSport = (sport: TSport) => {
    console.log({ handleUpdateSport: sport });
    Promise.all([sportNameUpdate(sport), sportLocationUpdate(sport)])
      .then(() => {
        updateSport(sport);
        toast.success(N["success"]);
      })
      .catch((err) => {
        toast.error(N["failed"]);
        console.log({ handleUpdateSport: err });
      });
  };

  const {
    handleToggle: handleToggleUpdateModal,
    SportModal: SportUpdateModal,
  } = useSportModal({
    onSubmit: handleUpdateSport,
    sport,
  });

  // const { handleToggle: toggleLotsDrawModal, LotsDrawModal } = useLotsDrawModal({ sportId: sport.id });

  // const handleConfirmDel =  async () => {
  //   if (confirm) {
  //   if (confirm) {
  //     sportDelete(sport.id).then((res) => {
  //       const { status, data } = res;
  //       console.log({ status, data });
  //       if (status === 200) {
  //         toast.success(t("success"));
  //         deleteSport(sport.id);
  //         return;
  //       }
  //       return Promise.reject(status);
  //     })
  //       .catch((err) => {
  //         toast.error(t("error"));
  //         console.log({ err });
  //       });
  //   }
  //   return;
  // };

  // const navigate = useNavigate();

  return (
    <UL className="action simple-list flex-row" id={sport.id}>
      <LI className="edit btn">
        <i className="icon-pencil-alt" onClick={handleToggleUpdateModal} />
        <SportUpdateModal />
      </LI>
    </UL>
  );
};

interface IListSport {
  showAction?: boolean;
  selectableRows?: boolean;
  onRowSelect?: (row: TSport, e: React.MouseEvent<Element, MouseEvent>) => void;
  onSelectedRowsChange?: (v: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: TSport[];
  }) => void;
  columns?: TableColumn<TSportColumn>[];
  data?: TSportColumn[];
  selectableRowSelected?: (row: TSportColumn) => boolean;
}

const tableColumns = (["name", "sport_location"] as (keyof TSportColumn)[]).map(
  (c) => ({
    name: N[c],
    sortable: true,
    selector: (row: TSportColumn) => {
      return row[c as keyof TSportColumn] as string | number;
    },
  })
);

const ListSport = ({
  data = [],
  showAction,
  onRowSelect,
  onSelectedRowsChange,
  columns = [...tableColumns],
  selectableRowSelected,
}: IListSport) => {
  const [filterText, setFilterText] = useState("");
  const { loading } = useSportStore();
  const filteredItems = data.filter((item) => item);

  // const handlePerRowsChange = (newPerPage: number, page: number) => {
  //     const take = newPerPage;
  //     const skip = Math.max(page - 1, 0) * take;
  //     updateGetFilter({ take, skip });
  // };
  //
  // const handlePageChange = (page: number) => {
  //     if (!filters) return;
  //     const { take } = filters;
  //     if (take) {
  //         updateGetFilter({ skip: Math.max(page - 1, 0) * take });
  //     }
  // };

  if (columns.length > 0 && showAction) {
    columns = [
      ...columns,
      {
        name: "#",
        cell: (row: TSportColumn) => <SportTableAction sport={row} />,
        sortable: true,
      },
    ];
  }

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div
        id="basic-1_filter"
        className="dataTables_filter d-flex align-items-center"
      >
        <Label className="me-2">Tìm kiếm</Label>
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

  return (
    <div className="table-responsive">
      <DataTable
        columns={columns}
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
        // progressPending={loading}
        // paginationServer
        // paginationTotalRows={total}
        // onChangeRowsPerPage={handlePerRowsChange}
        // onChangePage={handlePageChange}
        selectableRowSelected={selectableRowSelected}
      />
    </div>
  );
};

const PageSport = () => {
  const { sports } = useSportStore();
  console.log({ sports });

  return (
    <div className="page-body">
      <Breadcrumbs mainTitle={"Môn thi"} parent={"Hội thao TDTT"} />
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              {/* <CardHeader className="pb-0 card-no-border"> */}
              {/*   <div className="btn btn-primary" onClick={handleToggleAddModal}> */}
              {/*     <i className="fa fa-plus" /> */}
              {/*     {"Thêm mới"} */}
              {/*   </div> */}
              {/*   <SportAddModal /> */}
              {/* </CardHeader> */}
              <CardBody>
                <ListSport
                  data={sports}
                  showAction
                  // columns={[...tableColumns]}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export { ListSport, PageSport };
