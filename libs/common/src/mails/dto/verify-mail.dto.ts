export class VerifyMailQueueDto {
  email: string;
  token: string;
  templateId: string;
  variables: Record<string, string> = {
    name: '',
    verification_link: '',
  };
}
