import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ChartingLibraryWidgetOptions,
  IBasicDataFeed,
  IChartingLibraryWidget,
  ResolutionString,
  widget,
} from 'src/assets/charting_library/charting_library.min';
import { ChartService } from './chart.service';

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.scss'],
})
export class ChartContainerComponent implements OnInit, OnDestroy {
  private api: IBasicDataFeed;
  private symbol: ChartingLibraryWidgetOptions['symbol'] = 'BTCUSDT';
  private interval: ChartingLibraryWidgetOptions['interval'] =
    '3' as ResolutionString;
  private libraryPath: ChartingLibraryWidgetOptions['library_path'] =
    '/assets/charting_library/';
  private chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'] =
    'https://saveload.tradingview.com';
  private chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'] =
    '1.1';
  private clientId: ChartingLibraryWidgetOptions['client_id'] =
    'tradingview.com';
  private userId: ChartingLibraryWidgetOptions['user_id'] = 'public_user_id';
  private fullscreen: ChartingLibraryWidgetOptions['fullscreen'] = false;
  private autosize: ChartingLibraryWidgetOptions['autosize'] = true;
  private containerId: ChartingLibraryWidgetOptions['container_id'] =
    'tv_chart_container';
  public tvWidget: IChartingLibraryWidget | null = null;

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

  ngOnInit(): void {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      theme: 'Dark',
      symbol: this.symbol,
      datafeed: this.api,
      interval: this.interval,
      container_id: this.containerId,
      library_path: this.libraryPath,
      locale: 'en',
      disabled_features: ['use_localstorage_for_settings', 'date_range'],
      enabled_features: ['study_templates'],
      charts_storage_url: this.chartsStorageUrl,
      charts_storage_api_version: this.chartsStorageApiVersion,
      client_id: this.clientId,
      user_id: this.userId,
      fullscreen: this.fullscreen,
      autosize: this.autosize,
    };

    const tvWidget = new widget(widgetOptions);
    this.tvWidget = tvWidget;

    tvWidget.onChartReady(() => {
      const button = tvWidget.createButton()[0];
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
    });
  }

  public onResolutionChange(res: string): void {
    if (this.tvWidget) {
      this.tvWidget.activeChart().setResolution(res, () => {});
    }
  }

  ngOnDestroy(): void {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  }
}
