import { OAuth2Client } from 'google-auth-library';
import { env } from '../config/env.js';

export const googleOAuthClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);
