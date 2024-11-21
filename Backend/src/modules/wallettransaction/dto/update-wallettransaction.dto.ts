import { PartialType } from '@nestjs/mapped-types';
import { CreateWallettransactionDto } from './create-wallettransaction.dto';

export class UpdateWallettransactionDto extends PartialType(CreateWallettransactionDto) {}
