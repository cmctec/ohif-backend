import {
  organizations,
  organization_user,
  role_user,
  users,
} from 'generated/prisma';

export type userPrismaType = users & {
  organization_user: (organization_user & {
    organizations: organizations;
  })[];
  role_user: role_user[];
};
