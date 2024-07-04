import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Este guard utiliza la estrategia 'jwt' para autenticar las solicitudes
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
