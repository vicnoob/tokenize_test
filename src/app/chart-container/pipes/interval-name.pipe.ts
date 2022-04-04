import { Pipe, PipeTransform } from '@angular/core';
import { intervals } from '../chart.helper';

@Pipe({
  name: 'intervalName'
})
export class IntervalNamePipe implements PipeTransform {

  transform(value: string): unknown {
    return intervals[value];
  }

}
