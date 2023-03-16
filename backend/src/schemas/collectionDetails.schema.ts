import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class CollectionDetail {
  @Prop()
  nft_contract: string;

  @Prop()
  name: string;

  @Prop()
  discription: string;

  @Prop()
  image: string;

  @Prop()
  twitter: string;

  @Prop()
  discord: string;

  @Prop()
  telegram: string;

  @Prop()
  website: string;

  @Prop()
  total_volume: number;
}

export type CollectionDetailDocument = CollectionDetail & Document;

export const CollectionDetailSchema =
  SchemaFactory.createForClass(CollectionDetail);
