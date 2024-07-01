import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail({}, { message: 'Email debe ser un email válido' })
    @IsNotEmpty({ message: 'Email es requerido' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Password es requerida' })
    @MinLength(6, { message: 'Password debe tener al menos 6 caracteres' })
    password: string;

    @IsString({ message: 'Name debe ser un texto' })
    @IsNotEmpty({ message: 'Name es requerido' })
    name: string;

    @IsString({ message: 'LastName debe ser un texto' })
    @IsNotEmpty({ message: 'LastName es requerido' })
    lastName: string;
}
