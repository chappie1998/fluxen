import { CollectionDetail } from 'src/schemas/collectionDetails.schema';

export interface CollectionDetailsDto {
  total_listed: number;
  details: CollectionDetail | null;
  available_attributes: {
    count: number;
    floorPrice: number;
    attribute: Attribute;
  }[];
}

interface Attribute {
  trait_type: string;
  value: string;
}
