import { Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../config/db';
import logger from '../utils/logger';
import { TracedRequest } from '../middlewares/trace.middleware';
import { verifyRecaptcha } from '../utils/recaptcha';

const oauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req: TracedRequest, res: Response) => {
  try {
    const { credential, recaptchaToken, email: mockEmail, name: mockName, profilePhoto: mockPhoto, googleId: mockId } = req.body;

    // 1. Verify Google reCAPTCHA v3 if configured
    if (recaptchaToken) {
      const isHuman = await verifyRecaptcha(recaptchaToken);
      if (!isHuman) {
        return res.status(400).json({ statusCode: 400, message: 'reCAPTCHA verification failed. Request blocked as spam.' });
      }
    }

    let email = mockEmail;
    let name = mockName;
    let profilePhoto = mockPhoto;
    let googleId = mockId;

    // 2. Verify Google OAuth credential if supplied
    if (credential) {
      try {
        const ticket = await oauthClient.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        if (!payload) {
          return res.status(400).json({ statusCode: 400, message: 'Google identity verification failed.' });
        }
        email = payload.email;
        name = payload.name;
        profilePhoto = payload.picture;
        googleId = payload.sub;
      } catch (err: any) {
        logger.error({ message: 'Google OAuth verification crashed', error: err.message });
        return res.status(400).json({ statusCode: 400, message: 'Google OAuth verification failed: ' + err.message });
      }
    }

    if (!email || !name) {
      return res.status(400).json({ statusCode: 400, message: 'Email and Name are required.' });
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email }
    });

    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = await prisma.user.create({
        data: {
          email,
          name,
          profilePhoto: profilePhoto || '',
          googleId: googleId || '',
          role: 'USER',
          leadScore: 10 // Starting score for registering
        }
      });
      logger.info({ message: 'New user registered via Google Login', userId: user.id, email });
    } else {
      if (user.disabled) {
        return res.status(403).json({ statusCode: 403, message: 'Your account has been suspended by an administrator.' });
      }
      // Increment lead score for returning visitor login
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          leadScore: user.leadScore + 5
        }
      });
      logger.info({ message: 'Existing user logged in', userId: user.id, email });
    }

    // Record login activity
    await prisma.leadActivity.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        details: `Logged in via ${credential ? 'Google OAuth Verification' : 'Developer Sandbox'}`
      }
    });

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'oakpillar_secret',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      statusCode: 200,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profilePhoto: user.profilePhoto,
        role: user.role,
        leadScore: user.leadScore,
        phone: user.phone,
        whatsApp: user.whatsApp,
        businessType: user.businessType,
        company: user.company
      },
      isNewUser
    });
  } catch (error) {
    logger.error({ message: 'Google Login Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Google Login authentication failed' });
  }
};


export const completeRegistration = async (req: TracedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ statusCode: 401, message: 'Unauthorized' });
    }

    const {
      phone,
      whatsApp,
      company,
      businessType,
      industry,
      city,
      country,
      website
    } = req.body;

    if (!phone || !businessType) {
      return res.status(400).json({ statusCode: 400, message: 'Phone number and Business Type are required.' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ statusCode: 404, message: 'User not found' });
    }

    // Complete profile and add +20 to Lead Score
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        phone,
        whatsApp: whatsApp || phone,
        company,
        businessType,
        industry,
        city,
        country,
        website,
        leadScore: user.leadScore + 20
      }
    });

    // Record registration complete activity
    await prisma.leadActivity.create({
      data: {
        userId,
        action: 'COMPLETE_REGISTRATION',
        details: `Profile updated. Lead score: ${updatedUser.leadScore}`
      }
    });

    logger.info({ message: 'User completed profile registration', userId, leadScore: updatedUser.leadScore });

    return res.status(200).json({
      statusCode: 200,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        profilePhoto: updatedUser.profilePhoto,
        role: updatedUser.role,
        leadScore: updatedUser.leadScore,
        phone: updatedUser.phone,
        whatsApp: updatedUser.whatsApp,
        businessType: updatedUser.businessType,
        company: updatedUser.company,
        industry: updatedUser.industry,
        city: updatedUser.city,
        country: updatedUser.country,
        website: updatedUser.website
      }
    });
  } catch (error) {
    logger.error({ message: 'Complete Registration Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to complete registration profile' });
  }
};

export const getProfile = async (req: TracedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ statusCode: 401, message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        savedServices: { include: { service: true } },
        savedTemplates: { include: { template: true } },
        activities: { orderBy: { timestamp: 'desc' }, take: 20 },
        quotes: true,
        consultations: true,
        notifications: { orderBy: { createdAt: 'desc' }, take: 10 }
      }
    });

    if (!user) {
      return res.status(404).json({ statusCode: 404, message: 'User profile not found' });
    }

    return res.status(200).json({ statusCode: 200, user });
  } catch (error) {
    logger.error({ message: 'Get Profile Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to retrieve user profile' });
  }
};

export const logout = async (req: TracedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (userId) {
      await prisma.leadActivity.create({
        data: {
          userId,
          action: 'LOGOUT',
          details: 'Logged out securely'
        }
      });
    }

    return res.status(200).json({ statusCode: 200, message: 'Logged out successfully' });
  } catch (error) {
    logger.error({ message: 'Logout Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to logout session' });
  }
};

export const loginWithEmailPassword = async (req: TracedRequest, res: Response) => {
  try {
    const { email, password, recaptchaToken } = req.body;

    if (!email || !password) {
      return res.status(400).json({ statusCode: 400, message: 'Email and Password are required.' });
    }

    // 1. Verify Google reCAPTCHA v3 if configured
    if (recaptchaToken) {
      const isHuman = await verifyRecaptcha(recaptchaToken);
      if (!isHuman) {
        return res.status(400).json({ statusCode: 400, message: 'reCAPTCHA verification failed. Request blocked as spam.' });
      }
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      return res.status(401).json({ statusCode: 401, message: 'Invalid email or password.' });
    }

    // If user has no password set (e.g. signed up via Google originally), block email/password login
    if (!user.password) {
      return res.status(400).json({ statusCode: 400, message: 'This account uses Google Login. Please sign in via Google.' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ statusCode: 401, message: 'Invalid email or password.' });
    }

    // Update lead score for active login
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        leadScore: user.leadScore + 5
      }
    });

    // Record login activity
    await prisma.leadActivity.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        details: `Logged in via Email/Password Credentials`
      }
    });

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'oakpillar_secret',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      statusCode: 200,
      token,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        profilePhoto: updatedUser.profilePhoto,
        role: updatedUser.role,
        leadScore: updatedUser.leadScore,
        phone: updatedUser.phone,
        whatsApp: updatedUser.whatsApp,
        businessType: updatedUser.businessType,
        company: updatedUser.company
      }
    });
  } catch (error) {
    logger.error({ message: 'Email/Password Login Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Login authentication failed' });
  }
};
