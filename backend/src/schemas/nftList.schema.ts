import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class NftList {
  @Prop()
  token_id: number;

  @Prop()
  nft_contract: string;

  @Prop()
  price: number;

  @Prop()
  token_uri: string;

  @Prop()
  owner_type: number;

  @Prop()
  owner_address: string;

  @Prop()
  block_height: number;

  @Prop()
  block_produced_time: number;

  @Prop()
  status: boolean;

  @Prop()
  name: string;

  @Prop()
  image: string;

  @Prop({ type: Object })
  nft_data: object;
}

export type NftListDocument = NftList & Document;

export const NftListSchema = SchemaFactory.createForClass(NftList);
