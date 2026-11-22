import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FavouriteIntentStatus, FavouriteIntentValidator } from './favourite-intent-validator';

describe('FavouriteIntentValidator', () => {
  let validator: FavouriteIntentValidator;
  const now = 1_000_000;
  const valid = {
    datasetId: '123',
    returnUrl: '/pl/dataset?page=3&sort=-date#results',
    listPosition: 5,
    createdAt: now - 1000,
  };
  const check = (changes: object) => validator.validate(JSON.stringify({ ...valid, ...changes }), now).status;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    validator = TestBed.inject(FavouriteIntentValidator);
  });

  it('accepts the localized dataset list including filters and fragment', () => {
    expect(check({})).toBe(FavouriteIntentStatus.VALID);
  });

  it.each(['/pl/dataset/123,some-slug?page=2', '/en/dataset/123', '/pl/dataset/123,some-slug#top'])(
    'accepts details of the same dataset %s',
    (returnUrl) => {
      expect(check({ returnUrl })).toBe(FavouriteIntentStatus.VALID);
    },
  );
  it('does nothing when storage has no intent', () => {
    expect(validator.validate(null).status).toBe(FavouriteIntentStatus.NO_INTENT);
  });

  it('rejects missing fields and malformed JSON', () => {
    expect(validator.validate('{').status).toBe(FavouriteIntentStatus.INVALID_FORMAT);
    expect(validator.validate('{}').status).toBe(FavouriteIntentStatus.INCOMPLETE);
  });

  it('checks id, position and timestamp', () => {
    expect(check({ datasetId: '../5' })).toBe(FavouriteIntentStatus.INVALID_FORMAT);
    expect(check({ listPosition: 0 })).toBe(FavouriteIntentStatus.INVALID_FORMAT);
    expect(check({ createdAt: now + 1 })).toBe(FavouriteIntentStatus.INVALID_FORMAT);
    expect(check({ createdAt: 0 })).toBe(FavouriteIntentStatus.INVALID_FORMAT);
    expect(check({ createdAt: 'now' })).toBe(FavouriteIntentStatus.INVALID_FORMAT);
  });

  it('expires after ten minutes', () => {
    expect(check({ createdAt: now - 10 * 60 * 1000 })).toBe(FavouriteIntentStatus.EXPIRED);
  });

  it.each([
    '//evil.com',
    'https://evil.com',
    '/pl\\dataset',
    '/pl/user/login',
    '/pl/dataset/124,some-slug',
    '/pl/dataset/!feedback',
    '/pl/dataset/123,some-slug/resources/5',
    '/pl/dataset/123,slug;a=b',
    '/pl/dataset/123,sl%2Fug',
    '/en/dataset(side:login)',
  ])('rejects unsafe return path %s', (returnUrl) => {
    expect(check({ returnUrl })).toBe(FavouriteIntentStatus.UNSAFE_RETURN_PATH);
  });
});
