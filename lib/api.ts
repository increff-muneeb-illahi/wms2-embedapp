import { Audit } from "@/types/audit";
import { API_BASE_URL } from "./config";

export interface FetchAuditsParams {
  tenant: string;
  table: string;
  primaryObjectId?: string;
  primaryObjectType?: string;
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
  
  // Extract auth params from URL query string (if present)
  let authParams = {
    authUsername: "",
    authPassword: "",
    authDomainName: "",
  };

  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    authParams = {
      authUsername: urlParams.get('authUsername') || "",
      authPassword: urlParams.get('authPassword') || "",
      authDomainName: urlParams.get('authDomainName') || "",
    };
  }

  // Add all params to query string (auth params are filtered out - they go in headers)
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
      "authUsername": authParams.authUsername,
      "authPassword": authParams.authPassword,
      "authDomainName": authParams.authDomainName,
      "accept": "*/*",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch audits: ${response.statusText}`);
  }

  return response.json();
}
