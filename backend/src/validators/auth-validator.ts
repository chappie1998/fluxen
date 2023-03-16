import { IsNotEmpty, IsString } from 'class-validator';

export class AuthValidator {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  signature: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
