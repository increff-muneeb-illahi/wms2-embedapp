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
        second: "2-digit",
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
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Timestamp</TableHead>
            <TableHead>Actor</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Event Type</TableHead>
            <TableHead>Object Type</TableHead>
            <TableHead>Object ID</TableHead>
            <TableHead className="min-w-[200px]">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audits.map((audit, index) => (
            <TableRow key={index}>
              <TableCell className="font-mono text-sm">
                {formatTimestamp(audit.timestamp)}
              </TableCell>
              <TableCell>{audit.actor || "-"}</TableCell>
              <TableCell>{audit.action || "-"}</TableCell>
              <TableCell className="font-medium">{audit.eventType || "-"}</TableCell>
              <TableCell>{audit.objectType || "-"}</TableCell>
              <TableCell className="font-mono text-sm">{audit.objectId || "-"}</TableCell>
              <TableCell>{audit.description || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

