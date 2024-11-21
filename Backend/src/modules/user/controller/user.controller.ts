import { UpdateUserDto } from './../dto/update-user.dto';
import { CreateUserDto } from './../dto/create-user.dto';
import { UserService } from './../service/user.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ChangePasswordDto } from '../dto/changepassword-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService
    
  ) {}

  @Post('/create-user')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return { statusCode: HttpStatus.CREATED, message: 'User created successfully', data: user };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.BAD_REQUEST, message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/get-all-users')
  async findAll() {
    try {
      const users = await this.userService.findAll();
      return { statusCode: HttpStatus.OK, data: users };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/get-user/:id')
  async findOne(@Param('id') id: number) {
    try {
      const user = await this.userService.find(Number(id));
      if (!user) {
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: 'User not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { statusCode: HttpStatus.OK, data: user };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('/updater-user/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userService.update(+id, updateUserDto);
      if (!updatedUser) {
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: 'User not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { statusCode: HttpStatus.OK, message: 'User updated successfully', data: updatedUser };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('/change-password/:id') 
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    try {
      const updatedUser = await this.userService.changepassword(+id, changePasswordDto);
      if (!updatedUser) {
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: 'User not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { statusCode: HttpStatus.OK, message: 'Password changed successfully', data: updatedUser };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
