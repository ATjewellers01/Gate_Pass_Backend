import { z } from 'zod';

export const createVisitSchema = z.object({
  body: z.object({
    visitorName: z.string().min(1, 'Visitor name is required'),
    mobileNumber: z.string().min(10, 'Valid mobile number is required'),
    email: z.string().email().optional().or(z.literal('')),
    visitorAddress: z.string().optional(),
    purposeOfVisit: z.string().min(1, 'Purpose of visit is required'),
    personToMeet: z.string().min(1, 'Person to meet is required'),
    personToMeetContact: z.string().optional(),
    visitorPhoto: z.string().optional().nullable(),
    timeOfEntry: z.string().optional(),
  }),
});
export const updateVisitSchema = z.object({
  body: z.object({
    status: z.enum(['approved', 'rejected']),
    approvedBy: z.string().min(1, 'Approver name is required'),
  }),
});

export const closeGatePassSchema = z.object({
  body: z.object({
    // Only requiring a POST to close it, can include optional fields if needed
  }),
});
