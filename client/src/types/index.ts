export interface MessageLog {
  phoneNumber: string;
  status: string;
  reason?: string;
  error: string;
  createdAt: string;
}

export interface Stats {
  total?: number;
  success: number;
  failed: number;
  skipped: number;
  retry: number;
  pending: number;
}
export interface SheetData {
  id: string;
  name: string;
  dateUploaded: string;
  rowCount: number;
  data: Record<string, unknown>[];
}

export interface Template {
  id: string;
  name: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  phoneNumber: string;
  status: "active" | "inactive";
  lastActive: string;
  deviceName: string;
}
