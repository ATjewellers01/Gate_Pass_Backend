import { Router } from 'express';
import { fetchPersons, createPersonHandler, updatePersonHandler, deletePersonHandler } from './user.controller';
import { validate } from '../../middlewares/validate.middleware';
import { createPersonSchema, updatePersonSchema } from './user.validator';

const router = Router();

router.get('/', fetchPersons);
router.post('/', validate(createPersonSchema), createPersonHandler);
router.patch('/:id', validate(updatePersonSchema), updatePersonHandler);
router.delete('/:id', deletePersonHandler);

export default router;
