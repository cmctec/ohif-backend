export class ReqPdfJsReportApi {
  template: {
    name: string;
  };
  options: {
    reports: { save: boolean };
  };
  data: Record<string, string>;
}
