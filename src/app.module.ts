import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';

import {AuthModule} from './auth/auth.module';
import {ConfigModule} from '@nestjs/config';
import {DatabaseModule} from './database/database.module';
import {GraphQLModule} from '@nestjs/graphql';
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
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      context: ({req, connection}) => {
        console.log(connection);
        const TOKEN_KEY = 'authorization';
        return {token: req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY]};
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
export class AppModule {}
