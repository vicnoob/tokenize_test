import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  checkInterval,
  configurationData,
  intervals,
  subscribeKline,
  unsubscribeKline,
} from './chart.helper';
import {
  DatafeedConfiguration,
  ResolveCallback,
  SearchSymbolsCallback,
  ErrorCallback,
  LibrarySymbolInfo,
  ResolutionString,
  HistoryCallback,
  SubscribeBarsCallback,
} from 'src/assets/charting_library/charting_library.min';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  private BASE_URL = 'https://api.binance.com/api/v3';
  constructor(private httpClient: HttpClient) {}

  private getExchangeServerTime(): Promise<any> {
    return this.request('/time').then(
      (res: { serverTime: number }) => res.serverTime
    );
  }
  private getSymbols(): Promise<any> {
    return this.request('/exchangeInfo').then((res: any) => {
      return res.symbols;
    });
  }
  private getKlines({ symbol, interval, from, to }): any {
    interval = intervals[interval]; // set interval
    from *= 1000;
    to *= 1000;

    return this.request('/klines', {
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

  private request(url: string, params = {}): Promise<any> {
    return this.httpClient.get(this.BASE_URL + url, { params }).toPromise();
  }

  public onReady(
    callback: (configurationData: DatafeedConfiguration) => void
  ): void {
    console.log('[onReady]: Method call');
    setTimeout(() => callback(configurationData)); // callback must be called asynchronously.
  }

  public searchSymbols(
    userInput: string,
    exchange: string,
    symbolType: string,
    onResultReadyCallback: SearchSymbolsCallback
  ): void {
    console.log('[searchSymbols]: Method call');
  }

  public resolveSymbol(
    symbolName: string,
    onSymbolResolvedCallback: ResolveCallback,
    onResolveErrorCallback: ErrorCallback
  ): void {
    console.log('[resolveSymbol]: Method call', symbolName);

    const comps = symbolName.split(':');
    symbolName = (comps.length > 1 ? comps[1] : symbolName).toUpperCase();

    // need for pricescale()
    function pricescale(symbol): number {
      for (const filter of symbol.filters) {
        if (filter.filterType === 'PRICE_FILTER') {
          return Math.round(1 / parseFloat(filter.tickSize));
        }
      }
      return 1;
    }

    const symbolInfo = (symbol): LibrarySymbolInfo =>
      ({
        name: symbol.symbol,
        description: symbol.baseAsset + ' / ' + symbol.quoteAsset,
        ticker: symbol.symbol,
        session: '24x7',
        minmov: 1,
        pricescale: pricescale(symbol), // 	or 100
        timezone: 'Etc/UTC',
        has_intraday: true,
        has_daily: true,
        has_weekly_and_monthly: true,
        currency_code: symbol.quoteAsset,
      } as LibrarySymbolInfo);

    // Get symbols
    this.getSymbols().then((symbols) => {
      const symbol = symbols.find((i) => i.symbol === symbolName);
      return symbol
        ? onSymbolResolvedCallback(symbolInfo(symbol))
        : onResolveErrorCallback('[resolveSymbol]: symbol not found');
    });
  }
  // get historical data for the symbol
  // https://github.com/tradingview/charting_library/wiki/JS-Api#getbarssymbolinfo-resolution-periodparams-onhistorycallback-onerrorcallback
  // getBars: async (symbolInfo, interval, periodParams, onHistoryCallback, onErrorCallback) => {
  public async getBars(
    symbolInfo: LibrarySymbolInfo,
    interval: ResolutionString,
    from: number,
    to: number,
    onHistoryCallback: HistoryCallback,
    onErrorCallback: ErrorCallback,
    firstDataRequest: boolean
  ): Promise<void> {
    console.log('[getBars] Method call', interval);

    if (!checkInterval(interval)) {
      return onErrorCallback('[getBars] Invalid interval');
    }

    const klines = await this.getKlines({
      symbol: symbolInfo.name,
      interval,
      from,
      to,
    });

    if (klines.length > 0) {
      return onHistoryCallback(klines, null);
    }

    onErrorCallback('Klines data error');
  }
  // subscription to real-time updates
  public subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    interval: ResolutionString,
    onRealtimeCallback: SubscribeBarsCallback,
    subscribeUID: string,
    onResetCacheNeededCallback: () => void
  ): void {
    console.log(
      '[subscribeBars]: Method call with subscribeUID:',
      subscribeUID
    );

    subscribeKline(
      { symbol: symbolInfo.name, interval, uniqueID: subscribeUID },
      (cb) => onRealtimeCallback(cb)
    );
  }

  public unsubscribeBars(subscriberUID: string): void {
    console.log(
      '[unsubscribeBars]: Method call with subscriberUID:',
      subscriberUID
    );
    unsubscribeKline(subscriberUID);
  }

  public getServerTime(callback): void {
    this.getExchangeServerTime()
      .then((time: number) => {
        callback(Math.floor(time / 1000));
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
