import { SortOrder } from 'mongoose';

export interface NftListDto {
  id: string;
  sort?: SortOrder;
  page?: number;
  limit?: number;
  status?: boolean;
  min_price?: number;
  max_price?: number;
  attributes?: object[];
}
