import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true, index: true, unique: true })
  address: string;

  @Prop()
  profile_image: string;

  @Prop()
  name: string;

  @Prop()
  custom_url: string;

  @Prop()
  email: string;

  @Prop()
  bio: string;

  @Prop()
  facebook: string;

  @Prop()
  twitter: string;

  @Prop()
  discord: string;

  @Prop({ default: true })
  active: boolean;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
