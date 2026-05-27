import { prisma } from '../../config/db.config';

export const getAllSystemUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      userName: true,
      phone: true,
      role: true,
      pageAccess: true,
      createdAt: true
    }
  });
};

export const createSystemUser = async (data: any) => {
  return await prisma.user.create({
    data: {
      userName: data.userName,
      password: data.password,
      phone: data.phone,
      role: data.role || 'Staff',
      pageAccess: data.pageAccess || ''
    }
  });
};

export const updateSystemUser = async (id: number, data: any) => {
  const updateData: any = {};
  if (data.userName !== undefined) updateData.userName = data.userName;
  if (data.password !== undefined) updateData.password = data.password;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.pageAccess !== undefined) updateData.pageAccess = data.pageAccess;

  return await prisma.user.update({
    where: { id },
    data: updateData
  });
};

export const deleteSystemUser = async (id: number) => {
  return await prisma.user.delete({
    where: { id }
  });
};
