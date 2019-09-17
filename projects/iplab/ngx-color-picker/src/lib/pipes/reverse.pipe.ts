import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'reverse' })
export class ReversePipe implements PipeTransform {
    transform(arr: Array<any>, isReversed: boolean = true) {
        if (isReversed) {
            return arr.slice().reverse();
        }

        return arr;
    }
}
