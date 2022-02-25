import {SetMetadata} from '@nestjs/common';
import {UserRole} from 'src/users/entities/user.entity';

type AllowedRoles = keyof typeof UserRole | 'Any';
export const Role = (roles: AllowedRoles[]) => SetMetadata('role', roles);
