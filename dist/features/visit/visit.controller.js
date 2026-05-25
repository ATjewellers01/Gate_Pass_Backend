"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeVisitGatePass = exports.approveVisitStatus = exports.fetchAllVisits = exports.submitVisitRequest = void 0;
const visit_service_1 = require("./visit.service");
const constants_1 = require("../../utils/constants");
const submitVisitRequest = async (req, res) => {
    try {
        const visit = await (0, visit_service_1.createVisit)(req.body);
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
