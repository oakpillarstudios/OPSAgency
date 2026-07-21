/**
 * Frontend Google reCAPTCHA v3 Execution Helper
 */
export async function executeRecaptcha(action: string): Promise<string> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey || siteKey === 'PASTE_YOUR_RECAPTCHA_SITE_KEY_HERE') {
    // If reCAPTCHA key is not set, bypass validation silently (sandbox development mode)
    return '';
  }

  return new Promise((resolve) => {
    const grecaptcha = (window as any).grecaptcha;
    if (!grecaptcha) {
      console.warn('reCAPTCHA script not loaded yet.');
      resolve('');
      return;
    }

    grecaptcha.ready(async () => {
      try {
        const token = await grecaptcha.execute(siteKey, { action });
        resolve(token);
      } catch (err) {
        console.error('reCAPTCHA execution error:', err);
        resolve('');
      }
    });
  });
}
