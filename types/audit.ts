export interface Audit {
  timestamp: string;
  actor: string;
  action: string;
  eventType: string;
  objectType: string;
  objectId: string;
  description: string;
}

