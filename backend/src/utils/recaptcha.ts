import logger from './logger';

export async function verifyRecaptcha(token?: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  // If secret key is not set in env, bypass validation (useful for local development sandbox testing)
  if (!secretKey || secretKey === 'PASTE_YOUR_RECAPTCHA_SECRET_KEY_HERE') {
    logger.info('reCAPTCHA Secret Key not configured. Bypassing verification.');
    return true;
  }

  if (!token) {
    logger.warn('reCAPTCHA token missing but verification is required.');
    return false;
  }

  try {
    const params = new URLSearchParams({
      secret: secretKey,
      response: token
    });

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const data: any = await response.json();

    if (!data.success) {
      logger.warn({ message: 'reCAPTCHA verification failed', codes: data['error-codes'] });
      return false;
    }

    // reCAPTCHA v3 returns a score between 0.0 (bot) and 1.0 (human)
    // A score threshold of >= 0.5 is standard
    if (data.score !== undefined && data.score < 0.5) {
      logger.warn({ message: 'reCAPTCHA score too low', score: data.score });
      return false;
    }

    return true;
  } catch (error) {
    logger.error({ message: 'reCAPTCHA verification error', error: error instanceof Error ? error.message : error });
    return false;
  }
}
