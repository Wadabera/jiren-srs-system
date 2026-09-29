import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DirectorDocument = Director & Document;

@Schema({ timestamps: true })
export class Director {
  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  photo: string; // base64 string

  @Prop()
  banner: string;
}

export const DirectorSchema = SchemaFactory.createForClass(Director);
