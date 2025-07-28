// api/services.ts
import { AxiosResponse } from "axios";
import type { PaginatedResponse } from "../types/common";
import type {
  AuthResponse,
  BoxAssignTrackingParams,
  BoxDetailDTO,
  BoxDTO,
  InfoDTO,
  OneCDTO,
  TrackingDTO,
  UserDTO,
} from "../types/data";
import type { PaginationParams, TrackingSearchParam } from "../types/params";
import api from "./client";

// Auth service matching your API
export const authService = {
  login: (credentials: UserDTO): Promise<AxiosResponse<AuthResponse>> =>
    api.post("/auth/login", credentials),
  register: (userData: Partial<InfoDTO>): Promise<AxiosResponse<InfoDTO>> =>
    api.post("/auth/register", userData),
  logout: (): Promise<AxiosResponse<void>> => api.post("/auth/logout"),
  refreshToken: (): Promise<AxiosResponse<AuthResponse>> =>
    api.post("/auth/refresh"),
};

// Info service for user data
export const infoService = {
  getLocalUserInfo: (): Promise<AxiosResponse<InfoDTO>> =>
    api.get("/auth/info"),
};

// User service
// export const userService = {
//   // GET requests
//   getUsers: (
//     params?: PaginationParams
//   ): Promise<AxiosResponse<PaginatedResponse<InfoDTO[]>>> =>
//     api.get("/users", { params }),
//   getUserById: (id: number): Promise<AxiosResponse<InfoDTO>> =>
//     api.get(`/users/${id}`),

//   // POST requests
//   createUser: (userData: Partial<InfoDTO>): Promise<AxiosResponse<InfoDTO>> =>
//     api.post("/users", userData),

//   // PUT requests
//   updateUser: (
//     id: number,
//     userData: Partial<InfoDTO>
//   ): Promise<AxiosResponse<InfoDTO>> => api.put(`/users/${id}`, userData),

//   // DELETE requests
//   deleteUser: (id: number): Promise<AxiosResponse<void>> =>
//     api.delete(`/users/${id}`),
// };

// Tracking service
export const trackingService = {
  getTrackings: (
    params?: TrackingSearchParam & PaginationParams
  ): Promise<AxiosResponse<PaginatedResponse<TrackingDTO[]>>> =>
    api.get("/trackings", { params }),
  getTrackingById: (id: number): Promise<AxiosResponse<TrackingDTO>> =>
    api.get(`/trackings/${id}`),
  getTrackingByNumber: (
    trackingNumber: string
  ): Promise<AxiosResponse<TrackingDTO>> =>
    api.get(`/trackings/number/${trackingNumber}`),
  createTracking: (
    trackingData: Partial<TrackingDTO>
  ): Promise<AxiosResponse<TrackingDTO>> =>
    api.post("/trackings", trackingData),
  updateTracking: (
    id: number,
    trackingData: Partial<TrackingDTO>
  ): Promise<AxiosResponse<TrackingDTO>> =>
    api.put(`/trackings/${id}`, trackingData),
  deleteTracking: (id: number): Promise<AxiosResponse<void>> =>
    api.delete(`/trackings/${id}`),
};

// Box service
export const boxService = {
  getBoxes: (
    params?: TrackingSearchParam & PaginationParams
  ): Promise<AxiosResponse<PaginatedResponse<BoxDTO[]>>> =>
    api.get("/vip/box", { params }),

  getBoxById: (boxNo: string): Promise<AxiosResponse<BoxDTO>> =>
    api.get(`/vip/box/details/${boxNo}`),

  assignTracking: ({ boxId, trackingNumber, unassign }: BoxAssignTrackingParams): Promise<AxiosResponse<any>> => {
    return api.patch(`/vip/box/${boxId}/assign-tracking`, { trackingNumber, unassign })
  },

  activateBox: (boxId: string): Promise<void> =>
    api.patch(`/vip/box/${boxId}/activate`),

  generateOnce: (data: BoxDetailDTO): Promise<AxiosResponse<OneCDTO>> =>
    api.post(`/vip/box/generate-box/`, data),

  getBoxOrTracking: (boxNo: string): Promise<AxiosResponse<BoxDetailDTO>> =>
    api.get(`/vip/box/details/${boxNo}`),
};
