import dayjs from 'dayjs';
export interface TimeOptions {
    date?: dayjs.ConfigType;
    format?: dayjs.OptionType;
    locale?: string;
    strict?: boolean;
    zonetime?: string;
}
