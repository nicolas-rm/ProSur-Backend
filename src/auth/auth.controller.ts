import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // Endpoint para el login, protege con el guardia LocalAuthGuard
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    // Endpoint para el registro de usuarios
    @Post('register')
    async register(@Body() body) {
        return this.authService.register(body);
    }

    // Endpoint para obtener el perfil del usuario, protege con el guardia JwtAuthGuard
    @UseGuards(JwtAuthGuard)
    @Post('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
