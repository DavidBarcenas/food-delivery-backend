import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from './user.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class EmailVerification extends CoreEntity {
  @Column()
  @Field(type => String)
  code: string;

  @OneToOne(type => User)
  @JoinColumn()
  user: User;

  @BeforeInsert()
  createCode(): void {
    this.code = uuidv4();
  }
}
