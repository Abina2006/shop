import {
  registerUser,
  loginUser,
  refreshAccessToken
} from './auth.service.js';
import {
  validateRegister,
  validateLogin
} from './auth.validation.js';

export const register = async (req, res) => {
  try {
    const { isValid, errors } = validateRegister(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors
      });
    }

    const { name, email, password } = req.body;
    const data = await registerUser(name, email, password);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { isValid, errors } = validateLogin(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors
      });
    }

    const { email, password } = req.body;
    const data = await loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const data = await refreshAccessToken(refreshToken);

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully.',
      data
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

export const logout = async (req, res) => {
  // Stateless logout clears on the frontend by discarding access/refresh tokens.
  // For the API MVP, we acknowledge the request and confirm token clear.
  return res.status(200).json({
    success: true,
    message: 'User logged out successfully.'
  });
};

export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
