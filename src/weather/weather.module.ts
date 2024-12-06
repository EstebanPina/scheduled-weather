import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { Prisma } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [WeatherService],
  imports: [ScheduleModule.forRoot(),HttpModule,PrismaModule],
})
export class WeatherModule {}
