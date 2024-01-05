// 保留到小数点decimal位
export const formatDecimal = (num: number, decimal: number) => {
    const factor = Math.pow(10, decimal);
    return Math.round(num * factor) / factor;
}