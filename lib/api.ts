import { Audit, ActivityReportItem, ActivityReportParams } from "@/types/audit";
import { API_BASE_URL } from "./config";

export interface FetchAuditsParams {
  tenant: string;
  table: string;
  objectId?: string;
  objectType?: string;
  actor?: string;
  eventType?: string;
  action?: string;
  timestampFrom?: string;
  timestampTo?: string;
  limit?: number;
  offset?: number;
}

/**
 * Fetch audits from the backend
 */
export async function fetchAudits(params: FetchAuditsParams): Promise<Audit[]> {
  const queryParams = new URLSearchParams();

  // Add all params to query string
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  const url = `${API_BASE_URL}/api/audit/list?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "accept": "*/*",
    },
    credentials: "include",
    cache: "no-store",
  });

  console.log(response);

  if (!response.ok) {
    throw new Error(`Failed to fetch audits: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch activity report from the backend
 */
export async function fetchActivityReport(params: ActivityReportParams): Promise<ActivityReportItem[]> {
  const queryParams = new URLSearchParams();

  // Add all params to query string
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  const url = `${API_BASE_URL}/api/audit/productivity-report?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "accept": "*/*",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch activity report: ${response.statusText}`);
  }

  return response.json();
}
