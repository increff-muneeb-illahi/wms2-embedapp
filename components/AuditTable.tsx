"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Audit } from "@/types/audit";

interface AuditTableProps {
  audits: Audit[];
}

export function AuditTable({ audits }: AuditTableProps) {
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timestamp;
    }
  };

  if (audits.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        No audit records found
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[80px]">Event ID</TableHead>
            <TableHead className="min-w-[180px]">Event Time</TableHead>
            <TableHead className="min-w-[300px]">Description</TableHead>
            <TableHead className="min-w-[150px]">User</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audits.map((audit, index) => (
            <TableRow key={index}>
              <TableCell className="font-mono text-sm">{audit.id || "-"}</TableCell>
              <TableCell className="font-mono text-sm whitespace-nowrap">
                {formatTimestamp(audit.timestamp)}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-2">
                  <div className="text-sm">{audit.description || "-"}</div>
                  {audit.action && (
                    <div className="text-sm text-muted-foreground">{audit.action}</div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {audit.objectType && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                        {audit.objectType}
                      </span>
                    )}
                    {audit.eventType && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                        {audit.eventType}
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">{audit.actor || "-"}</span>
                  {audit.actorEmail && (
                    <span className="text-xs text-muted-foreground">{audit.actorEmail}</span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

