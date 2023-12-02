import { ClientOptions } from '@timotte-sdk/utils';

import { ReportDeployment, ReportType } from '../constants';

export interface BrowserClientOptions extends ClientOptions {
    reportType?: ReportType;
    reportDeployment?: ReportDeployment;
}

export * from './performance';
