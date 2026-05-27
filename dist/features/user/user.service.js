"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePerson = exports.updatePerson = exports.createPerson = exports.getPersonsToMeet = void 0;
const db_config_1 = require("../../config/db.config");
const getPersonsToMeet = async () => {
    const users = await db_config_1.prisma.user.findMany({
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
exports.getPersonsToMeet = getPersonsToMeet;
const createPerson = async (data) => {
    // Use a generated userId for the new person, or map it.
    const userIdStr = data.personToMeet.toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(Math.random() * 1000);
    const user = await db_config_1.prisma.user.create({
        data: {
            userName: data.personToMeet,
            password: data.password || "password123", // default password
            phone: data.phone || `000000000${Math.floor(Math.random() * 1000)}`, // phone must be unique and present
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
exports.createPerson = createPerson;
const updatePerson = async (id, data) => {
    const updateData = {};
    if (data.personToMeet)
        updateData.userName = data.personToMeet;
    if (data.phone)
        updateData.phone = data.phone;
    if (data.password)
        updateData.password = data.password;
    const user = await db_config_1.prisma.user.update({
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
exports.updatePerson = updatePerson;
const deletePerson = async (id) => {
    await db_config_1.prisma.user.delete({
        where: { id }
    });
    return true;
};
exports.deletePerson = deletePerson;
