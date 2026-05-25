import { Request, Response } from 'express';
import { loginUser } from './auth.service';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../utils/constants';

export const login = async (req: Request, res: Response) => {
  try {
    const { userId, password } = req.body;
    
    const user = await loginUser(userId, password);
    
    if (!user) {
      return res.status(401).json({ error: ERROR_MESSAGES.INVALID_CREDENTIALS });
    }
    
    return res.status(200).json({
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      data: user
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};
