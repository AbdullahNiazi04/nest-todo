import { Global, Module } from '@nestjs/common';
import { neon } from '@neondatabase/serverless'; // Import 'neon' instead of 'Pool'
import { drizzle } from 'drizzle-orm/neon-http';  // Import 'neon-http'
import * as schema from '../db/schema';
import { ConfigService } from '@nestjs/config';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

const databaseProvider = {
  provide: DATABASE_CONNECTION,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const connectionString = configService.get<string>('DATABASE_URL');
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set.');
    }

    // neon-http approach (better for Vercel/Serverless)
    const client = neon(connectionString);
    return drizzle(client, { schema });
  },
};

@Global()
@Module({
  providers: [databaseProvider],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}