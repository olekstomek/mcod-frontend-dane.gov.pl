export interface SearchSuggestListboxOption {
    title: string;
    url: string;
    areaTranslationKey?: string;
}

// TODO: move or remove after merge with feat-ux-changes
export enum SearchAdvancedSettings {
    ANY = 'any',
    ALL = 'all',
    EXACT = 'exact',
    SYNONYM = 'synonyms'
}
