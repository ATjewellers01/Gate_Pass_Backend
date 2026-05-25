import { prisma } from '../../config/db.config';
import { uploadBase64ImageToS3 } from '../../utils/s3.service';

export interface CreateVisitPayload {
  visitorName: string;
  mobileNumber: string;
  email?: string;
  visitorAddress?: string;
  purposeOfVisit: string;
  personToMeet: string;
  personToMeetContact?: string;
  visitorPhoto?: string | null;
  timeOfEntry?: string;
}

export const createVisit = async (data: CreateVisitPayload) => {
  let photoUrl = data.visitorPhoto;

  if (photoUrl && !photoUrl.startsWith('http')) {
    try {
      photoUrl = await uploadBase64ImageToS3(photoUrl);
    } catch (error) {
      console.error('S3 Upload Error:', error);
      // Fallback: leave it as base64 or you can handle the error based on business logic
    }
  }

  return await prisma.visit.create({
    data: {
      visitorName: data.visitorName,
      mobileNumber: data.mobileNumber,
      email: data.email,
      visitorAddress: data.visitorAddress,
      purposeOfVisit: data.purposeOfVisit,
      personToMeet: data.personToMeet,
      personToMeetContact: data.personToMeetContact,
      visitorPhoto: photoUrl,
      timeOfEntry: (() => {
        if (!data.timeOfEntry) return new Date();
        const d = new Date(data.timeOfEntry);
        if (!isNaN(d.getTime())) return d;
        if (/^\d{2}:\d{2}$/.test(data.timeOfEntry)) {
          const [hours, minutes] = data.timeOfEntry.split(':').map(Number);
          const now = new Date();
          now.setHours(hours, minutes, 0, 0);
          return now;
        }
        return new Date();
      })(),
      status: 'IN',
      approvalStatus: 'pending',
      gatePassClosed: false,
    },
  });
};
export const getVisits = async (filters: { personToMeet?: string; gatePassClosed?: boolean }) => {
  const whereClause: any = {};
  
  if (filters.personToMeet && filters.personToMeet.toLowerCase() !== 'admin') {
    whereClause.personToMeet = {
      equals: filters.personToMeet,
      mode: 'insensitive'
    };
  }

  if (filters.gatePassClosed !== undefined) {
    whereClause.gatePassClosed = filters.gatePassClosed;
  }

  const visits = await prisma.visit.findMany({
    where: whereClause,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return visits.map(visit => ({
    id: visit.id,
    serial_no: visit.serialNo || `SN-${visit.id.toString().padStart(3, '0')}`,
    visitor_name: visit.visitorName,
    mobile_number: visit.mobileNumber,
    email: visit.email,
    visitor_address: visit.visitorAddress,
    purpose_of_visit: visit.purposeOfVisit,
    person_to_meet: visit.personToMeet,
    person_to_meet_contact: visit.personToMeetContact,
    visitor_photo: visit.visitorPhoto,
    time_of_entry: visit.timeOfEntry,
    visitor_out_time: visit.visitorOutTime,
    approval_status: visit.approvalStatus,
    approved_by: visit.approvedBy,
    approved_at: visit.approvedAt,
    status: visit.status,
    gate_pass_closed: visit.gatePassClosed,
    created_at: visit.createdAt,
    timestamp: visit.createdAt // Important for sorting in AllData.jsx
  }));
};

export const updateVisitStatus = async (id: number, status: string, approvedBy: string) => {
  return await prisma.visit.update({
    where: { id },
    data: {
      approvalStatus: status,
      approvedBy,
      approvedAt: new Date(),
    },
  });
};

export const closeGatePass = async (id: number) => {
  return await prisma.visit.update({
    where: { id },
    data: {
      gatePassClosed: true,
      visitorOutTime: new Date(),
      status: 'OUT',
    },
  });
};

export const getSecurityGuardContact = async () => {
  const guard = await prisma.user.findFirst({
    where: { role: 'Guard' }
  });
  return guard?.phone || null;
};
