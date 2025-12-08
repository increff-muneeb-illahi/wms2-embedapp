'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuditTable } from "@/components/AuditTable";
import { fetchAudits } from "@/lib/api";
import { Audit } from "@/types/audit";

export default function Home() {
  const searchParams = useSearchParams();
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract query parameters
  const tenant = searchParams.get('tenant');
  const table = searchParams.get('table');
  const objectId = searchParams.get('objectId') || undefined;
  const objectType = searchParams.get('objectType') || undefined;
  const actor = searchParams.get('actor') || undefined;
  const eventType = searchParams.get('eventType') || undefined;
  const action = searchParams.get('action') || undefined;
  const timestampFrom = searchParams.get('timestampFrom') || undefined;
  const timestampTo = searchParams.get('timestampTo') || undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
  const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;

  useEffect(() => {
    async function loadAudits() {
      // Validate required params
      if (!tenant || !table) {
        setError('Missing required parameters: tenant and table');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchAudits({
          tenant,
          table,
          objectId,
          objectType,
          actor,
          eventType,
          action,
          timestampFrom,
          timestampTo,
          limit,
          offset,
        });

        setAudits(data);
      } catch (err) {
        console.error("Error fetching audits:", err);
        
        let errorMessage = "An unknown error occurred";
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (err && typeof err === 'object' && 'message' in err) {
          errorMessage = String(err.message);
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    loadAudits();
  }, [tenant, table, objectId, objectType, actor, eventType, action, timestampFrom, timestampTo, limit, offset]);

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
            Example: ?tenant=myorg&table=audits
          </p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading audits...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 max-w-2xl">
          <p className="font-semibold">Error Loading Audits</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  // Show audits
  return (
    <div className="w-full min-h-screen p-4">
      <div className="w-full mx-auto">
        <AuditTable audits={audits} />
      </div>
    </div>
  );
}
