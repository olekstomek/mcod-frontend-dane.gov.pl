import { PipeTransform, Pipe } from '@angular/core';

/**
 * Pipe that returns keys of an object
 * @example
 * <div *ngFor="let key of items | keys">{{ key }}: {{ items[key] }}</div>
 */
@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
    transform(value, args: string[]): any {
        return value && Object.keys(value);
    }
}
