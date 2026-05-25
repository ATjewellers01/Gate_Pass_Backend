import { Router } from 'express';
import { submitVisitRequest, fetchAllVisits, approveVisitStatus, closeVisitGatePass } from './visit.controller';
import { validate } from '../../middlewares/validate.middleware';
import { createVisitSchema, updateVisitSchema, closeGatePassSchema } from './visit.validator';

const router = Router();

router.post('/', validate(createVisitSchema), submitVisitRequest);
router.get('/', fetchAllVisits);
router.patch('/:id/approve', validate(updateVisitSchema), approveVisitStatus);
router.patch('/:id/close', validate(closeGatePassSchema), closeVisitGatePass);

export default router;
