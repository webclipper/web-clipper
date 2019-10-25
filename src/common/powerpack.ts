import dayjs from 'dayjs';

export const checkBill = (nextBillDate: string) => {
  return dayjs(nextBillDate, 'YYYY-MM-DD')
    .endOf('day')
    .add(1, 'day')
    .isAfter(dayjs());
};
