import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';

import {AllowedRoles} from './role.decorator';
import {GqlExecutionContext} from '@nestjs/graphql';
import {JwtService} from 'src/jwt/jwt.service';
import {Reflector} from '@nestjs/core';
import {UsersService} from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<AllowedRoles>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext.token;
    if (token) {
      const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === 'object' && Object.prototype.hasOwnProperty.call(decoded, 'email')) {
        const {user} = await this.usersService.findByEmail(decoded.email);
        if (!user) {
          return false;
        }
        gqlContext['user'] = user;
        if (roles.includes('Any')) {
          return true;
        }
        return roles.includes(user.role);
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
