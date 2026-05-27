import { prisma } from '../../config/db.config';

export const loginUser = async (phone: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { phone },
  });

  if (!user || user.password !== password) {
    return null;
  }

  // Returning only the fields the frontend expects
  return {
    user_name: user.userName,
    phone: user.phone,
    role: user.role,
    page_access: user.pageAccess,
  };
};
