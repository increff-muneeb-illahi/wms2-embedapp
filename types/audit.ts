export interface Audit {
  timestamp: string;
  actor: string;
  action: string;
  eventType: string;
  objectType: string;
  objectId: string;
  description: string;
  actorEmail: string;
  id: string;
}

export interface ActivityReportItem {
  primaryObjectId?: string;
  primaryObjectType?: string;
  eventType?: string;
  eventCount: number;
  [key: string]: any; // For any additional fields
}

export interface ActivityReportParams {
  tenant: string;
  table: string;
  actor?: string;
  timestampFrom?: string;
  timestampTo?: string;
  limit?: number;
  offset?: number;
}
