import { Router } from 'express';
import { fetchPersons, createPersonHandler, updatePersonHandler, deletePersonHandler } from './data.controller';
import { validate } from '../../middlewares/validate.middleware';
import { createDataSchema, updateDataSchema } from './data.validator';

const router = Router();

router.get('/', fetchPersons);
router.post('/', validate(createDataSchema), createPersonHandler);
router.patch('/:id', validate(updateDataSchema), updatePersonHandler);
router.delete('/:id', deletePersonHandler);

export default router;
