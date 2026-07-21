import logger from './logger';

const RESEND_API_URL = 'https://api.resend.com/emails';

// The "from" sender name matching brand layout
const FROM_EMAIL = 'onboarding@resend.dev'; // Resend sandbox default. In production, change to custom domain (e.g. hello@oakpillar.com)

interface SendEmailParams {
  to: string[];
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey === 'PASTE_YOUR_RESEND_API_KEY_HERE') {
    logger.warn('Resend API key is not configured. Email dispatch bypassed. Logged Content below:');
    logger.info(`To: ${to.join(', ')} | Subject: ${subject}`);
    return true; // Bypass successfully for dev
  }

  // Filter recipients to avoid Resend sandbox 403 blocks for unverified addresses
  let finalTo = to;
  if (FROM_EMAIL === 'onboarding@resend.dev') {
    finalTo = to.filter(email => 
      email.toLowerCase() === 'oakpillarstudios@gmail.com' || 
      email.toLowerCase() === 'pratiksha.shingare17@gmail.com'
    );
    if (finalTo.length === 0) {
      logger.info(`Resend Sandbox mode: Bypassed dispatch to unverified address: ${to.join(', ')}`);
      return true; 
    }
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: `OakPillar Studios <${FROM_EMAIL}>`,
        to: finalTo,
        subject,
        html
      })
    });

    const data: any = await response.json();

    if (!response.ok) {
      logger.error({ message: 'Resend API dispatch failed', error: data });
      return false;
    }

    logger.info({ message: 'Email sent successfully via Resend', emailId: data.id, to });
    return true;
  } catch (error) {
    logger.error({ message: 'Email sending exception error', error: error instanceof Error ? error.message : error });
    return false;
  }
}

// HTML template helper wrapper
const wrapEmailTemplate = (title: string, bodyContent: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      background-color: #F8F9FA;
      color: #0A192F;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background: #FFFFFF;
      border: 1px solid rgba(10, 25, 47, 0.08);
      border-top: 4px solid #AA8B2C;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    }
    .header {
      padding: 24px;
      text-align: center;
      border-bottom: 1px solid #E5E4E2;
    }
    .header h1 {
      font-size: 20px;
      margin: 0;
      color: #0A192F;
      font-weight: 800;
    }
    .content {
      padding: 30px 24px;
      font-size: 14px;
      line-height: 1.6;
    }
    .footer {
      background: #F8F9FA;
      padding: 20px 24px;
      text-align: center;
      font-size: 11px;
      color: #5A6990;
      border-top: 1px solid #E5E4E2;
    }
    .footer a {
      color: #AA8B2C;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
    </div>
    <div class="content">
      ${bodyContent}
    </div>
    <div class="footer">
      <p><strong>OakPillar Studios</strong></p>
      <p>BKC, Mumbai, MH, India | +91 7738049380</p>
      <p>
        <a href="mailto:oakpillarstudios@gmail.com">oakpillarstudios@gmail.com</a> | 
        <a href="mailto:pratiksha.shingare17@gmail.com">pratiksha.shingare17@gmail.com</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

export async function sendQuoteAlert(userEmail: string, userName: string, quoteDetails: any) {
  const adminSubject = `🚨 New Quote Request: ${quoteDetails.serviceName}`;
  const adminHtml = wrapEmailTemplate('New Quote Ingested', `
    <p>A new project quote request has been submitted by <strong>${userName}</strong> (${userEmail}).</p>
    <h3>Quotation Details</h3>
    <ul>
      <li><strong>Target Budget:</strong> $${quoteDetails.budget}</li>
      <li><strong>Target Timeline:</strong> ${quoteDetails.timeline}</li>
      <li><strong>Requirements:</strong> ${quoteDetails.requirements}</li>
    </ul>
    <p>Please log in to the OakPillar Admin CRM panel to update the status and score priority.</p>
  `);

  const clientSubject = `We Received Your Quote Request - OakPillar Studios`;
  const clientHtml = wrapEmailTemplate('Quote Request Received', `
    <p>Hello ${userName.split(' ')[0]},</p>
    <p>Thank you for submitting your project quote request to <strong>OakPillar Studios</strong>.</p>
    <p>Our engineering team is currently reviewing your target requirements ($${quoteDetails.budget} budget, ${quoteDetails.timeline} timeline). We will compile your cost estimate proposal and contact you within 24 business hours.</p>
    <p>In the meantime, you can track the status of your request directly from your Client Dashboard portal.</p>
  `);

  // Dispatch to admins
  await sendEmail({
    to: ['oakpillarstudios@gmail.com', 'pratiksha.shingare17@gmail.com'],
    subject: adminSubject,
    html: adminHtml
  });

  // Dispatch auto-reply to client
  await sendEmail({
    to: [userEmail],
    subject: clientSubject,
    html: clientHtml
  });
}

export async function sendConsultationAlert(userEmail: string, userName: string, meetingDetails: any) {
  const adminSubject = `📅 New Consultation Booking: ${userName}`;
  const adminHtml = wrapEmailTemplate('New Strategy Session Booked', `
    <p><strong>${userName}</strong> (${userEmail}) has scheduled a 1-on-1 strategy meeting.</p>
    <h3>Meeting Details</h3>
    <ul>
      <li><strong>Preferred Date:</strong> ${meetingDetails.preferredDate}</li>
      <li><strong>Preferred Time Slot:</strong> ${meetingDetails.preferredTime}</li>
      <li><strong>Timezone:</strong> ${meetingDetails.timezone}</li>
      <li><strong>Channel:</strong> ${meetingDetails.contactMethod}</li>
      <li><strong>Notes:</strong> ${meetingDetails.notes || 'None'}</li>
    </ul>
    <p>Please coordinate and assign a meeting link in the Admin dashboard.</p>
  `);

  const clientSubject = `Your Strategy Consultation is Confirmed - OakPillar Studios`;
  const clientHtml = wrapEmailTemplate('Strategy Session Booked', `
    <p>Hello ${userName.split(' ')[0]},</p>
    <p>Your strategy consultation session has been scheduled successfully with <strong>OakPillar Studios</strong>.</p>
    <h3>Session Details</h3>
    <ul>
      <li><strong>Date:</strong> ${meetingDetails.preferredDate}</li>
      <li><strong>Time:</strong> ${meetingDetails.preferredTime} (${meetingDetails.timezone})</li>
      <li><strong>Channel:</strong> ${meetingDetails.contactMethod}</li>
    </ul>
    <p>Our team will send a calendar invite link shortly. If you need to make changes, please reply to this email or contact us at +91 7738049380.</p>
  `);

  // Dispatch to admins
  await sendEmail({
    to: ['oakpillarstudios@gmail.com', 'pratiksha.shingare17@gmail.com'],
    subject: adminSubject,
    html: adminHtml
  });

  // Dispatch auto-reply to client
  await sendEmail({
    to: [userEmail],
    subject: clientSubject,
    html: clientHtml
  });
}
