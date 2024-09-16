
import { Router } from 'express';
import {
  getData, postData, deleteData, updateData,
  loginUser, signupUser, protectedRoute,
  sendOtp,verifyOtp
} from '../controller/controller';
import { verifyToken } from '../middleware/token';
const router = Router();

//CRUD operations routes
router.get('/get', getData);
router.post('/', postData);
router.delete('/delete/:id', deleteData);
router.put('/update/:id', updateData);

//Authentication routes
router.post('/login', loginUser);
router.post('/signup', signupUser);

//Protected route with token verification middleware
router.get('/protected', verifyToken, protectedRoute);


// Verification routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
export default router; 



