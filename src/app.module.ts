import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
      load: [configuration]
    }),

    MongooseModule.forRoot('mongodb+srv://vmanukyan:randompassword777@cluster0.ue0jfgp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),

    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const dbUri = configService.get<string>('database.uri');
        if (!dbUri) {
            throw new Error('Database URI not configured in environment variables.');
        }
        return {
          uri: dbUri,
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
})
export class AppModule {}
