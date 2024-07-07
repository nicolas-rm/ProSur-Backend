import { Controller, Request, Post, UseGuards, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from 'src/shared/models/index.models';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // EndPoint para el login, protegido con el guardia LocalAuthGuard.
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        console.log('\nIniciando Sesesion');
        return this.authService.login(req.user);
    }

    // EndPoint para el registro de usuarios.
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto): Promise<User> {
        // Verificar que el usuario no exista en la base de datos
        const user = await this.authService.findOne(createUserDto.email);

        // Si el usuario existe retornar un mensaje de error
        if (user) throw new BadRequestException('Usuario ya existe.');

        return this.authService.register(createUserDto);
    }

    // EndPoint para obtener el perfil del usuario, protegido con el guardia JwtAuthGuard.
    @UseGuards(JwtAuthGuard)
    @Post('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
