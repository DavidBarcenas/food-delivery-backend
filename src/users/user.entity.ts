import { InternalServerErrorException } from '@nestjs/common';
import { BeforeInsert, Column, Entity } from 'typeorm';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { CoreEntity } from 'src/common/entities/core.entity';

enum UserRole {
  Owner,
  Client,
  Delivery,
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field(type => String)
  @Column()
  email: string;

  @Field(type => String)
  @Column()
  password: string;

  @Field(type => UserRole)
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @BeforeInsert()
  async hashPwd(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
