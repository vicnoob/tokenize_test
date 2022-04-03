import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import api from "@marcius-capital/binance-api";

const configurationData: Record<string, boolean | string[]> = {
  supports_marks: false,
  supports_timescale_marks: false,
  supports_time: true,
  supported_resolutions: ["1", "3", "5", "15", "1D", "1W"],
};

const intervals: Record<string, string> = {
  "1": "1m",
  "3": "3m",
  "5": "5m",
  "15": "15m",
  "30": "30m",
  "60": "1h",
  "120": "2h",
  "240": "4h",
  "360": "6h",
  "480": "8h",
  "720": "12h",
  D: "1d",
  "1D": "1d",
  "3D": "3d",
  W: "1w",
  "1W": "1w",
  M: "1M",
  "1M": "1M",
};

const checkInterval = (interval: string): boolean => !!intervals[interval];

const subscribeKline = ({ symbol, interval, uniqueID }, callback) => {
  interval = intervals[interval]; // set interval
  return api.stream.kline({ symbol, interval, uniqueID }, (res) => {
    const candle = formatingKline(res.kline);
    callback(candle);
  });
};

const unsubscribeKline = (uniqueID) => {
  return api.stream.close.kline({ uniqueID });
};

function formatingKline({ openTime, open, high, low, close, volume }) {
  return {
    time: openTime,
    open,
    high,
    low,
    close,
    volume,
  };
}

@Injectable({
  providedIn: "root",
})
export class ChartService {
  private BASE_URL = "https://api.binance.com/api/v3";
  constructor(private httpClient: HttpClient) {}

  private getExchangeServerTime(): any {
    return this.request("/time").then((res: any) => res.serverTime);
  }
  private getSymbols(): any {
    return this.request("/exchangeInfo").then((res: any) => res.symbols);
  }
  private getKlines({ symbol, interval, from, to }): any {
    interval = intervals[interval]; // set interval
    console.log(interval, "interval");
    from *= 1000;
    to *= 1000;

    return this.request("/klines", {
      symbol: symbol.toUpperCase(),
      interval,
      startTime: from,
      endTime: to,
    }).then((res: any[]) => {
      return res.map((i) => ({
        time: parseFloat(i[0]),
        open: parseFloat(i[1]),
        high: parseFloat(i[2]),
        low: parseFloat(i[3]),
        close: parseFloat(i[4]),
        volume: parseFloat(i[5]),
      }));
    });
  }

  private request(url, params = {}) {
    return this.httpClient.get(this.BASE_URL + url, { params }).toPromise();
  }

  public onReady(callback) {
    console.log("[onReady]: Method call");
    setTimeout(() => callback(configurationData)); // callback must be called asynchronously.
  }

  public searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
    console.log("[searchSymbols]: Method call");
  }

  public resolveSymbol(
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback
  ) {
    console.log("[resolveSymbol]: Method call", symbolName);

    const comps = symbolName.split(":");
    symbolName = (comps.length > 1 ? comps[1] : symbolName).toUpperCase();

    // need for pricescale()
    function pricescale(symbol) {
      for (let filter of symbol.filters) {
        if (filter.filterType == "PRICE_FILTER") {
          return Math.round(1 / parseFloat(filter.tickSize));
        }
      }
      return 1;
    }

    const symbolInfo = (symbol) => ({
      name: symbol.symbol,
      description: symbol.baseAsset + " / " + symbol.quoteAsset,
      ticker: symbol.symbol,
      //exchange: 'Binance',
      //listed_exchange: 'Binance',
      //type: 'crypto',
      session: "24x7",
      minmov: 1,
      pricescale: pricescale(symbol), // 	or 100
      timezone: "UTC",
      has_intraday: true,
      has_daily: true,
      has_weekly_and_monthly: true,
      currency_code: symbol.quoteAsset,
    });

    // Get symbols
    this.getSymbols().then((symbols) => {
      const symbol = symbols.find((i) => i.symbol == symbolName);
      return symbol
        ? onSymbolResolvedCallback(symbolInfo(symbol))
        : onResolveErrorCallback("[resolveSymbol]: symbol not found");
    });
  }
  // get historical data for the symbol
  // https://github.com/tradingview/charting_library/wiki/JS-Api#getbarssymbolinfo-resolution-periodparams-onhistorycallback-onerrorcallback
  // getBars: async (symbolInfo, interval, periodParams, onHistoryCallback, onErrorCallback) => {
  public async getBars(
    symbolInfo,
    interval,
    from,
    to,
    onHistoryCallback,
    onErrorCallback,
    firstDataRequest
  ) {
    console.log("[getBars] Method call", interval);

    if (!checkInterval(interval)) {
      return onErrorCallback("[getBars] Invalid interval");
    }

    const klines = await this.getKlines({
      symbol: symbolInfo.name,
      interval,
      from,
      to,
    });
    console.log(klines);
    if (klines.length > 0) {
      return onHistoryCallback(klines);
    }

    onErrorCallback("Klines data error");
  }
  // subscription to real-time updates
  public subscribeBars(
    symbolInfo,
    interval,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback
  ) {
    console.log(
      "[subscribeBars]: Method call with subscribeUID:",
      subscribeUID
    );

    subscribeKline(
      { symbol: symbolInfo.name, interval, uniqueID: subscribeUID },
      (cb) => onRealtimeCallback(cb)
    );
  }

  public unsubscribeBars(subscriberUID) {
    console.log(
      "[unsubscribeBars]: Method call with subscriberUID:",
      subscriberUID
    );
    unsubscribeKline(subscriberUID);
  }

  public getServerTime(callback) {
    this.getExchangeServerTime()
      .then((time) => {
        callback(Math.floor(time / 1000));
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
