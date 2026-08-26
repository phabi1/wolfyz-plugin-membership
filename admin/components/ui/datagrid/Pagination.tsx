import { useMemo } from "react";
import { Button } from "@wordpress/components";

export default function DataGridPagination({
  page,
  pageSize,
  total,
  onPaginationChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPaginationChange: ({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }) => void;
}) {
  const canPrevious = useMemo(() => page > 0, [page]);
  const canNext = useMemo(
    () => (page + 1) * pageSize < total,
    [page, pageSize, total],
  );

  const handlePageChange = (newPage: number) => {
    onPaginationChange({ page: newPage, pageSize });
  };


  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 12, gap: 8 }}>
      <Button disabled={!canPrevious} onClick={() => handlePageChange(page - 1)}>
        Previous
      </Button>
      <Button disabled={!canNext} onClick={() => handlePageChange(page + 1)}>
        Next
      </Button>
    </div>
  );
}
