import { IsEmail, IsString, MinLength, IsEnum, IsUUID, IsOptional, IsArray } from 'class-validator';
import { UserRole } from '../../common/enums';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString() @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsUUID()
  groupId: string;

  @IsArray() @IsUUID('4', { each: true }) @IsOptional()
  businessUnitIds?: string[];
}
