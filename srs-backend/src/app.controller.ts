import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Health check used by the Render health check and by uptime monitors.
   * Reports the database state so a broken Atlas connection is visible rather
   * than the service looking healthy while every request 500s.
   * `ready` is 1 when connected, 2 when connecting, 0 when disconnected.
   */
  @Get('health')
  healthCheck() {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    const dbState = this.connection.readyState;

    return {
      status: dbState === 1 ? 'ok' : 'degraded',
      service: 'srs-backend',
      database: states[dbState] ?? 'unknown',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }
}