import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-tw';
import { TimeOptions } from './types';
export declare const getTime: (options?: TimeOptions) => dayjs.Dayjs;
