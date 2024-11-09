import { IsEmail, IsString, isString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
