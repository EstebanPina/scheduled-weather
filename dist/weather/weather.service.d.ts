import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
type VenueLocation = {
    lat: string;
    lon: string;
};
export declare class WeatherService {
    private readonly httpService;
    private readonly prisma;
    private readonly configService;
    constructor(httpService: HttpService, prisma: PrismaService, configService: ConfigService);
    handleCron(): Promise<void>;
    updateWeather(location: VenueLocation): Promise<void>;
}
export {};
