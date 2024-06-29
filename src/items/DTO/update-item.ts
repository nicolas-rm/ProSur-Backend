// src/items/dto/update-item.dto.ts
import { CreateItemDto } from './create-item';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateItemDto extends PartialType(CreateItemDto) {}
