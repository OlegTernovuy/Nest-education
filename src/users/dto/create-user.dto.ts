import { IsEmail, IsNumber, IsString, Length, Max, Min } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Incorrect email address' })
  email: string;

  @Length(4, 12, {
    message: 'password must contain from 5 to 12 characters',
  })
  password: string;

  @IsString({ message: 'username must be a string' })
  @Length(3, 15, { message: 'username must contain from 3 to 15 characters' })
  username: string;

  @IsNumber()
  @Min(16)
  @Max(45)
  age: number;
}
