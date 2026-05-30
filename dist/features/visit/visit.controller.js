"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeVisitGatePass = exports.approveVisitStatus = exports.fetchAllVisits = exports.submitVisitRequest = void 0;
const visit_service_1 = require("./visit.service");
const constants_1 = require("../../utils/constants");
const whatsapp_service_1 = require("../../utils/whatsapp.service");
const submitVisitRequest = async (req, res) => {
    try {
        const visit = await (0, visit_service_1.createVisit)(req.body);
        const approvalLink = 'https://gate-pass-frontend-theta.vercel.app/approval-request';
        // Notify the host (person to meet) using 'gate_pass_requests' template
        if (visit.personToMeetContact) {
            const serialNumber = visit.serialNo || `SN-${visit.id.toString().padStart(3, '0')}`;
            const timeStr = visit.timeOfEntry ? new Date(visit.timeOfEntry).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const imageLink = visit.visitorPhoto && visit.visitorPhoto.startsWith('http')
                ? visit.visitorPhoto
                : 'https://img.freepik.com/free-vector/jewelry-logo-design_126523-2892.jpg';
            (0, whatsapp_service_1.sendWhatsAppTemplate)(visit.personToMeetContact, 'gate_pass_requests', [
                {
                    type: 'HEADER',
                    parameters: [
                        {
                            type: 'IMAGE',
                            image: { link: imageLink }
                        }
                    ]
                },
                {
                    type: 'BODY',
                    parameters: [
                        { type: 'TEXT', text: String(serialNumber) },
                        { type: 'TEXT', text: String(visit.visitorName || 'N/A') },
                        { type: 'TEXT', text: String(visit.personToMeet || 'N/A') },
                        { type: 'TEXT', text: String(visit.purposeOfVisit || 'N/A') },
                        { type: 'TEXT', text: timeStr },
                        { type: 'TEXT', text: approvalLink } // Dynamic Approval Link
                    ]
                }
            ]);
        }
        return res.status(201).json({
            success: true,
            message: constants_1.SUCCESS_MESSAGES.VISIT_CREATED,
            data: visit
        });
    }
    catch (error) {
        console.error('Create visit error:', error);
        return res.status(500).json({ error: constants_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};
exports.submitVisitRequest = submitVisitRequest;
const fetchAllVisits = async (req, res) => {
    try {
        const personToMeetParam = req.query.personToMeet;
        const personToMeet = Array.isArray(personToMeetParam)
            ? personToMeetParam[0]
            : personToMeetParam;
        const gatePassClosed = req.query.gatePassClosed !== undefined ? req.query.gatePassClosed === 'true' : undefined;
        const visits = await (0, visit_service_1.getVisits)({ personToMeet, gatePassClosed });
        return res.status(200).json({
            success: true,
            data: visits
        });
    }
    catch (error) {
        console.error('Fetch visits error:', error);
        return res.status(500).json({ error: constants_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};
exports.fetchAllVisits = fetchAllVisits;
const approveVisitStatus = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { status, approvedBy } = req.body;
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid visit ID' });
        }
        const updated = await (0, visit_service_1.updateVisitStatus)(id, status, approvedBy);
        const visitorUpdateLink = process.env.FRONTEND_URL || 'https://gate-pass-frontend-theta.vercel.app';
        const guardCloseGatePassLink = 'https://gate-pass-frontend-theta.vercel.app/close-gate-pass';
        // Notify the visitor about the status update using 'gate_pass_updated' template
        if (updated && updated.mobileNumber) {
            const serialNumber = updated.serialNo || `SN-${updated.id.toString().padStart(3, '0')}`;
            const timeStr = updated.timeOfEntry ? new Date(updated.timeOfEntry).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const displayStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(); // e.g. "Approved"
            (0, whatsapp_service_1.sendWhatsAppTemplate)(updated.mobileNumber, 'gatepass_for_visitor', [
                {
                    type: 'BODY',
                    parameters: [
                        { type: 'TEXT', text: String(serialNumber) },
                        { type: 'TEXT', text: String(updated.visitorName || 'N/A') },
                        { type: 'TEXT', text: String(updated.personToMeet || 'N/A') },
                        { type: 'TEXT', text: String(updated.purposeOfVisit || 'N/A') },
                        { type: 'TEXT', text: timeStr },
                        { type: 'TEXT', text: displayStatus }
                    ]
                }
            ]);
        }
        // Notify the Security Guard if the visit is approved
        if (updated && status.toLowerCase() === 'approved') {
            const guardContact = await (0, visit_service_1.getSecurityGuardContact)() || process.env.SECURITY_GUARD_PHONE;
            if (guardContact) {
                (0, whatsapp_service_1.sendWhatsAppTemplate)(guardContact, 'gate_pass_updated', [
                    {
                        type: 'BODY',
                        parameters: [
                            { type: 'TEXT', text: String(updated.serialNo || `SN-${updated.id.toString().padStart(3, '0')}`) },
                            { type: 'TEXT', text: String(updated.visitorName || 'N/A') },
                            { type: 'TEXT', text: String(updated.personToMeet || 'N/A') },
                            { type: 'TEXT', text: String(updated.purposeOfVisit || 'N/A') },
                            { type: 'TEXT', text: updated.timeOfEntry ? new Date(updated.timeOfEntry).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                            { type: 'TEXT', text: 'Approved' },
                            { type: 'TEXT', text: guardCloseGatePassLink }
                        ]
                    }
                ]).catch(err => console.error('Failed to notify security guard:', err));
            }
        }
        return res.status(200).json({
            success: true,
            message: constants_1.SUCCESS_MESSAGES.VISIT_APPROVED,
            data: updated
        });
    }
    catch (error) {
        console.error('Approve visit error:', error);
        return res.status(500).json({ error: constants_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};
exports.approveVisitStatus = approveVisitStatus;
const closeVisitGatePass = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid visit ID' });
        }
        const updated = await (0, visit_service_1.closeGatePass)(id);
        return res.status(200).json({
            success: true,
            message: constants_1.SUCCESS_MESSAGES.VISIT_CLOSED,
            data: updated
        });
    }
    catch (error) {
        console.error('Close gate pass error:', error);
        return res.status(500).json({ error: constants_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};
exports.closeVisitGatePass = closeVisitGatePass;
