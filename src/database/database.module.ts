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
    let connectionString = configService.get<string>('DATABASE_URL');
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set.');
    }

    // Trim surrounding quotes if present (sometimes copied with quotes)
    connectionString = connectionString.trim();
    if ((connectionString.startsWith("'") && connectionString.endsWith("'")) || (connectionString.startsWith('"') && connectionString.endsWith('"'))) {
      connectionString = connectionString.slice(1, -1);
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