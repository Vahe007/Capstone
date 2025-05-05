import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users.module';
import { AuthModule } from './modules/auth.module';
import configuration from './config/configuration';
import { EmailModule } from './modules/email.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    EmailModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
      load: [configuration],
    }),

    // MongooseModule.forRoot('mongodb+srv://vmanukyan:randompassword777@cluster0.ue0jfgp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),

    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const dbUri = configService.get<string>('database.uri');
        if (!dbUri) {
          throw new Error(
            'Database URI not configured in environment variables.',
          );
        }
        return {
          uri: dbUri,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
