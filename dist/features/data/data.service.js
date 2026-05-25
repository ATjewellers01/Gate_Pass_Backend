"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePerson = exports.updatePerson = exports.createPerson = exports.getPersonsToMeet = void 0;
const db_config_1 = require("../../config/db.config");
const getPersonsToMeet = async () => {
    const dataRecords = await db_config_1.prisma.data.findMany({
        select: {
            id: true,
            personName: true,
            phoneNumber: true,
            designation: true,
            status: true,
        }
    });
    return dataRecords.map((record) => ({
        id: record.id,
        person_to_meet: record.personName,
        phone: record.phoneNumber || 'N/A',
        designation: record.designation || '',
        status: record.status || 'active'
    }));
};
exports.getPersonsToMeet = getPersonsToMeet;
const createPerson = async (data) => {
    const record = await db_config_1.prisma.data.create({
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
exports.createPerson = createPerson;
const updatePerson = async (id, data) => {
    const updateData = {};
    if (data.personToMeet !== undefined)
        updateData.personName = data.personToMeet;
    if (data.phone !== undefined)
        updateData.phoneNumber = data.phone;
    if (data.designation !== undefined)
        updateData.designation = data.designation || null;
    if (data.status !== undefined)
        updateData.status = data.status;
    const record = await db_config_1.prisma.data.update({
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
exports.updatePerson = updatePerson;
const deletePerson = async (id) => {
    await db_config_1.prisma.data.delete({
        where: { id }
    });
    return true;
};
exports.deletePerson = deletePerson;
