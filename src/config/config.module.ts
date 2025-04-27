import { Module, Global } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';

@Global() // Make ConfigService available globally
@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [configuration],
      isGlobal: true, // Make configuration accessible everywhere
      cache: true, // Improve performance by caching config
      envFilePath: '.env', // Specify your .env file path
    }),
  ],
  providers: [ConfigService], // Export ConfigService for injection
  exports: [ConfigService],
})
export class ConfigAppModule {} // Renamed to avoid conflict with NestJS internal ConfigModule

