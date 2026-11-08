import {
  Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { CurrentUser } from '../common/current-user.decorator';
import { imagePipe } from '../common/image.pipe';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('me')
  me(@CurrentUser() u: { id: string }) { return this.users.me(u.id); }

  @Patch('me/image')
  @UseInterceptors(FileInterceptor('image'))
  updateImage(@CurrentUser() u: { id: string }, @UploadedFile(imagePipe(true)) file: Express.Multer.File) {
    return this.users.updateImage(u.id, file);
  }

  @Get() @Roles(Role.ADMIN)
  findAll() { return this.users.findAll(); }

  @Patch(':id/role') @Roles(Role.ADMIN)
  updateRole(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRoleDto, @CurrentUser() u: { id: string }) {
    return this.users.updateRole(id, dto.role, u.id);
  }

  @Delete(':id') @Roles(Role.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() u: { id: string }) {
    return this.users.remove(id, u.id);
  }
}
