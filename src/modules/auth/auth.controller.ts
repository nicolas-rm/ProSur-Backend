import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // Endpoint para el login, protegido con el guardia LocalAuthGuard.
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req): Promise<{ access_token: string }> {
        return this.authService.login(req.user);
    }

    // Endpoint para el registro de usuarios.
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    // Endpoint para obtener el perfil del usuario, protegido con el guardia JwtAuthGuard.
    @UseGuards(JwtAuthGuard)
    @Post('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
