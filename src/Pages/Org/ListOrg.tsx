import { useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { useTranslation } from "react-i18next";
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
import { confirmModal } from "../../Component/confirmModal";
import { orgCreate, orgDelete, orgUpdate } from "../../Service/org";
import { useGroupStore } from "../../store/group";
import { useOrgStore } from "../../store/org";
import { TOrg } from "../../type/org";
import { useOrgModal } from "./OrgForm";

type TOrgColumn = TOrg;

const OrgTableAction = ({ org }: { org: TOrgColumn }) => {
  const { updateOrg, deleteOrg } = useOrgStore();
  const { t } = useTranslation();
  const handleUpdateOrg = (org: TOrg) => {
    console.log({ handleUpdateOrg: org });
    orgUpdate(org)
      .then((res) => {
        const { status, data } = res;
        if (status === 200) {
          updateOrg(data as TOrg);
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
  const { handleToggle: handleToggleUpdateModal, OrgModal: OrgUpdateModal } =
    useOrgModal({
      onSubmit: handleUpdateOrg,
      org,
    });

  const handleConfirmDel = async () => {
    const { confirm } = await confirmModal();
    if (confirm) {
      orgDelete(org.id)
        .then((res) => {
          const { status, data } = res;
          console.log({ status, data });
          if (status === 200) {
            toast.success(t("success"));
            deleteOrg(org.id);
            return;
          }
          return Promise.reject(status);
        })
        .catch((err) => {
          toast.error(t("error"));
          console.log({ err });
        });
    }
    return;
  };

  return (
    <UL className="action simple-list flex-row" id={org.id}>
      <LI className="edit btn" onClick={handleToggleUpdateModal}>
        <i className="icon-pencil-alt" />
        <OrgUpdateModal />
      </LI>
      <LI className="delete btn" onClick={handleConfirmDel}>
        <i className="icon-trash cursor-pointer" />
      </LI>
    </UL>
  );
};

const ListOrg = () => {
  const [filterText, setFilterText] = useState("");
  const { t } = useTranslation();
  const { groups } = useGroupStore();
  const { orgs, addOrg } = useOrgStore();
  const filteredItems = orgs.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns: TableColumn<TOrgColumn>[] = [
    ...["name", "group_id"].map((c) => ({
      name: t(c),
      sortable: true,
      selector: (row: TOrgColumn) => {
        if (c == "group_id") {
          const group_id = row[c as keyof TOrgColumn];
          return groups.find((g) => g.id === group_id)?.name || "";
        }
        return row[c as keyof TOrgColumn];
      },
    })),
  ];
  if (columns.length > 0) {
    columns.push({
      name: "#",
      cell: (row: TOrgColumn) => <OrgTableAction org={row} />,
      sortable: true,
    });
  }

  const handleAddOrg = (org: TOrg) => {
    console.log({ handleAddOrg: org });
    const { id, ...rests } = org;
    orgCreate(rests)
      .then((res) => {
        const { status, data } = res;
        if (status === 200) {
          addOrg(data as TOrg);
          toast.info(t("success"));
          return;
        }
        return Promise.reject(status);
      })
      .catch((err) => {
        toast.error(t("error"));
        console.log({ err });
      });
  };
  const { handleToggle: handleToggleAddModal, OrgModal: OrgAddModal } =
    useOrgModal({ onSubmit: handleAddOrg });

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
    <div className="page-body">
      <Breadcrumbs mainTitle={"Danh mục đơn vị"} parent={"Hội thao TDTT"} />
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CardHeader className="pb-0 card-no-border">
                <div className="btn btn-primary" onClick={handleToggleAddModal}>
                  <i className="fa fa-plus" />
                  {"Thêm mới"}
                </div>
                <OrgAddModal />
              </CardHeader>
              <CardBody>
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
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export { ListOrg };
