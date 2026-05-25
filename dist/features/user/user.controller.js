"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePersonHandler = exports.updatePersonHandler = exports.createPersonHandler = exports.fetchPersons = void 0;
const user_service_1 = require("./user.service");
const constants_1 = require("../../utils/constants");
const fetchPersons = async (req, res) => {
    try {
        const persons = await (0, user_service_1.getPersonsToMeet)();
        return res.status(200).json({ data: persons });
    }
    catch (error) {
        console.error('Fetch persons error:', error);
        return res.status(500).json({ error: constants_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};
exports.fetchPersons = fetchPersons;
const createPersonHandler = async (req, res) => {
    try {
        const person = await (0, user_service_1.createPerson)(req.body);
        return res.status(201).json({ success: true, data: person });
    }
    catch (error) {
        console.error('Create person error:', error);
        return res.status(500).json({ error: constants_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};
exports.createPersonHandler = createPersonHandler;
const updatePersonHandler = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ error: 'Invalid ID' });
        const person = await (0, user_service_1.updatePerson)(id, req.body);
        return res.status(200).json({ success: true, data: person });
    }
    catch (error) {
        console.error('Update person error:', error);
        return res.status(500).json({ error: constants_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};
exports.updatePersonHandler = updatePersonHandler;
const deletePersonHandler = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ error: 'Invalid ID' });
        await (0, user_service_1.deletePerson)(id);
        return res.status(200).json({ success: true });
    }
    catch (error) {
        console.error('Delete person error:', error);
        return res.status(500).json({ error: constants_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};
exports.deletePersonHandler = deletePersonHandler;
