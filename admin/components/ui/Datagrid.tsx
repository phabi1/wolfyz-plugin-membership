import { useMemo } from "react";
import DataGridCellActions from "./datagrid/cell/Axtions";
import { DataGridAction } from "./datagrid/models/action";
import { DataGridColumn } from "./datagrid/models/column";
import DataGridPagination from "./datagrid/Pagination";
import DataGridCellOutlet from "./datagrid/CellOutlet";

export type DataGridOptions<T> = {
  columns: DataGridColumn<T>[];
  rows: T[];
  total: number;
  rowActions?: DataGridAction<T>[];
  loading?: boolean;
  page?: number;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  onPaginationChange?: ({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }) => void;
  onSelectionChange?: (selection: T[]) => void;
};

export default function DataGrid<T>(options: DataGridOptions<T>) {
  const actionColumn = useMemo<DataGridColumn<T> | null>(() => {
    if (!options.rowActions || options.rowActions.length === 0) {
      return null;
    }
    return {
      name: "__actions",
      header: "Actions",
      type: "custom",
      width: 200,
      renderCell: (value: any, row: T) => (
        <DataGridCellActions actions={options.rowActions!} row={row} />
      ),
    };
  }, [options.rowActions]);

  const displayedColumns = useMemo<DataGridColumn<T>[]>(() => {
    const columns = [...options.columns];
    if (actionColumn) {
      columns.push(actionColumn);
    }
    return columns;
  }, [options.columns, actionColumn]);

  return (
    <div style={{ border: "1px solid #dcdcde", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {displayedColumns.map((col) => (
                <th key={col.name} style={{ width: col.width, textAlign: "left", padding: 10, borderBottom: "1px solid #dcdcde" }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {options.loading ? (
              <tr>
                <td colSpan={displayedColumns.length} style={{ textAlign: "center", padding: 12 }}>
                  Loading...
                </td>
              </tr>
            ) : null}
            {options.rows.length === 0 && !options.loading ? (
              <tr>
                <td colSpan={displayedColumns.length} style={{ textAlign: "center", padding: 12 }}>
                  No data
                </td>
              </tr>
            ) : (
              options.rows.map((row, index) => (
                <tr
                  key={index}
                  hover
                  onClick={() => options.onRowClick?.(row)}
                  style={{ cursor: options.onRowClick ? "pointer" : "default" }}
                >
                  {displayedColumns.map((col) => (
                    <td key={col.name} style={{ width: col.width, padding: 10, borderBottom: "1px solid #f0f0f1" }}>
                      <DataGridCellOutlet column={col} row={row} />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <DataGridPagination
        page={options.page || 0}
        pageSize={options.pageSize || 10}
        total={options.total}
        onPaginationChange={(event) =>
          options.onPaginationChange?.({
            page: event.page,
            pageSize: event.pageSize,
          })
        }
      />
    </div>
  );
}
