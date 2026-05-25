import { prisma } from '../../config/db.config';

export const getPersonsToMeet = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      userName: true,
      phone: true,
    }
  });

  return users.map(user => ({
    id: user.id,
    person_to_meet: user.userName,
    phone: user.phone || 'N/A',
    status: 'Available'
  }));
};

export const createPerson = async (data: any) => {
  // Use a generated userId for the new person, or map it.
  const userIdStr = data.personToMeet.toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(Math.random() * 1000);
  const user = await prisma.user.create({
    data: {
      userName: data.personToMeet,
      userId: userIdStr,
      password: data.password || "password123", // default password
      phone: data.phone || "",
      role: "Staff",
      pageAccess: "ApprovelPage"
    }
  });
  return {
    id: user.id,
    person_to_meet: user.userName,
    phone: user.phone || 'N/A',
    status: 'Available'
  };
};

export const updatePerson = async (id: number, data: any) => {
  const updateData: any = {};
  if (data.personToMeet) updateData.userName = data.personToMeet;
  if (data.phone) updateData.phone = data.phone;
  if (data.password) updateData.password = data.password;

  const user = await prisma.user.update({
    where: { id },
    data: updateData
  });
  return {
    id: user.id,
    person_to_meet: user.userName,
    phone: user.phone || 'N/A',
    status: 'Available'
  };
};

export const deletePerson = async (id: number) => {
  await prisma.user.delete({
    where: { id }
  });
  return true;
};
