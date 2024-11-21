import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CreateUserBehaviorDto } from '../dto/create-userbehavior.dto';
import { UpdateUserBehaviorDto } from '../dto/update-userbehavior.dto';
import { UserBehaviorService } from '../service/userbehavior.service';

@Controller('user-behavior')
export class UserBehaviorController {
  constructor(private readonly userBehaviorService: UserBehaviorService) {}

  @Post('/create-userbehavior')
  async create(@Body() createUserBehaviorDto: CreateUserBehaviorDto) {
    return await this.userBehaviorService.create(createUserBehaviorDto);
  }

  @Get('/get-all-userbehaviors')
  async findAll() {
    return await this.userBehaviorService.findAll();
  }

  @Get('/find-userbehavior/:id')
  async findOne(@Param('id') id: number) {
    return await this.userBehaviorService.findOne(id);
  }

  @Patch('/update-userbehavior/:id')
  async update(
    @Param('id') id: number,
    @Body() updateUserBehaviorDto: UpdateUserBehaviorDto,
  ) {
    return await this.userBehaviorService.update(id, updateUserBehaviorDto);
  }

  @Delete('/delete-userbehavior/:id')
  async remove(@Param('id') id: number) {
    return await this.userBehaviorService.remove(id);
  }
}
