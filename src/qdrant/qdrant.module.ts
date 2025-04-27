import { Module } from '@nestjs/common';
import { QdrantController } from './qdrant.controller';
import { QdrantService } from './qdrant.service';

@Module({
  controllers: [QdrantController],
  providers: [QdrantService]
})
export class QdrantModule {}
