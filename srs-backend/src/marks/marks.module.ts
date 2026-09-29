import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarksController } from './marks.controller';
import { MarksService } from './marks.service';
import { Mark, MarkModel } from './schemas/mark.schema';
import { MarkSchema, MarkSchemaModel } from './schemas/markschema.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Mark.name, schema: MarkModel },
      { name: MarkSchema.name, schema: MarkSchemaModel },
    ]),
  ],
  controllers: [MarksController],
  providers: [MarksService],
})
export class MarksModule {}
