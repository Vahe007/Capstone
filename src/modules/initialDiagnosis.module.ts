import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InitialDiagnosisController } from 'src/controllers/initialDiagnosis.controller';
import { InitialDiagnosisService } from 'src/services/initialDiagnosis.service';

@Module({
  imports: [ConfigService],
  exports: [InitialDiagnosisService],
  controllers: [InitialDiagnosisController],
  providers: [InitialDiagnosisService],
})
export class InitialDiagnosisModule {}
