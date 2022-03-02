import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';

import {AuthModule} from './auth/auth.module';
import {ConfigModule} from '@nestjs/config';
import {DatabaseModule} from './database/database.module';
import {GraphQLModule} from '@nestjs/graphql';
import {JwtMiddleware} from './jwt/jwt.middleware';
import {JwtModule} from './jwt/jwt.module';
import {MailModule} from './mail/mail.module';
import {OrdersModule} from './orders/orders.module';
import {RestaurantsModule} from './restaurants/restaurants.module';
import {UsersModule} from './users/users.module';
import {environments} from './config/environments';
import {schema} from './config/schema-validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: environments[process.env.NODE_ENV] || '.env.dev',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: schema,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({req}) => {
        return {user: req['user']};
      },
    }),
    JwtModule.forRoot({secretKey: process.env.SECRET_KEY}),
    DatabaseModule,
    AuthModule,
    MailModule,
    UsersModule,
    RestaurantsModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/graphql',
      method: RequestMethod.POST,
    });
  }
}
