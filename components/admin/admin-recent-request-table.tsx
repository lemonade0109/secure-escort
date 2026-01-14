import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import StatusPill from "../requests/status-pill";
import { requestTypeLabel } from "@/lib/helpers-function";
import { getRecentAdminRequests } from "@/lib/actions/admin/admin-requests";

const AdminRecentRequestsTable: React.FC = async () => {
  const requests = await getRecentAdminRequests();

  return (
    <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
      {/* subtle top glow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" />
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Recent Requests</CardTitle>

        <Button
          asChild
          variant="outline"
          className="text-white border-white/15 bg-white/3 hover:text-white/90 hover:bg-white/6"
        >
          <Link href="/admin/requests">View All</Link>
        </Button>
      </CardHeader>

      <CardContent>
        {requests.length === 0 ? (
          <div className="p-4 border rounded-xl border-white/10 bg-white/3">
            <p className="text-sm text-white/60">No requests yet.</p>
            <p className="mt-1 text-xs text-white">
              Requests will appear here as users create them.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-xl border-white/10">
            <Table className="w-full px-3">
              <TableHeader>
                <TableRow className="transition text-white/60 hover:bg-white/3">
                  <TableCell className="py-3 font-medium text-left">
                    Tracking
                  </TableCell>

                  <TableCell className="py-3 font-medium text-left">
                    Type
                  </TableCell>

                  <TableCell className="py-3 font-medium text-left">
                    Status
                  </TableCell>

                  <TableCell className="py-3 font-medium text-left">
                    Created
                  </TableCell>

                  <TableCell className="py-3 font-medium text-right">
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-white/10">
                {requests.map((request) => (
                  <TableRow
                    key={request.id}
                    className="transition hover:bg-white/3"
                  >
                    <TableCell className="py-3 font-mono text-xs text-gold">
                      {request.trackingCode}
                    </TableCell>

                    <TableCell className="py-3">
                      {requestTypeLabel(request.type)}
                    </TableCell>

                    <TableCell className="py-3">
                      <StatusPill status={request.status} />
                    </TableCell>

                    <TableCell className="py-3">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="py-3 text-right">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="text-white border-white/15 bg-white/3 hover:text-white/90 hover:bg-white/6"
                      >
                        <Link href={`/admin/requests/${request.id}`}>
                          Manage
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminRecentRequestsTable;
