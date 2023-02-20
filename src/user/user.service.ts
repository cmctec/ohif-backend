import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utilModules/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserData(user_name: string) {
    const data = await this.prismaService.users.findUnique({
      where: { user_name },
      include: {
        organization_user: {
          include: {
            organizations: true,
          },
        },
        role_user: true,
      },
    });
    if (!data) {
      throw new HttpException(
        `user ${user_name} does not exist in table users`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    return data;
  }

  async getUserDataAndCheckOrganizations(user_name: string) {
    const data = await this.prismaService.users.findUnique({
      where: { user_name },
      include: {
        organization_user: {
          include: {
            organizations: true,
          },
        },
        role_user: true,
      },
    });
    if (!data) {
      throw new HttpException(
        `user: '${user_name}' does not exist in table users`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!data.organization_user[0]?.organizations) {
      throw new HttpException(
        `user: '${user_name}' does not exist organizations`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    return data;
  }
}
