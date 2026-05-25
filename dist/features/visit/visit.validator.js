"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeGatePassSchema = exports.updateVisitSchema = exports.createVisitSchema = void 0;
const zod_1 = require("zod");
exports.createVisitSchema = zod_1.z.object({
    body: zod_1.z.object({
        visitorName: zod_1.z.string().min(1, 'Visitor name is required'),
        mobileNumber: zod_1.z.string().min(10, 'Valid mobile number is required'),
        email: zod_1.z.string().email().optional().or(zod_1.z.literal('')),
        visitorAddress: zod_1.z.string().optional(),
        purposeOfVisit: zod_1.z.string().min(1, 'Purpose of visit is required'),
        personToMeet: zod_1.z.string().min(1, 'Person to meet is required'),
        personToMeetContact: zod_1.z.string().optional(),
        visitorPhoto: zod_1.z.string().optional().nullable(),
        timeOfEntry: zod_1.z.string().optional(),
    }),
});
exports.updateVisitSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['approved', 'rejected']),
        approvedBy: zod_1.z.string().min(1, 'Approver name is required'),
    }),
});
exports.closeGatePassSchema = zod_1.z.object({
    body: zod_1.z.object({
    // Only requiring a POST to close it, can include optional fields if needed
    }),
});
