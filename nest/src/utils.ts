export enum EMAIL_SUBJECT {
  verify = 'verify',
  reset = 'reset',
}

export const emailSubject = {
  verify: 'Verify your email to complete registration',
  reset: 'Reset your password',
};

export const generateResetPasswordEmail = (emailToken: string) => {};
