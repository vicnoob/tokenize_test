import api from '@marcius-capital/binance-api';
import {
  Bar,
  DatafeedConfiguration,
} from 'src/assets/charting_library/charting_library.min';

export const supportedResolution = [
  '1',
  '3',
  '5',
  '15',
  '30',
  '60',
  '120',
  '240',
  '360',
  '480',
  '720',
  'D',
  '3D',
  'W',
  '1W',
  'M',
  '1M',
  '1D',
];

export const configurationData: DatafeedConfiguration = {
  supports_marks: false,
  supports_timescale_marks: false,
  supports_time: true,
  supported_resolutions: supportedResolution,
};

export const intervals: Record<string, string> = {
  1: '1m',
  3: '3m',
  5: '5m',
  15: '15m',
  30: '30m',
  60: '1h',
  120: '2h',
  240: '4h',
  360: '6h',
  480: '8h',
  720: '12h',
  D: '1d',
  '1D': '1d',
  '3D': '3d',
  W: '1w',
  '1W': '1w',
  M: '1M',
  '1M': '1M',
};

export const checkInterval = (interval: string): boolean =>
  !!intervals[interval];

export const subscribeKline = (
  { symbol, interval, uniqueID },
  callback: (KLine: Bar) => void
) => {
  interval = intervals[interval]; // set interval
  return api.stream.kline({ symbol, interval, uniqueID }, (res) => {
    const candle = formatingKline(res.kline);
    callback(candle);
  });
};

export const unsubscribeKline = (uniqueID: string) => {
  return api.stream.close.kline({ uniqueID });
};

export const formatingKline = ({
  openTime,
  open,
  high,
  low,
  close,
  volume,
}): Bar => ({
  time: openTime,
  open,
  high,
  low,
  close,
  volume,
});
