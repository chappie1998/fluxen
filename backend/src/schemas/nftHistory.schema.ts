import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class NftHistory {
  @Prop()
  token_id: number;

  @Prop()
  nft_contract: string;

  @Prop()
  price: number;

  @Prop()
  type: number;

  @Prop()
  address: string;

  @Prop()
  block_height: number;

  @Prop()
  transaction_type: string;

  @Prop()
  transaction_id: string;
}

export type NftHistoryDocument = NftHistory & Document;

export const NftHistorySchema = SchemaFactory.createForClass(NftHistory);
