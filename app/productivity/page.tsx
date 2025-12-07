'use client';

import { useSearchParams } from "next/navigation";
import { ProductivityChart } from "@/components/ProductivityChart";

export default function ProductivityPage() {
  const searchParams = useSearchParams();

  // Extract query parameters
  const tenant = searchParams.get('tenant');
  const table = searchParams.get('table');
  const actor = searchParams.get('actor') || undefined;

  // Show error for missing params
  if (!tenant || !table) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          <p className="font-semibold">Missing Required Parameters</p>
          <p className="text-sm mt-1">
            Please provide both &apos;tenant&apos; and &apos;table&apos; query parameters.
          </p>
          <p className="text-xs mt-2 text-red-600">
            Example: ?tenant=myorg&table=audits&actor=username
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProductivityChart tenant={tenant} table={table} actor={actor} />
  );
}

