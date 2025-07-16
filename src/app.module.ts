// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './module/user/user.module';
import { DoctorModule } from './module/doctor/doctor.module';
import { PatientModule } from './module/patient/patient.module';
import { User } from './module/user/user.entity';
import { Doctor } from './module/doctor/doctor.entity';
import { Patient } from './module/patient/patient.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Doctor, Patient],
        synchronize: false,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    DoctorModule,
    PatientModule,
  ],
})
export class AppModule {}