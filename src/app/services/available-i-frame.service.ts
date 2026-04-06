import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
/**
 * Available IFrame Service handles available iframe
 */
export class AvailableIFrameService {
  private iFrames: ElementRef<HTMLIFrameElement>[] = [];

  /**
   * Appends visible iframe to array
   * @param element
   * @returns {number}
   */
  append(element: ElementRef<HTMLIFrameElement>): number {
    return this.iFrames.push(element) - 1;
  }

  /**
   * Remove iframe from array
   * @param index
   */
  remove(index: number): void {
    this.iFrames.splice(index, 1);
  }

  /**
   * Returns visible iFrames
   * @returns {ElementRef<HTMLIFrameElement>[]}
   */
  getAvailable(): ElementRef<HTMLIFrameElement>[] {
    return [...this.iFrames];
  }
}
