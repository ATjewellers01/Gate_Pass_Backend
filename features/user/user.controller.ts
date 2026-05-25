import { Request, Response } from 'express';
import { getPersonsToMeet, createPerson, updatePerson, deletePerson } from './user.service';
import { ERROR_MESSAGES } from '../../utils/constants';

export const fetchPersons = async (req: Request, res: Response) => {
  try {
    const persons = await getPersonsToMeet();
    return res.status(200).json({ data: persons });
  } catch (error) {
    console.error('Fetch persons error:', error);
    return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

export const createPersonHandler = async (req: Request, res: Response) => {
  try {
    const person = await createPerson(req.body);
    return res.status(201).json({ success: true, data: person });
  } catch (error) {
    console.error('Create person error:', error);
    return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

export const updatePersonHandler = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
    const person = await updatePerson(id, req.body);
    return res.status(200).json({ success: true, data: person });
  } catch (error) {
    console.error('Update person error:', error);
    return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

export const deletePersonHandler = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
    await deletePerson(id);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete person error:', error);
    return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};
