"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const operators_1 = require("rxjs/operators");
const prisma_service_1 = require("../prisma/prisma.service");
let WeatherService = class WeatherService {
    constructor(httpService, prisma, configService) {
        this.httpService = httpService;
        this.prisma = prisma;
        this.configService = configService;
    }
    async handleCron() {
        const result = await this.prisma.$queryRaw `
        SELECT lat, lon
        FROM public."Venue"
        GROUP BY lat, lon
    `;
        result.map((location) => {
            this.updateWeather(location);
        });
    }
    async updateWeather(location) {
        const API_KEY = this.configService.get('WEATHER_API_KEY');
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`;
        this.httpService
            .get(url)
            .pipe((0, operators_1.map)((response) => response.data))
            .subscribe(async (data) => {
            console.log('Weather Data:', data);
            await this.prisma.venue.updateMany({
                where: { lat: location.lat, lon: location.lon },
                data: {
                    weather: data.weather[0].description,
                    temperature: data.main.temp,
                    wind_speed: data.wind.speed,
                }
            });
        }, (error) => {
            console.error('Error fetching weather data:', error.message);
        });
    }
};
exports.WeatherService = WeatherService;
__decorate([
    (0, schedule_1.Cron)('0 */2 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WeatherService.prototype, "handleCron", null);
exports.WeatherService = WeatherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        prisma_service_1.PrismaService,
        config_1.ConfigService])
], WeatherService);
//# sourceMappingURL=weather.service.js.map