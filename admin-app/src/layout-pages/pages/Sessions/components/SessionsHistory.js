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
  Button,
} from "reactstrap";
import { TableHead, TableBody } from "layout-pages/common/Table";
import CustomModal from "layout-pages/common/CustomModal";
import { reactQueryCacheCleaner, useListQuery } from "utils/hooks/useCrudQuery";
import HocApiData from "utils/hoc/HocApiData";
import { asyncPost } from "utils/helpers/api_helper";
import { useQueryClient } from "react-query";
import RcPagination from "layout-pages/common/RcPagination";
import Select from "react-select";
import { showAlertMsg } from "utils/hoc/Alerts";
import { useSelector } from "react-redux";
import { ROLE_SUPER_ADMIN } from "utils/constants/global";

const tableHead = [
  "Created at",
  "Project Id",
  "Files count",
  "Status",
  "Author",
  "Actions",
];

const orderByFields = [
  { value: "created_at", label: "Created at" },
  { value: "project_id", label: "Project id" },
];
const orderByType = [
  { value: "asc", label: "Asc" },
  { value: "desc", label: "Desc" },
];
const statusType = [
  { value: "", label: "All" },
  { value: "1", label: "Submited" },
  { value: "-1", label: "In Progress" },
];

const SessionsHistory = () => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState({ value: "desc", label: "Desc" });
  const [orderByWith, setOrderByWith] = useState({
    value: "created_at",
    label: "Created at",
  });
  const [authorFilter, setAuthorFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [isSubmitedFilter, setIsSubmitedFilter] = useState("");

  const url = useMemo(() => {
    const query = new URLSearchParams({
      page,
      order_by: orderBy?.value || "",
      order_with: orderByWith?.value || "",
      project_id: projectFilter?.value || "",
      submited: isSubmitedFilter?.value || "",
      user_id: authorFilter?.value || "",
    });
    return `bo/sessions?${query.toString()}`;
  }, [
    orderByWith,
    orderBy,
    page,
    projectFilter,
    isSubmitedFilter,
    authorFilter,
  ]);

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
      orderBy,
      orderByWith,
      projectFilter,
      isSubmitedFilter,
      authorFilter,
    },
    key: "@query-sessions",
  });

  //
  const { isLoading: isLoadingProjects, data: projectsData } = useListQuery({
    url: "bo/projects",
    key: "@query-projects",
  });
  const projects = useMemo(
    () =>
      projectsData && !isLoadingProjects
        ? [{ id: "", project_ref: "All" }].concat(projectsData)
        : [],
    [projectsData, isLoadingProjects]
  );

  //
  const { isLoading: isLoadingUsers, data: usersData } = useListQuery({
    url: "bo/all-users",
    key: "@query-all-users",
  });
  const users = useMemo(
    () =>
      usersData && !isLoadingUsers
        ? [{ id: "", first_name: "All", last_name: "" }].concat(usersData)
        : [],
    [usersData, isLoadingUsers]
  );

  // reopen session modal stuff
  const [currentItem, setCurrentItem] = useState(null);
  const [reopenSessionIsLoading, setReopenSessionIsLoading] = useState(false);
  const [showReopenSessionModal, setShowReopenSessionModal] = useState(false);
  const handleReopenSessionModal = (modal, current = null) => {
    setCurrentItem(current);
    setShowReopenSessionModal(modal);
  };
  const reopenSessionApi = () => {
    setReopenSessionIsLoading(true);
    asyncPost(`bo/reopen-session`, { session_id: currentItem?.id }).then(() => {
      reactQueryCacheCleaner({
        queryClient,
        resetKeys: ["@query-sessions"],
        invalidateKeys: [],
      });
      setReopenSessionIsLoading(false);
      handleReopenSessionModal(false);
    });
  };

  const itemsCount = useMemo(() => payload?.total || 0, [payload]);
  const perPage = useMemo(() => payload?.per_page || 10, [payload]);

  return (
    <>
      {/* reopenSession modal */}
      <CustomModal
        size="md"
        showFooter={false}
        title={"Reopen feedback"}
        isOpen={showReopenSessionModal}
        toggle={() => handleReopenSessionModal(false)}
        content={
          <>
            <div className="font-size-14">
              Are you sure to reopen this feedback ?
              <div className="d-flex align-items-center justify-content-between mt-3">
                <div>
                  <Button
                    color="danger"
                    disabled={reopenSessionIsLoading}
                    className="text-white px-3 py-2 mt-3"
                    onClick={() => handleReopenSessionModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
                <div>
                  <Button
                    color="success"
                    onClick={reopenSessionApi}
                    disabled={reopenSessionIsLoading}
                    className="text-white px-3 py-2 mt-3"
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </div>
          </>
        }
      />

      <MainWrapper title={"Sessions uploads"} heading={"Sessions uploads"}>
        <HocApiData error={isError} refetch={refetch} loading={isLoading}>
          <div className="d-flex align-items-center gap-3 mb-2 mt-5">
            <div>
              <label htmlFor={"user-id"}>Author</label>
              <Select
                name="user-id"
                value={authorFilter}
                placeholder="Filter by author"
                onChange={value => {
                  if (value?.value) setPage(1); // reset pagination
                  setAuthorFilter(value);
                }}
                options={users.map(item => ({
                  value: item.id,
                  label: item.first_name + " " + item.last_name,
                }))}
              />
            </div>

            <div>
              <label htmlFor={"project-id"}>Project Id</label>
              <Select
                name="project-id"
                value={projectFilter}
                placeholder="Filter by project id"
                onChange={value => {
                  if (value?.value) setPage(1); // reset pagination
                  setProjectFilter(value);
                }}
                options={projects.map(item => ({
                  value: item.id,
                  label: item.project_ref,
                }))}
              />
            </div>

            <div>
              <label htmlFor={"status"}>Status</label>
              <Select
                name="status"
                options={statusType}
                value={isSubmitedFilter}
                placeholder="Filter by status"
                onChange={value => {
                  if (value?.value) setPage(1); // reset pagination
                  setIsSubmitedFilter(value);
                }}
              />
            </div>
          </div>
          <Row>
            <Col lg="12">
              {/* <div className="table-responsive"> */}
              <Table className="project-list-table table-nowrap align-middle table-borderless mb-0 pb-12">
                <TableHead cols={tableHead} />
                {payload?.data?.length ? (
                  <TableBody
                    TableRow={TableRow}
                    data={payload?.data}
                    handleReopenSessionModal={handleReopenSessionModal}
                  />
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <h5 className="my-4 text-primary">No data to display</h5>
                    </td>
                  </tr>
                )}
              </Table>
              {/* </div> */}
              <div className="d-flex align-items-center gap-3 justify-content-end mt-2">
                <div>
                  <Select
                    value={orderByWith}
                    options={orderByFields}
                    placeholder="Select a field to order by"
                    onChange={value => setOrderByWith(value)}
                  />
                </div>
                <div>
                  <Select
                    value={orderBy}
                    options={orderByType}
                    placeholder="Select order direction"
                    onChange={value => setOrderBy(value)}
                  />
                </div>
              </div>
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

async function copyTextToClipboard(text) {
  if ("clipboard" in navigator) {
    await navigator.clipboard.writeText(text);
    showAlertMsg("info", "Url copied to clipboard.");
  }
}

function TableRow({ item, handleReopenSessionModal }) {
  const user = useSelector(state => state.Login.user);

  return (
    <tr>
      {/* <td style={{ width: "100px" }}>
        <img
          src={item.featured_image}
          alt="img"
          className="avatar-md h-auto d-block rounded"
          onError={e => {
            e.target.onerror = null;
            e.target.src = img_404;
            // e.target.style.width = "60px";
          }}
        />
      </td> */}
      <td>
        <h5 className="text-truncate font-size-14 mb-0">{item.created_at}</h5>
      </td>
      <td>
        <h5 className="text-truncate font-size-14 mb-0">
          {item.project?.project_ref || "--"}
        </h5>
      </td>
      <td>
        <h5 className="text-truncate font-size-14 mb-0">{item.files.length}</h5>
      </td>
      <td>
        <Badge
          className={
            !item?.submited_session?.length
              ? "font-size-13 badge-soft-success"
              : "font-size-13 badge-soft-warning"
          }
          color={!item?.submited_session?.length ? "success" : "warning"}
          pill
        >
          {!item?.submited_session?.length ? "In progess" : "Submited"}
        </Badge>
      </td>
      <td>
        <h5 className="text-truncate font-size-14 mb-0">
          {`${item.author?.first_name} ${item.author?.last_name}` || "--"}
        </h5>
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
                copyTextToClipboard(item.session_url);
              }}
            >
              <i className="mdi mdi-content-copy font-size-16 text-primary me-2" />
              Copy session url
            </DropdownItem>
            {!!item?.submited_session?.length &&
              user?.role?.name === ROLE_SUPER_ADMIN && (
                <DropdownItem
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    handleReopenSessionModal(true, item);
                  }}
                >
                  <i className="mdi mdi-pencil font-size-16 text-success me-2" />
                  Reopen feedback
                </DropdownItem>
              )}
          </DropdownMenu>
        </UncontrolledDropdown>
      </td>
    </tr>
  );
}

TableRow.propTypes = {
  item: PropTypes.object,
  handleReopenSessionModal: PropTypes.func,
};

export default withTranslation()(SessionsHistory);
