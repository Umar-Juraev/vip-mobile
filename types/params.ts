export interface TrackingSearchParam {
  s: {
    trackingNumber?: {
      $cont: string;
    };
    startDate?: string;
    endDate?: string;
    boxNo?: string;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}
