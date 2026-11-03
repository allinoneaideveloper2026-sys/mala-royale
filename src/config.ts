export const APP_VERSION = '0.1.0-beta';
export const DEVELOPER_EMAILS = (import.meta.env.VITE_DEVELOPER_EMAILS || 'allinoneaideveloper2026@gmail.com').split(',');

export const CONFIG = {
  version: APP_VERSION,
  developerEmails: DEVELOPER_EMAILS,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  pincodeProxyUrl: import.meta.env.VITE_PINCODE_PROXY_URL || '',
  feedbackUrl: import.meta.env.VITE_FEEDBACK_URL || '',
  maxHostLogins: 3,
};
