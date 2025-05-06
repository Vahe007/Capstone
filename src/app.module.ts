import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users.module';
import { AuthModule } from './modules/auth.module';
import configuration from './config/configuration';
import { EmailModule } from './modules/email.module';


const uri = 'mongodb+srv://tempUser:CqDfoM8OpkaVOocs@capstonecluster.2inb2s6.mongodb.net/medicalDB?retryWrites=true&w=majority&appName=CapstoneCluster'
@Module({
  imports: [
    // MongooseModule.forRoot(uri),
    // MongooseModule.forRootAsync({
    //   useFactory: async (configService: ConfigService) => {
    //     const dbUri = configService.get<string>('database.uri');
    //     console.log('dbUri is bro', dbUri)
    //     if (!dbUri) {
    //       throw new Error(
    //         'Database URI not configured in environment variables.',
    //       );
    //     }
    //     return {
    //       uri: dbUri,
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
    UsersModule,
    AuthModule,
    EmailModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
      load: [configuration],
    }),

    // MongooseModule.forRoot('mongodb+srv://vmanukyan:randompassword777@cluster0.ue0jfgp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),


  ],
})
export class AppModule {}
