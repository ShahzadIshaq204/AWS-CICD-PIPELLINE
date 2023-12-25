import MainWrapper from "layout-pages/common/MainWrapper";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { withTranslation } from "react-i18next";
import {
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  Table,
  UncontrolledDropdown,
  Badge,
} from "reactstrap";
import { TableHead, TableBody } from "layout-pages/common/Table";
import CustomModal from "layout-pages/common/CustomModal";
import { useListQuery } from "utils/hooks/useCrudQuery";
import HocApiData from "utils/hoc/HocApiData";
import FormEditUser from "./FormEditUser";
import FormAddUser from "./FormAddUser";
import RcPagination from "layout-pages/common/RcPagination";

const tableHead = [
  "First name",
  "Last name",
  "Email",
  "Role",
  // "Status",
  "Created at",
  "Actions",
];

const UsersHistory = () => {
  const [currentItem, setCurrentItem] = useState(null);

  // add modal stuff
  const [showAddModal, setShowAddModal] = useState(false);

  // edit modal stuff
  const [showEditModal, setShowEditModal] = useState(false);
  const handleEditModal = (modal, current = null) => {
    setCurrentItem(current);
    setShowEditModal(modal);
  };

  // const {
  //   isLoading,
  //   isError,
  //   refetch,
  //   data: payload,
  // } = useListQuery({
  //   url: "bo/users",
  //   key: "@query-users",
  // });

  const [page, setPage] = useState(1);
  const url = useMemo(() => {
    const query = new URLSearchParams({
      page,
    });
    return `bo/users?${query.toString()}`;
  }, [page]);

  const {
    isLoading,
    isError,
    refetch,
    data: payload,
  } = useListQuery({
    url,
    paginated: true,
    paginationConfig: {
      page,
    },
    key: "@query-users",
  });

  const stats = [
    {
      title: "All users",
      iconClass: "bxs-user",
      description: payload?.data?.length,
      color: "primary",
    },

    {
      title: "Active users",
      iconClass: "bx-check",
      description: payload?.data?.filter(item => item.active).length,
      color: "success",
    },
    {
      title: "Project managers",
      iconClass: "bx-archive-in",
      description: payload?.data?.filter(item => item.group_id !== 1).length,
      color: "info",
    },
  ];

  const itemsCount = useMemo(() => payload?.total || 0, [payload]);
  const perPage = useMemo(() => payload?.per_page || 10, [payload]);

  return (
    <>
      {/* add modal */}
      <CustomModal
        size="lg"
        showFooter={false}
        isOpen={showAddModal}
        title={"Add new account"}
        toggle={() => setShowAddModal(false)}
        content={
          <FormAddUser
            fromShopPage={false}
            closeModal={() => setShowAddModal(false)}
          />
        }
      />

      {/* edit modal */}
      <CustomModal
        title={"Edit Account"}
        isOpen={showEditModal}
        toggle={() => handleEditModal(false)}
        size="lg"
        showFooter={false}
        content={
          <FormEditUser closeModal={handleEditModal} editData={currentItem} />
        }
      ></CustomModal>

      <MainWrapper title={"Users"} heading={"Users"}>
        <HocApiData
          loading={isLoading}
          error={isError}
          isEmpty={payload?.data?.length === 0}
          refetch={refetch}
        >
          {/* <Row>
            {stats.map((st, key) => (
              <Col md="4" key={"_col_" + key}>
                <CustomCard
                  title={st.title}
                  description={st.description}
                  iconClass={st.iconClass}
                  color={st.color}
                />
              </Col>
            ))}
          </Row> */}
          <Row>
            <Col lg="12">
              <div className="d-flex align-items-center justify-content-end mb-2 mt-2">
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setShowAddModal(true)}
                  >
                    <i className="bx bx-plus font-size-18 align-middle me-2"></i>
                    New account
                  </button>
                </div>
              </div>

              {/* <div className="table-responsive"> */}
              <Table className="project-list-table table-nowrap align-middle table-borderless mb-0 pb-12">
                <TableHead cols={tableHead} />
                <TableBody
                  data={payload?.data || []}
                  TableRow={TableRow}
                  handleEditModal={handleEditModal}
                />
              </Table>
              {/* </div> */}
              <RcPagination
                page={page}
                perPage={perPage}
                total={itemsCount}
                onChange={page => setPage(page)}
              />
            </Col>
          </Row>
        </HocApiData>
      </MainWrapper>
    </>
  );
};

function TableRow({ item, handleEditModal }) {
  return (
    <tr>
      <td>
        <p className="text-truncate font-size-14 mb-0">{item.first_name}</p>
      </td>
      <td>
        <p className="text-truncate font-size-14 mb-0">{item.last_name}</p>
      </td>
      <td>
        <h5 className="text-truncate font-size-14 mb-0">{item.email}</h5>
      </td>
      <td>
        <Badge
          className={
            item.group_id === 1
              ? "font-size-13 badge-soft-success"
              : "font-size-13 badge-soft-info"
          }
          color={item.group_id === 1 ? "success" : "info"}
          pill
        >
          {item.group_id === 1 ? "Admin" : "Project Manager"}
        </Badge>
      </td>
      <td>
        <h5 className="text-truncate font-size-14 mb-0">{item.created_at}</h5>
      </td>
      <td>
        <UncontrolledDropdown style={{ cursor: "pointer" }}>
          <DropdownToggle href="#" className="card-drop" tag="i">
            <i className="mdi mdi-dots-horizontal font-size-18" />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem
              href="#"
              onClick={e => {
                e.preventDefault();
                handleEditModal(true, item);
              }}
            >
              <i className="mdi mdi-pencil font-size-16 text-success me-2" />
              Edit account
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </td>
    </tr>
  );
}

TableRow.propTypes = {
  item: PropTypes.object,
  handleEditModal: PropTypes.func,
};

export default withTranslation()(UsersHistory);
