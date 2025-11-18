// Mock Wix Data types for development
export interface WixDataItem {
  _id?: string;
  [key: string]: any;
}

export interface WixDataResult<T = WixDataItem> {
  items: T[];
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export type WixDataQueryResult<T = WixDataItem> = WixDataResult<T>;