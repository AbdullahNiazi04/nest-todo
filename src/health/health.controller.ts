import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from '@neondatabase/serverless';

@Controller('health')
export class HealthController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  async check() {
    const connectionString = this.configService.get<string>('DATABASE_URL');

    if (!connectionString) {
      return { status: 'error', message: 'DATABASE_URL not set' };
    }

    try {
      // Create a short-lived pool to verify connectivity
      const pool: any = new Pool({ connectionString });
      try {
        // Use raw query to avoid depending on schema
        const result = await pool.query('SELECT 1');
        await pool.end();
        return { status: 'ok', db: Array.isArray(result) ? 'connected' : 'connected' };
      } catch (err: any) {
        try {
          await pool.end();
        } catch (e) {
          // ignore
        }
        return { status: 'error', message: err?.message || 'DB query failed' };
      }
    } catch (err: any) {
      return { status: 'error', message: err?.message || 'DB connection failed' };
    }
  }
}
