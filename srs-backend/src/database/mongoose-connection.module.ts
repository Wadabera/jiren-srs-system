import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('DatabaseModule');
        const uri = configService.get<string>('MONGODB_URI');

        if (!uri) {
          throw new Error('MONGODB_URI environment variable is not defined');
        }

        return {
          uri,
          retryAttempts: 5,
          retryDelay: 3000,
          maxPoolSize: 50,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          onConnectionCreate: (connection: any) => {
            connection.on('connected', () => logger.log('✅ MongoDB connected'));
            connection.on('disconnected', () => logger.warn('⚠️  MongoDB disconnected'));
            connection.on('error', (err: Error) =>
              logger.error(`MongoDB connection error: ${err.message}`),
            );
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
