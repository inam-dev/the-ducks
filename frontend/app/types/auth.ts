export type DbsAccessLevel = 1 | 2 | 3 | 4;

export type DbsLevel =
  | "Basic"
  | "Standard"
  | "Enhanced"
  | "Enhanced with Barred List";

export type User = {
  id: string;
  name: string;
  role: string;
  department: string;
  accessLevel: DbsAccessLevel;
  dbsLevel: DbsLevel;
  accessLabel: string;
  canViewOriginalSensitiveData: boolean;
  canViewSafeguardingDocuments: boolean;
  canViewChildOrVulnerableInfo: boolean;
  canExportDocuments: boolean;
  canExportOnlyRedacted: boolean;
  canViewAuditLogs: boolean;
  canAccessAllDepartments: boolean;
};
