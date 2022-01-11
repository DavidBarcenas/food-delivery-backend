import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
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
}
