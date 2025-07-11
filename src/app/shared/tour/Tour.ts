import { StorageSerializer } from 'ngx-localstorage/lib/interfaces/storage-serializer';

export interface Tour {
  name: string;
  id: string;
  items: Array<TourItem>;
  progress?: TourProgress;
}

export class TourProgress implements StorageSerializer<TourProgress> {
  /**
   * Tour id
   * @type {string}
   * @private
   */
  private _tourId: string;

  /**
   * Tour id
   * @returns {string}
   */
  get tourId(): string {
    return this._tourId;
  }

  /**
   * Current step index
   * @type {number}
   * @private
   */
  private _currentStepIndex: number;

  /**
   * Current step index
   * @returns {number}
   */
  get currentStepIndex(): number {
    return this._currentStepIndex;
  }

  /**
   * Current step route
   * @type {string}
   * @private
   */
  private _currentStepRoute: string;

  /**
   * Current step route
   * @returns {string}
   */
  get currentStepRoute(): string {
    return this._currentStepRoute;
  }

  /**
   * Creates TourProgress from raw
   * @param id
   * @param currentStepIndex
   * @param currentStepRoute
   * @returns {TourProgress}
   */
  static fromRaw(id: string, currentStepIndex: number, currentStepRoute: string): TourProgress {
    const currentTour = new TourProgress();
    currentTour._tourId = id;
    currentTour._currentStepIndex = currentStepIndex;
    currentTour._currentStepRoute = currentStepRoute;
    return currentTour;
  }

  /**
   * Deserializes TourProgress
   * @param storedValue
   * @returns {TourProgress | null}
   */
  deserialize(storedValue: string): TourProgress {
    const raw = JSON.parse(storedValue);
    if (!raw) {
      return null;
    }
    return TourProgress.fromRaw(raw.id, raw.currentStepIndex, raw.currentStepRoute);
  }

  /**
   * Serializes tour progress
   * @param value
   * @returns {string}
   */
  serialize(value: TourProgress): string {
    return JSON.stringify({ id: this.tourId, currentStepIndex: this.currentStepIndex, currentStepRoute: this.currentStepRoute });
  }
}

export interface ShepardStep {
  title: string;
  text: string;
  attachTo: {
    element: string;
    on: TourItemPosition;
  };
  buttons: Array<any>;
  id: string;
}

export interface TourItem {
  name: string;
  content: string;
  route: string;
  css_selector: string;
  is_optional: boolean;
  is_clickable: boolean;
  is_expandable: boolean;
  expanded?: boolean;
  position: TourItemPosition;
}

export enum TourItemPosition {
  top = 'top',
  bottom = 'bottom',
  left = 'left',
  right = 'right',
}
