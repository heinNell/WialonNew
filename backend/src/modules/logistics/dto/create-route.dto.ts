import {
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateRouteDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  vehicleId?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  startLatitude?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  startLongitude?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  startAddress?: string;

  @ApiProperty({ required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  scheduledStartTime?: Date;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsOptional()
  taskIds?: string[];
}
