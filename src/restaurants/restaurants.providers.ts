import { Connection } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';

export const restaurantsProviders = [
  {
    provide: 'RESTAURANTS_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(Restaurant),
    inject: ['DATABASE_CONNECTION'],
  },
];
