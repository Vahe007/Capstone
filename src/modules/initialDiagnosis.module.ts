import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InitialDiagnosisController } from 'src/controllers/initialDiagnosis.controller';
import { InitialDiagnosisService } from 'src/services/initialDiagnosis.service';

@Module({
  imports: [ConfigModule, HttpModule],
  exports: [InitialDiagnosisService],
  controllers: [InitialDiagnosisController],
  providers: [InitialDiagnosisService],
})
export class InitialDiagnosisModule {}
