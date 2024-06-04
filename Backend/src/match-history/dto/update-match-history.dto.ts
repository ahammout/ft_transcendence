import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchHistoryDto } from './create-match-history.dto';

export class UpdateMatchHistoryDto extends PartialType(CreateMatchHistoryDto) {}
