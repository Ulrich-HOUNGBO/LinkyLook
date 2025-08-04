export class VerifyMailQueueDto {
  email: string;
  otp: string;
  variables: Record<string, string> = {
    name: '',
    otp_code: '',
  };
}
