export enum ModelCategory {
  INFO = "信息类",
  ENTITY = "实体类",
}

export enum EntityStatus {
  DRAFT = "Draft",
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  ARCHIVED = "Archived",
}

export enum AssetStatus {
  AVAILABLE = "Available",
  IN_USE = "In Use",
  MAINTENANCE = "Maintenance",
  SCRAPPED = "Scrapped",
  FAULTY = "Faulty",
}

export interface IoTModel {
  id: string;
  name: string;
  identifier: string;
  category: string;
  status: EntityStatus;
  description: string;
  updatedAt: string;
  isModeled?: boolean;
}

export interface IoTProductSpec {
  id: string;
  modelId: string;
  name: string;
  manufacturer: string;
  modelNumber: string;
  version: string;
  status: EntityStatus;
  description?: string;
  updatedAt: string;
}

export interface IoTInstance {
  id: string;
  assetCode: string;
  specId: string;
  status: AssetStatus;
  location: string;
  owner: string;
  purchaseDate: string;
  lastMaintenance: string;
}

export interface SpatialNode {
  id: string;
  name: string;
  type: "building" | "floor" | "room" | "area";
  parentId: string | null;
  level: number;
}

export interface LifecycleLog {
  id: string;
  instanceId: string;
  action: string;
  operator: string;
  timestamp: string;
  beforeStatus: AssetStatus;
  afterStatus: AssetStatus;
}
