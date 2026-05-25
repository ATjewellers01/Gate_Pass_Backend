import { Router } from 'express';
import { fetchUsers, createUserHandler, updateUserHandler, deleteUserHandler } from './system-users.controller';

const router = Router();

router.get('/', fetchUsers);
router.post('/', createUserHandler);
router.patch('/:id', updateUserHandler);
router.delete('/:id', deleteUserHandler);

export default router;
