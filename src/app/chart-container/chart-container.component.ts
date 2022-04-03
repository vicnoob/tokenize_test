import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import {
  ChartingLibraryWidgetOptions,
  IBasicDataFeed,
  IChartingLibraryWidget,
  ResolutionString,
  widget,
} from 'src/assets/charting_library/charting_library.min';
import { ChartService } from './chart-service.service';

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ChartContainerComponent implements OnInit {
  private api: IBasicDataFeed;
  private _symbol: ChartingLibraryWidgetOptions['symbol'] = 'BTCUSDT';
  private _interval: ChartingLibraryWidgetOptions['interval'] =
    '3' as ResolutionString;
  // BEWARE: no trailing slash is expected in feed URL
  private _datafeedUrl = 'https://demo_feed.tradingview.com';
  private _libraryPath: ChartingLibraryWidgetOptions['library_path'] =
    '/assets/charting_library/';
  private _chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'] =
    'https://saveload.tradingview.com';
  private _chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'] =
    '1.1';
  private _clientId: ChartingLibraryWidgetOptions['client_id'] =
    'tradingview.com';
  private _userId: ChartingLibraryWidgetOptions['user_id'] = 'public_user_id';
  private _fullscreen: ChartingLibraryWidgetOptions['fullscreen'] = false;
  private _autosize: ChartingLibraryWidgetOptions['autosize'] = true;
  private _containerId: ChartingLibraryWidgetOptions['container_id'] =
    'tv_chart_container';
  private _tvWidget: IChartingLibraryWidget | null = null;

  @Input()
  set symbol(symbol: ChartingLibraryWidgetOptions['symbol']) {
    this._symbol = symbol || this._symbol;
  }

  @Input()
  set interval(interval: ChartingLibraryWidgetOptions['interval']) {
    this._interval = interval || this._interval;
  }

  @Input()
  set datafeedUrl(datafeedUrl: string) {
    this._datafeedUrl = datafeedUrl || this._datafeedUrl;
  }

  @Input()
  set libraryPath(libraryPath: ChartingLibraryWidgetOptions['library_path']) {
    this._libraryPath = libraryPath || this._libraryPath;
  }

  @Input()
  set chartsStorageUrl(
    chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url']
  ) {
    this._chartsStorageUrl = chartsStorageUrl || this._chartsStorageUrl;
  }

  @Input()
  set chartsStorageApiVersion(
    chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version']
  ) {
    this._chartsStorageApiVersion =
      chartsStorageApiVersion || this._chartsStorageApiVersion;
  }

  @Input()
  set clientId(clientId: ChartingLibraryWidgetOptions['client_id']) {
    this._clientId = clientId || this._clientId;
  }

  @Input()
  set userId(userId: ChartingLibraryWidgetOptions['user_id']) {
    this._userId = userId || this._userId;
  }

  @Input()
  set fullscreen(fullscreen: ChartingLibraryWidgetOptions['fullscreen']) {
    this._fullscreen = fullscreen || this._fullscreen;
  }

  @Input()
  set autosize(autosize: ChartingLibraryWidgetOptions['autosize']) {
    this._autosize = autosize || this._autosize;
  }

  @Input()
  set containerId(containerId: ChartingLibraryWidgetOptions['container_id']) {
    this._containerId = containerId || this._containerId;
  }

  constructor(private chartService: ChartService) {
    this.api = {
      onReady: this.chartService.onReady.bind(this.chartService),
      searchSymbols: this.chartService.searchSymbols.bind(this.chartService),
      resolveSymbol: this.chartService.resolveSymbol.bind(this.chartService),
      getBars: this.chartService.getBars.bind(this.chartService),
      subscribeBars: this.chartService.subscribeBars.bind(this.chartService),
      unsubscribeBars: this.chartService.unsubscribeBars.bind(
        this.chartService
      ),
      getServerTime: this.chartService.getServerTime.bind(this.chartService),
    };
  }

  ngOnInit() {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      theme: 'Dark',
      symbol: this._symbol,
      datafeed: this.api,
      interval: this._interval,
      container_id: this._containerId,
      library_path: this._libraryPath,
      locale: 'en',
      disabled_features: ['use_localstorage_for_settings', 'date_range'],
      enabled_features: ['study_templates'],
      charts_storage_url: this._chartsStorageUrl,
      charts_storage_api_version: this._chartsStorageApiVersion,
      client_id: this._clientId,
      user_id: this._userId,
      fullscreen: this._fullscreen,
      autosize: this._autosize,
    };

    const tvWidget = new widget(widgetOptions);
    this._tvWidget = tvWidget;

    tvWidget.onChartReady(() => {
      const button = tvWidget.createButton()[0];
      console.log(button);
      button.setAttribute('title', 'Click to show a notification popup');
      button.classList.add('apply-common-tooltip');
      button.addEventListener('click', () =>
        tvWidget.showNoticeDialog({
          title: 'Notification',
          body: 'TradingView Charting Library API works correctly',
          callback: () => {
            console.log('Noticed!');
          },
        })
      );
      button.innerHTML = 'Check API';
      console.log(
        tvWidget,
        tvWidget.activeChart(),
        tvWidget.activeChart().resolution()
      );

      (window as any).testChart = tvWidget.activeChart();
      // tvWidget.activeChart().resolution
      // setTimeout(() => {
      //   tvWidget.activeChart().setResolution('W', () => {
      //     console.log('set');
      //   })
      // }, 10000)
    });
  }

  ngOnDestroy() {
    if (this._tvWidget !== null) {
      this._tvWidget.remove();
      this._tvWidget = null;
    }
  }
}
