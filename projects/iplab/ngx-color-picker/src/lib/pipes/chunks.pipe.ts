import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'chunks',
    standalone: true
})
export class ChunksPipe implements PipeTransform {
    transform(arr: any, chunkSize: number) {
        return arr.reduce((prev, cur, i) => (i % chunkSize) ? prev : prev.concat([arr.slice(i, i + chunkSize)]), []);
    }
}
