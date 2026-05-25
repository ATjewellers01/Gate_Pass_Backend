import { prisma } from '../../config/db.config';

export const loginUser = async (userId: string, password: string) => {
  // Simulating the exact logic from old loginApi.js
  const user = await prisma.user.findUnique({
    where: { userId },
  });

  if (!user || user.password !== password) {
    return null;
  }

  // Returning only the fields the frontend expects
  return {
    user_name: user.userName,
    userId: user.userId,
    role: user.role,
    page_access: user.pageAccess,
  };
};
