import { GuardProfileProps } from "@/types";
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
import { Pagination } from "../shared/pagination";

const AdminGuardsTable: React.FC<{
  guards: GuardProfileProps[];
  page: number;
  totalPages: number;
}> = ({ guards, page, totalPages }) => {
  if (!guards.length) {
    return (
      <div className="p-4 border rounded-xl border-white/10 bg-white/3">
        <p className="text-sm text-white/80">No guards found.</p>
        <p className="mt-1 text-xs text-white/60">
          Try changing your filters or create a guard profile.
        </p>
      </div>
    );
  }
  return (
    <>
      <div className="overflow-x-hidden border rounded-xl border-white/10 bg-white/3">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead className="text-white/70">Guard</TableHead>
              <TableHead className="text-white/70">Badge</TableHead>
              <TableHead className="text-white/70">Phone</TableHead>
              <TableHead className="text-white/70">Status</TableHead>
              <TableHead className="text-white/70">Created</TableHead>
              <TableHead className="text-right text-white/70">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {guards.map((guard) => (
              <TableRow
                key={guard.id}
                className="border-white/10 hover:bg-white/5"
              >
                <TableCell>
                  <div className="leading-tight">
                    <div className="font-medium">
                      {guard.user?.name ?? "No name"}
                    </div>
                    <div className="text-xs text-white/60">
                      {guard.user?.email ?? "No email"}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="font-mono text-sm text-white/80">
                  {guard.badgeId ?? "_"}
                </TableCell>

                <TableCell className="text-sm text-white/80">
                  {guard.phone ?? "_"}
                </TableCell>

                <TableCell>
                  {guard.active ? (
                    <Badge className="border border-gold/40 bg-gold/15 text-gold">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="border border-white/15 bg-white/5 text-white/70">
                      Inactive
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="text-xs text-white/60">
                  {new Date(guard.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell className="text-right">
                  <Link
                    href={`/admin/guards/${guard.id}`}
                    className="text-sm text-gold hover:underline"
                  >
                    Manage
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} />
    </>
  );
};
export default AdminGuardsTable;
