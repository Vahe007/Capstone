import { Module } from '@nestjs/common';
import { ConfigAppModule } from './config/config.module'
// import { DatabaseModule } from './database/database.module';
// import { DiagnosisModule } from './diagnosis/diagnosis.module';
// import { QdrantModule } from './qdrant/qdrant.module';
// import { OpenAIModule } from './openai/openai.module';
// import { MLModelModule } from './ml_model/ml_model.module';
import { QdrantModule } from './qdrant/qdrant.module';

@Module({
  imports: [
    ConfigAppModule,
    DatabaseModule,
    DiagnosisModule,
    QdrantModule,
    OpenAIModule,
    MLModelModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

