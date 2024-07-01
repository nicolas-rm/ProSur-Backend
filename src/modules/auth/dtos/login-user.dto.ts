import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Email debe ser un email válido' })
    @IsNotEmpty({ message: 'Email es requerido' })
    email: string;

    @IsString({})
    @IsNotEmpty({ message: 'Password es requerida' })
    @MinLength(6, { message: 'Password debe tener al menos 6 caracteres' })
    password: string;
}
