import { Pipe, PipeTransform, KeyValueDiffers } from '@angular/core';
import { KeyValuePipe } from '@angular/common';

/**
 * KeyvaluePipe extension - preserves default sort order of keyvalue object
 * @example
 * <div *ngFor="let item of items | keyvalueOrder">{{ item.key }}: {{ item.value }}</div>
 */
@Pipe({
  name: 'keyvalueOrder',
})
export class KeyvalueOrderPipe implements PipeTransform {
  /**
   * @ignore
   */
  constructor(public differs: KeyValueDiffers) {}

  /**
   * Transforms input preserving default order
   * @param {any} object
   * @returns {Array<any>}
   */
  transform(object: any): Array<any> {
    const pipe = new KeyValuePipe(this.differs);
    return pipe.transform(object, (a, b) => 0);
  }
}
