import { BOX_STATUS, PACKING_TYPES } from "@/constants/enums";
import type { Nullable } from "./common";

export interface UserDTO {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

export interface InfoDTO {
  id: number;
  createdAt: string;
  updatedAt: string;
  username: string;
  password: string;
  phoneNumber: string;
  email: string;
  companyId: Nullable<number>;
  role: string;
  isActive: boolean;
  deletedAt: Nullable<string>;
}

export interface TrackingDTO {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: Nullable<string>;
  trackingNumber: string;
  companyId: number;
  clientCode: Nullable<string>;
  weight: number;
  length: Nullable<number>;
  width: Nullable<number>;
  height: Nullable<number>;
  volume: Nullable<number>;
  status: string;
  remark: Nullable<string>;
  packingType: PACKING_TYPES;
  boxId: Nullable<number>;
}

export interface BoxDTO {
  id: number;
  boxNo: string;
  status: BOX_STATUS;
  onceNo: Nullable<string>;
  weight: Nullable<number>;
  waybillCount: Nullable<number>;
  width: Nullable<number>;
  height: Nullable<number>;
  length: Nullable<number>;
  volume: Nullable<number>;
  receivedAt: Nullable<string>; 
  companyId: Nullable<number>;
  createdAt: string; 
  updatedAt: string;
  deletedAt: Nullable<string>;
  isActive: boolean;
  waybills: TrackingDTO[];
}
export interface BoxDetailDTO {
  boxNo: string;
  trackingNumber?: string;
  weight: number;
  waybillCount: number;
  width: number;
  height: number;
  length: number;
  volume: number;
}

export interface OneCDTO {
  Результат: string
  ПричинаОшибки: string,
  ZplFile: string
}

export interface PrinterInfoDTO {
  port: number;
  host: string;
}


export interface ApiSuccessResponse {
  ret: number;
  code: number;
  msg: string;
  time: string;
}

export interface BoxAssignTrackingParams {
  boxId: number;
  trackingNumber: string;
  unassign?: boolean;
}