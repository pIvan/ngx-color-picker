import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'chunks',
    standalone: true
})
export class ChunksPipe implements PipeTransform {
    transform<T>(arr: T[], chunkSize: number): T[][] {
        if (!Array.isArray(arr) || chunkSize <= 0) {
            return [];
        }
        const chunks: T[][] = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            chunks.push(arr.slice(i, i + chunkSize));
        }
        return chunks;
    }
}
