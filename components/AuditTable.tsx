"use client";

import { useState } from "react";
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
  itemsPerPage?: number;
}

export function AuditTable({ audits, itemsPerPage = 20 }: AuditTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
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

  // Calculate pagination
  const totalItems = audits.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAudits = audits.slice(startIndex, endIndex);

  // Reset to page 1 if current page is out of bounds
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  if (audits.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        No audit records found
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[180px]">Event Time</TableHead>
              <TableHead className="min-w-[300px]">Description</TableHead>
              <TableHead className="min-w-[150px]">User</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentAudits.map((audit, index) => (
              <TableRow key={startIndex + index}>
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

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} items
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1 || totalPages === 0}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 px-2">
            Page {currentPage} of {Math.max(totalPages, 1)}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

