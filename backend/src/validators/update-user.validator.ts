import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserValidator {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  profile_image: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  custom_url: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  bio: string;

  @IsOptional()
  @IsString()
  facebook: string;

  @IsOptional()
  @IsString()
  twitter: string;

  @IsOptional()
  @IsString()
  discord: string;
}
