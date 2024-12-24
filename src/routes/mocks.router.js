import { Router} from 'express';
import mocksController from '../controllers/mocks.controller.js';

const router = Router();

router.get('/mockingpets', mocksController.getMockPets);
router.get('/mockingusers', mocksController.getMockUsers);
router.post('/generateData', mocksController.generateData);

export default router;