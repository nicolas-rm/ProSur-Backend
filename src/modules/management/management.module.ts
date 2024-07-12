import { Module } from '@nestjs/common';
import { ManagementService } from './management.service';
import { ManagementController } from './management.controller';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [ManagementController],
    providers: [ManagementService],
})
export class ManagementModule {}
