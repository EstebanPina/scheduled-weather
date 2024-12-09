import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';
import { PrismaService } from 'src/prisma/prisma.service';

type VenueLocation = {
  lat: string;
  lon: string;
};
@Injectable()
export class WeatherService {
  constructor(private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  @Cron('* */2 * * *')
  async handleCron() {
    const result = await this.prisma.$queryRaw<VenueLocation[]>`
        SELECT lat, lon
        FROM public."Venue"
        GROUP BY lat, lon
    `;
    
    result.map((location) => {
        this.updateWeather(location);
        console.log('Weather updated for location:', location);
    });

    
  }
  async updateWeather(location: VenueLocation) {
    const API_KEY = this.configService.get<string>('WEATHER_API_KEY');
    const url=`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`;
    this.httpService
      .get(url)
      .pipe(map((response: AxiosResponse) => response.data))
      .subscribe(
          async (data) => {
              await this.prisma.venue.updateMany({
                  where: { lat:location.lat, lon: location.lon } ,
                  data: {
                      weather: data.weather[0].description,
                      temperature: data.main.temp,
                      wind_speed: data.wind.speed,
              }})
          },
          (error) => {
              console.error('Error fetching weather data:', error);
          }
      );
  }
}
