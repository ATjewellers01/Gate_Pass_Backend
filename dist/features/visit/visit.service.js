"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecurityGuardContact = exports.closeGatePass = exports.updateVisitStatus = exports.getVisits = exports.createVisit = void 0;
const db_config_1 = require("../../config/db.config");
const s3_service_1 = require("../../utils/s3.service");
const createVisit = async (data) => {
    let photoUrl = data.visitorPhoto;
    if (photoUrl && !photoUrl.startsWith('http')) {
        try {
            photoUrl = await (0, s3_service_1.uploadBase64ImageToS3)(photoUrl);
        }
        catch (error) {
            console.error('S3 Upload Error:', error);
            // Fallback: leave it as base64 or you can handle the error based on business logic
        }
    }
    return await db_config_1.prisma.visit.create({
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
                if (!data.timeOfEntry)
                    return new Date();
                const d = new Date(data.timeOfEntry);
                if (!isNaN(d.getTime()))
                    return d;
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
exports.createVisit = createVisit;
const getVisits = async (filters) => {
    const whereClause = {};
    if (filters.personToMeet && filters.personToMeet.toLowerCase() !== 'admin') {
        const firstName = filters.personToMeet.split(' ')[0];
        whereClause.personToMeet = {
            contains: firstName,
            mode: 'insensitive'
        };
    }
    if (filters.gatePassClosed !== undefined) {
        whereClause.gatePassClosed = filters.gatePassClosed;
    }
    const visits = await db_config_1.prisma.visit.findMany({
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
exports.getVisits = getVisits;
const updateVisitStatus = async (id, status, approvedBy) => {
    return await db_config_1.prisma.visit.update({
        where: { id },
        data: {
            approvalStatus: status,
            approvedBy,
            approvedAt: new Date(),
        },
    });
};
exports.updateVisitStatus = updateVisitStatus;
const closeGatePass = async (id) => {
    return await db_config_1.prisma.visit.update({
        where: { id },
        data: {
            gatePassClosed: true,
            visitorOutTime: new Date(),
            status: 'OUT',
        },
    });
};
exports.closeGatePass = closeGatePass;
const getSecurityGuardContact = async () => {
    const guard = await db_config_1.prisma.user.findFirst({
        where: { role: 'Guard' }
    });
    return guard?.phone || null;
};
exports.getSecurityGuardContact = getSecurityGuardContact;
