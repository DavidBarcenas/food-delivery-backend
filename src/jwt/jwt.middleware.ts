import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      const decoded = this.jwtService.verify(token.toString());

      // eslint-disable-next-line no-prototype-builtins
      if (typeof decoded === 'object' && decoded.hasOwnProperty('email')) {
        try {
          const user = await this.usersService.findByEmail(decoded.email);
          console.log(user);
        } catch (error) {
          console.log('not found user');
          return false;
        }
      }
    }
    next();
  }
}
