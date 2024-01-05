import { ClientOptions, ReportType } from '@timotte-sdk/utils';

import { ReportDeployment } from '../constants';

export interface BrowserClientOptions extends ClientOptions {
    reportType?: ReportType;
    reportDeployment?: ReportDeployment;
}
