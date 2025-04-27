import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiagnosisRequest, DiagnosisRequestSchema } from './schemas/diagnosis-request.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
        // Add other mongoose options if needed
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    // Define and export Mongoose models used in the application
    MongooseModule.forFeature([
        { name: DiagnosisRequest.name, schema: DiagnosisRequestSchema }
        // Add other schemas here
    ]),
  ],
  // Export MongooseModule.forFeature so models can be injected elsewhere
  exports: [MongooseModule.forFeature([
      { name: DiagnosisRequest.name, schema: DiagnosisRequestSchema }
      // Add other schemas here
  ])],
})
export class DatabaseModule {}

