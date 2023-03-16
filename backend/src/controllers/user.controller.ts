import { AuthValidator } from '../validators/auth-validator';
import { UpdateUserValidator } from '../validators/update-user.validator';
import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/update')
  updateUser(@Body() user: UpdateUserValidator) {
    return this.userService.updateUser(user);
  }

  @Post('/auth')
  validateUser(@Body() auth: AuthValidator) {
    return this.userService.validateUser(auth);
  }

  @Get('/:address')
  getUser(@Param('address') address: string) {
    return this.userService.getUser(address);
  }
}
