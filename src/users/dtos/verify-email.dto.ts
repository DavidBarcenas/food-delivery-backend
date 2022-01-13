import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { EmailVerification } from '../entities/email-verification.entity';

@InputType()
export class VerifyEmailInput extends PickType(EmailVerification, ['code']) {}

@ObjectType()
export class VerifyEmailOutput extends CoreOutput {}
