import { TextControl } from "@wordpress/components";
import { useEffect, useReducer } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import DataGrid from "../../components/ui/Datagrid";
import Page from "../../components/ui/Page";
import { DataGridColumn } from "../../components/ui/datagrid/models/column";
import { Request } from "../../models/request";
import RequestService from "../../services/requests";

type State = {
  loading: boolean;
  items: Request[];
  total: number;
  filters: Record<string, string>;
  pagination: {
    page: number;
    size: number;
  };
  selection: { id: number; firstname: string; lastname: string }[];
};

type Action =
  | {
    type: "fetchItems";
    payload: { items: Request[]; total: number };
  }
  | {
    type: "setLoading";
    payload: boolean;
  }
  | {
    type: "setFilters";
    payload: Record<string, string>;
  }
  | {
    type: "setPagination";
    payload: { page: number; size: number };
  }
  | {
    type: "setSelection";
    payload: { id: number; firstname: string; lastname: string }[];
  };

export default function RequestListPage() {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const pageActions: any[] = [];

  const [state, dispatch] = useReducer(
    (state: State, action: Action) => {
      switch (action.type) {
        case "setLoading":
          return { ...state, loading: action.payload };
        case "fetchItems":
          return {
            ...state,
            items: action.payload.items,
            total: action.payload.total,
          };
        case "setFilters":
          return {
            ...state,
            filters: { ...state.filters, ...action.payload },
            pagination: { ...state.pagination, page: 0 },
          };
        case "setPagination":
          return {
            ...state,
            pagination: { ...state.pagination, ...action.payload },
          };
        case "setSelection":
          return {
            ...state,
            selection: action.payload,
          };
        default:
          return state;
      }
    },
    {
      items: [],
      total: 0,
      loading: false,
      filters: {
        "firstname": "",
        "lastname": "",
      },
      pagination: { page: 0, size: 20 },
      selection: [],
    },
  );

  const columns: DataGridColumn<Request>[] = [
    { name: "id", header: "ID", width: 70, type: "number" },
    {
      name: "firstname",
      header: "First Name",
      type: "text",
      data: "firstname",
    },
    {
      name: "lastname",
      header: "Last Name",
      type: "text",
      data: "lastname",
    },
    {
      name: "status",
      header: "Status",
      type: "text",
      data: "status",
    },
  ];

  const rowActions = [
    {
      name: "edit",
      label: "Edit",
      handler: (row: Request) => navigate(`/campaign/${campaignId}/requests/${row.id}`),
    },
  ];

  useEffect(() => {
    dispatch({ type: "setLoading", payload: true });
    RequestService.items(campaignId!, {
      page: state.pagination.page + 1,
      size: state.pagination.size,
      filters: { ...state.filters },
    }).then((data: { items: Request[]; total: number }) => {
      dispatch({ type: "fetchItems", payload: data });
      dispatch({ type: "setLoading", payload: false });
    });
  }, [campaignId, state.filters, state.pagination]);

  const handlePaginationChange = (model: any) => {
    const { page, pageSize } = model;
    dispatch({ type: "setPagination", payload: { page, size: pageSize } });
  };

  const handleFilterChange = (field: string, value: string) => {
    dispatch({ type: "setFilters", payload: { [field]: value } });
  };

  return (
    <>
      <div className="wrap">
        <Page title="Requests" actions={pageActions}>
          <div style={{ width: "100%", marginBottom: 12, border: "1px solid #dcdcde", borderRadius: 8, padding: 12 }}>
            <div style={{ display: "flex", alignItems: "center", flex: 1, gap: 12, flexWrap: "wrap" }}>
              <TextControl
                label="Firstname"
                onChange={(value) => handleFilterChange("firstname", value)}
              />
              <TextControl
                label="Lastname"
                onChange={(value) => handleFilterChange("lastname", value)}
              />
            </div>
          </div>

          {state.selection.length > 0 && (
            <div>
              <h2>Selected Members</h2>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {state.selection.map((request) => (
                  <span key={request.id} style={{ border: "1px solid #dcdcde", borderRadius: 999, padding: "2px 8px" }}>
                    {`${request.firstname} ${request.lastname}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ width: "100%" }}>
            <DataGrid
              rows={state.items}
              total={state.total}
              loading={state.loading}
              columns={columns}
              rowActions={rowActions}
              page={state.pagination.page}
              pageSize={state.pagination.size}
              onPaginationChange={({ page, pageSize }) =>
                dispatch({
                  type: "setPagination",
                  payload: { page, size: pageSize },
                })
              }
            />
          </div>
        </Page>
      </div>
      <Outlet />
    </>
  );
}
