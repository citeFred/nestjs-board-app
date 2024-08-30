import { IsEmail, IsNotEmpty, Matches, MaxLength } from "class-validator";

export class LoginUserDto {
    @IsNotEmpty()
    @MaxLength(20)
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: 'Password too weak', }) // 대문자, 소문자, 숫자, 특수문자 포함
    password: string;

    @IsNotEmpty()
    @IsEmail() // 이메일 형식
    @MaxLength(100)
    email: string;
}