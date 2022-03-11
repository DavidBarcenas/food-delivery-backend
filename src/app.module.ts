import {AuthModule} from './auth/auth.module';
import {CommonModule} from './common/common.module';
import {ConfigModule} from '@nestjs/config';
import {DatabaseModule} from './database/database.module';
import {GraphQLModule} from '@nestjs/graphql';
import {JwtModule} from './jwt/jwt.module';
import {MailModule} from './mail/mail.module';
import {Module} from '@nestjs/common';
import {OrdersModule} from './orders/orders.module';
import {RestaurantsModule} from './restaurants/restaurants.module';
import {UsersModule} from './users/users.module';
import {environments} from './config/environments';
import {schema} from './config/schema-validation';

const TOKEN_KEY = 'Authorization';

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
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: connectionParams => {
            return {token: connectionParams[TOKEN_KEY]};
          },
        },
      },
      context: ({req}) => {
        if (req) {
          return {token: req.headers[TOKEN_KEY.toLowerCase()]};
        }
      },
    }),
    JwtModule.forRoot({secretKey: process.env.SECRET_KEY}),
    DatabaseModule,
    AuthModule,
    MailModule,
    CommonModule,
    UsersModule,
    RestaurantsModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
