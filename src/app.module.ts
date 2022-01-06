import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { DatabaseModule } from './database/database.module';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [RestaurantsModule, DatabaseModule, GraphQLModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
