import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { DatabaseModule } from './database/database.module';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
    }),
    GraphQLModule.forRoot(),
    DatabaseModule,
    RestaurantsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
