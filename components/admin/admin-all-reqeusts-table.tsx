import { AdminTableRowProps } from "@/types";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  getRequestRouteFromDetails,
  requestTypeLabel,
} from "@/lib/helpers-function";
import Link from "next/link";
import StatusPill from "../requests/status-pill";
import { Pagination } from "../shared/pagination";

const AdminAllRequestsTable: React.FC<{
  rows: AdminTableRowProps[];
  page: number;
  totalPages: number;
}> = ({ rows, page, totalPages }) => {
  return (
    <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-base">Requests</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="overflow-x-auto border rounded-xl border-white/10">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="text-left text-white/70 hover:bg-white/4">
                <TableCell className="px-4 py-3">Tracking</TableCell>
                <TableCell className="px-4 py-3">User</TableCell>
                <TableCell className="px-4 py-3">Type</TableCell>
                <TableCell className="px-4 py-3">Route / Location</TableCell>
                <TableCell className="px-4 py-3">Status</TableCell>
                <TableCell className="px-4 py-3">Created</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-white/10">
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell className="px-4 py-6 text-white/70">
                    No requests found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => {
                  const route = getRequestRouteFromDetails(
                    row.type,
                    row.details
                  );

                  return (
                    <TableRow
                      key={row.id}
                      className="transition border-t border-white/10 hover:bg-white/3"
                    >
                      <TableCell className="px-4 py-3 font-mono text-xs">
                        <Link
                          href={`/admin/requests/${row.id}`}
                          className="hover:underline text-gold"
                        >
                          {row.trackingCode}
                        </Link>
                      </TableCell>

                      <TableCell className="px-4 py-3">
                        <div className="text-white/90">
                          {row.user?.name || "User"}
                        </div>
                        <div className="text-xs text-white/60">
                          {row.user?.email}
                        </div>
                      </TableCell>

                      <TableCell className="px-4 py-3">
                        {requestTypeLabel(row.type)}
                      </TableCell>

                      <TableCell className="max-w-sm px-4 py-3 text-xs text-white/80">
                        <div className="truncate max-w-65">{route.primary}</div>

                        {route.secondary ? (
                          <div className="mt-1 truncate max-w-65 text-white/60">
                            {route.secondary}
                          </div>
                        ) : null}
                      </TableCell>

                      <TableCell className="px-4 py-3">
                        <StatusPill status={row.status} />
                      </TableCell>

                      <TableCell className="px-4 py-3 text-sm text-white/70">
                        {new Date(row.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination currentPage={page} totalPages={totalPages} />
      </CardContent>
    </Card>
  );
};

export default AdminAllRequestsTable;
