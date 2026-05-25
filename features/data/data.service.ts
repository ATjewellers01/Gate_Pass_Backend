import { prisma } from '../../config/db.config';

export const getPersonsToMeet = async () => {
  const dataRecords = await (prisma as any).data.findMany({
    select: {
      id: true,
      personName: true,
      phoneNumber: true,
      designation: true,
      status: true,
    }
  });

  return dataRecords.map((record: any) => ({
    id: record.id,
    person_to_meet: record.personName,
    phone: record.phoneNumber || 'N/A',
    designation: record.designation || '',
    status: record.status || 'active'
  }));
};

export const createPerson = async (data: any) => {
  const record = await (prisma as any).data.create({
    data: {
      personName: data.personToMeet,
      phoneNumber: data.phone || '',
      designation: data.designation || null,
      status: data.status || 'active'
    }
  });
  return {
    id: record.id,
    person_to_meet: record.personName,
    phone: record.phoneNumber || 'N/A',
    designation: record.designation || '',
    status: record.status || 'active'
  };
};

export const updatePerson = async (id: number, data: any) => {
  const updateData: any = {};
  if (data.personToMeet !== undefined) updateData.personName = data.personToMeet;
  if (data.phone !== undefined) updateData.phoneNumber = data.phone;
  if (data.designation !== undefined) updateData.designation = data.designation || null;
  if (data.status !== undefined) updateData.status = data.status;

  const record = await (prisma as any).data.update({
    where: { id },
    data: updateData
  });
  return {
    id: record.id,
    person_to_meet: record.personName,
    phone: record.phoneNumber || 'N/A',
    designation: record.designation || '',
    status: record.status || 'active'
  };
};

export const deletePerson = async (id: number) => {
  await (prisma as any).data.delete({
    where: { id }
  });
  return true;
};
