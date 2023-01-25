export class ReqMessengerApiDto {
  template_name: string;
  translite: boolean;
  source: string;
  type: string;
  phone: string;
  template_arguments: Record<string, string>;
}