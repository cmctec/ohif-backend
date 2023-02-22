export class MessengerApiDto {
  id: string;
  created_at: string;
  updated_at: string;
  phone: string;
  source: string;
  message: string;
  type: string;
  template_name: string;
  template_arguments: string;
  status: 'SUCCESS' | 'ERROR' | 'PENDING ';
  twilio_sid: string | null;
  twilio_status: string | null;
  smsc_sid: string | null;
  smsc_status_code: string | null;
  smsc_status: string | null;
}
