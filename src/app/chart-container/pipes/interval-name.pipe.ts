import { Pipe, PipeTransform } from '@angular/core';
import { intervals } from '../chart-service.service';

@Pipe({
  name: 'intervalName'
})
export class IntervalNamePipe implements PipeTransform {

  transform(value: string): unknown {
    return intervals[value];
  }

}
