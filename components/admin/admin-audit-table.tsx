import { AdminAuditRow } from "@/lib/actions/admin/audit/get-admin-audit-event";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import Link from "next/link";

function fmtTime(d: Date) {
  return new Date(d).toLocaleString();
}

const AdminAuditTable: React.FC<{ rows: AdminAuditRow[] }> = ({ rows }) => {
  if (!rows.length) {
    return (
      <div className="p-4 text-sm border rounded-xl border-white/10 bg-white/3 text-white/70">
        No events found.
      </div>
    );
  }
  return (
    <div className="overflow-hidden border rounded-xl border-white/10 bg-white/3">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-white/70">Time</TableHead>
            <TableHead className="text-white/70">Type</TableHead>
            <TableHead className="text-white/70">Actor</TableHead>
            <TableHead className="text-white/70">Request</TableHead>
            <TableHead className="text-white/70">Message</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="border-white/10 hover:bg-white/5">
              <TableCell className="text-xs text-white/70 whitespace-nowrap">
                {fmtTime(new Date(row.createdAt))}
              </TableCell>

              <TableCell className="text-xs">
                <Badge className="border border-white/10 bg-white/4 text-white/80">
                  {row.type}
                </Badge>
              </TableCell>

              <TableCell className="text-xs text-white/80">
                <div className="font-medium">{row.actorRole ?? "_"}</div>
                <div className="text-white break-all">
                  {row.actorEmail ?? row.actorName ?? "_"}
                </div>
              </TableCell>

              <TableCell className="flex items-center gap-2 text-xs text-white/80">
                <div className="font-mono text-white/90">
                  {row.trackingCode ?? "_"}
                </div>
                <Link
                  href={`/admin/request/${row.requestId}`}
                  className="text-gold hover:underline"
                >
                  Open
                </Link>
              </TableCell>

              <TableCell className="text-xs text-white/70">
                {row.message}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminAuditTable;
