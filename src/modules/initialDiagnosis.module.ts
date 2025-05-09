import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { InitialDiagnosisController } from 'src/controllers/initialDiagnosis.controller';
import { InitialDiagnosisService } from 'src/services/initialDiagnosis.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const jwtSecret = configService.get('jwt_secret');
        console.log('jwtSecret is', jwtSecret);
        return {
          global: true,
          secret: jwtSecret,
          signOptions: { expiresIn: '30m' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [InitialDiagnosisService],
  controllers: [InitialDiagnosisController],
  providers: [InitialDiagnosisService],
})
export class InitialDiagnosisModule {}
