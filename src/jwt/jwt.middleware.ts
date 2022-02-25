import {Injectable, NestMiddleware} from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';

import {JwtService} from './jwt.service';
import {UsersService} from 'src/users/users.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];

      try {
        const decoded = this.jwtService.verify(token.toString());
        if (typeof decoded === 'object' && Object.prototype.hasOwnProperty.call(decoded, 'email')) {
          const {ok, user} = await this.usersService.findByEmail(decoded.email);
          if (ok) {
            req['user'] = user;
          }
        }
      } catch {
        return false;
      }
    }
    next();
  }
}
