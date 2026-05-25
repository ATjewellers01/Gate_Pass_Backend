import { Request, Response } from 'express';
import { getAllSystemUsers, createSystemUser, updateSystemUser, deleteSystemUser } from './system-users.service';
import { ERROR_MESSAGES } from '../../utils/constants';

export const fetchUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllSystemUsers();
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Fetch users error:', error);
    return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const user = await createSystemUser(req.body);
    return res.status(201).json({ success: true, data: user });
  } catch (error: any) {
    console.error('Create user error:', error);
    if (error?.code === 'P2002') {
      return res.status(400).json({ error: 'User ID already exists. Please choose a different one.' });
    }
    return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, details: error.message });
  }
};

export const updateUserHandler = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
    
    const user = await updateSystemUser(id, req.body);
    return res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    console.error('Update user error:', error);
    if (error?.code === 'P2002') {
      return res.status(400).json({ error: 'User ID already exists. Please choose a different one.' });
    }
    return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, details: error.message });
  }
};

export const deleteUserHandler = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
    
    await deleteSystemUser(id);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};
