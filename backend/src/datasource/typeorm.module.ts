import { Global, Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: DataSource,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        try {
          const dataSource = new DataSource({
            type: 'postgres',
            host: configService.get('PGHOST'),
            port: parseInt(configService.get('PGPORT') ?? '5432'),
            username: configService.get('PGUSER'),
            password: configService.get('PGPASSWORD'),
            database: configService.get('PGDATABASE'),
            synchronize: true, // disable in prod
            ssl: {
              rejectUnauthorized: false,
            },
            entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
          });

          await dataSource.initialize();
          console.log('✅ Database connected successfully');
          return dataSource;
        } catch (err) {
          console.error('❌ Error connecting to DB:', err);
          throw err;
        }
      },
    },
  ],
  exports: [DataSource],
})
export class TypeOrmModule {}
