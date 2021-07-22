import { LicenseWithRules, ZeroLicense } from './License';

const licenses: { [key: string]: { [key: string]: LicenseWithRules | ZeroLicense } } = {
        PL: {
            'CC0': {
                link: 'https://creativecommons.org/publicdomain/zero/1.0/legalcode.pl',
                secondLink: 'https://creativecommons.org/publicdomain/zero/1.0/legalcode.pl',
                description: {
                    name: 'Brak praw autorskich.',
                    description: 'Osoba, która opatrzyła utwór tym oświadczeniem, przekazała go do domeny publicznej, zrzekając się wykonywania wszelkich praw do utworu wynikających z prawa autorskiego, włączając w to wszelkie prawa powiązane i prawa pokrewne, w zakresie dozwolonym przez prawo, na obszarze całego świata. Możesz zwielokrotniać, zmieniać, rozpowszechniać i wykonywać utwór, nawet w celu komercyjnym bez pytania o zgodę.'
                }
            },
            'CCBY': {
                link: 'https://creativecommons.org/licenses/by/4.0/legalcode.pl',
                secondLink: 'https://creativecommons.org/licenses/by/4.0/deed.pl',
                allowed: [
                    {
                        name: 'Dzielenie się',
                        description: 'kopiuj i rozpowszechniaj utwór w dowolnym medium i formacie.'
                    },
                    {
                        name: 'Adaptacje',
                        description: 'remiksuj, zmieniaj i twórz na bazie utworu dla dowolnego celu, także komercyjnego. Licencjodawca nie może odwołać udzielonych praw, o ile są przestrzegane warunki licencji.'
                    },
                ],
                conditions: [
                    {
                        name: 'Uznanie autorstwa',
                        description: 'Utwór należy odpowiednio oznaczyć, podać link do licencji i wskazać jeśli zostały dokonane w nim zmiany. Możesz to zrobić w dowolny, rozsądny sposób, o ile nie sugeruje to udzielania przez licencjodawcę poparcia dla Ciebie lub sposobu, w jaki wykorzystujesz ten utwór.'
                    },
                    {
                        name: 'Brak dodatkowych ograniczeń',
                        description: 'Nie możesz korzystać ze środków prawnych lub technologicznych, które ograniczają innych w korzystaniu z utworu na warunkach określonych w licencji.'
                    },
                ]
            },
            'CCBY-SA': {
                link: 'https://creativecommons.org/licenses/by-sa/4.0/legalcode.pl',
                secondLink: 'https://creativecommons.org/licenses/by-sa/4.0/deed.pl',
                allowed: [
                    {
                        name: 'Dzielenie się',
                        description: 'kopiuj i rozpowszechniaj utwór w dowolnym medium i formacie.'
                    },
                    {
                        name: 'Adaptacje',
                        description: 'remiksuj, zmieniaj i twórz na bazie utworu dla dowolnego celu, także komercyjnego. Licencjodawca nie może odwołać udzielonych praw, o ile są przestrzegane warunki licencji.'
                    },
                ],
                conditions: [
                    {
                        name: 'Uznanie autorstwa',
                        description: 'Utwór należy odpowiednio oznaczyć, podać link do licencji i wskazać jeśli zostały dokonane w nim zmiany. Możesz to zrobić w dowolny, rozsądny sposób, o ile nie sugeruje to udzielania przez licencjodawcę poparcia dla Ciebie lub sposobu, w jaki wykorzystujesz ten utwór.'
                    },
                    {
                        name: 'Na tych samych warunkach',
                        description: 'Remiksując utwór, przetwarzając go lub tworząc na jego podstawie, należy swoje dzieło rozpowszechniać na tej samej licencji, co oryginał.'
                    },
                    {
                        name: 'Brak dodatkowych ograniczeń',
                        description: 'Nie możesz korzystać ze środków prawnych lub technologicznych, które ograniczają innych w korzystaniu z utworu na warunkach określonych w licencji.'
                    },
                ]
            },
            'CCBY-NC': {
                link: 'https://creativecommons.org/licenses/by-nc/4.0/legalcode.pl',
                secondLink: 'https://creativecommons.org/licenses/by-nc/4.0/deed.pl',
                allowed: [
                    {
                        name: 'Dzielenie się',
                        description: 'kopiuj i rozpowszechniaj utwór w dowolnym medium i formacie.'
                    },
                    {
                        name: 'Adaptacje',
                        description: 'remiksuj, zmieniaj i twórz na bazie utworu dla dowolnego celu, także komercyjnego. Licencjodawca nie może odwołać udzielonych praw, o ile są przestrzegane warunki licencji.'
                    },
                ],
                conditions: [
                    {
                        name: 'Uznanie autorstwa',
                        description: 'Utwór należy odpowiednio oznaczyć, podać link do licencji i wskazać jeśli zostały dokonane w nim zmiany. Możesz to zrobić w dowolny, rozsądny sposób, o ile nie sugeruje to udzielania przez licencjodawcę poparcia dla Ciebie lub sposobu, w jaki wykorzystujesz ten utwór.'
                    },
                    {
                        name: 'Użycie niekomercyjne',
                        description: 'Nie należy wykorzystywać utworu do celów komercyjnych.'
                    },
                    {
                        name: 'Brak dodatkowych ograniczeń',
                        description: 'Nie możesz korzystać ze środków prawnych lub technologicznych, które ograniczają innych w korzystaniu z utworu na warunkach określonych w licencji.'
                    },
                ]
            },
            'CCBY-NC-SA': {
                link: 'https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.pl/by/4.0/legalcode.pl',
                secondLink: 'https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.pl/by/4.0/deed.pl',
                allowed: [
                    {
                        name: 'Dzielenie się',
                        description: 'kopiuj i rozpowszechniaj utwór w dowolnym medium i formacie.'
                    },
                    {
                        name: 'Adaptacje',
                        description: 'remiksuj, zmieniaj i twórz na bazie utworu dla dowolnego celu, także komercyjnego. Licencjodawca nie może odwołać udzielonych praw, o ile są przestrzegane warunki licencji.'
                    },
                ],
                conditions: [
                    {
                        name: 'Uznanie autorstwa',
                        description: 'Utwór należy odpowiednio oznaczyć, podać link do licencji i wskazać jeśli zostały dokonane w nim zmiany. Możesz to zrobić w dowolny, rozsądny sposób, o ile nie sugeruje to udzielania przez licencjodawcę poparcia dla Ciebie lub sposobu, w jaki wykorzystujesz ten utwór.'
                    },
                    {
                        name: 'Użycie niekomercyjne',
                        description: 'Nie należy wykorzystywać utworu do celów komercyjnych.'
                    },
                    {
                        name: 'Na tych samych warunkach',
                        description: 'Remiksując utwór, przetwarzając go lub tworząc na jego podstawie, należy swoje dzieło rozpowszechniać na tej samej licencji, co oryginał.'
                    },
                    {
                        name: 'Brak dodatkowych ograniczeń',
                        description: 'Nie możesz korzystać ze środków prawnych lub technologicznych, które ograniczają innych w korzystaniu z utworu na warunkach określonych w licencji.'
                    },
                ]
            },
            'CCBY-ND': {
                link: 'https://creativecommons.org/licenses/by-nd/4.0/legalcode.pl',
                secondLink: 'https://creativecommons.org/licenses/by-nd/4.0/deed.pl',
                allowed: [
                    {
                        name: 'Dzielenie się',
                        description: 'kopiuj i rozpowszechniaj utwór w dowolnym medium i formacie.'
                    },
                    {
                        name: 'Adaptacje',
                        description: 'remiksuj, zmieniaj i twórz na bazie utworu dla dowolnego celu, także komercyjnego. Licencjodawca nie może odwołać udzielonych praw, o ile są przestrzegane warunki licencji.'
                    },
                ],
                conditions: [
                    {
                        name: 'Uznanie autorstwa',
                        description: 'Utwór należy odpowiednio oznaczyć, podać link do licencji i wskazać jeśli zostały dokonane w nim zmiany. Możesz to zrobić w dowolny, rozsądny sposób, o ile nie sugeruje to udzielania przez licencjodawcę poparcia dla Ciebie lub sposobu, w jaki wykorzystujesz ten utwór.'
                    },
                    {
                        name: 'Bez utworów zależnych',
                        description: 'Remiksując, przetwarzając lub tworząc na podstawie utworu, nie wolno rozpowszechniać zmodyfikowanych treści.'
                    },
                    {
                        name: 'Brak dodatkowych ograniczeń',
                        description: 'Nie możesz korzystać ze środków prawnych lub technologicznych, które ograniczają innych w korzystaniu z utworu na warunkach określonych w licencji.'
                    },
                ]
            },
            'CCBY-NC-ND': {
                link: 'https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode.pl',
                secondLink: 'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.pl',
                allowed: [
                    {
                        name: 'Dzielenie się',
                        description: 'kopiuj i rozpowszechniaj utwór w dowolnym medium i formacie.'
                    },
                    {
                        name: 'Adaptacje',
                        description: 'remiksuj, zmieniaj i twórz na bazie utworu dla dowolnego celu, także komercyjnego. Licencjodawca nie może odwołać udzielonych praw, o ile są przestrzegane warunki licencji.'
                    },
                ],
                conditions: [
                    {
                        name: 'Uznanie autorstwa',
                        description: 'Utwór należy odpowiednio oznaczyć, podać link do licencji i wskazać jeśli zostały dokonane w nim zmiany. Możesz to zrobić w dowolny, rozsądny sposób, o ile nie sugeruje to udzielania przez licencjodawcę poparcia dla Ciebie lub sposobu, w jaki wykorzystujesz ten utwór.'
                    },
                    {
                        name: 'Użycie niekomercyjne',
                        description: 'Nie należy wykorzystywać utworu do celów komercyjnych.'
                    },
                    {
                        name: 'Bez utworów zależnych',
                        description: 'Remiksując, przetwarzając lub tworząc na podstawie utworu, nie wolno rozpowszechniać zmodyfikowanych treści.'
                    },
                    {
                        name: 'Brak dodatkowych ograniczeń',
                        description: 'Nie możesz korzystać ze środków prawnych lub technologicznych, które ograniczają innych w korzystaniu z utworu na warunkach określonych w licencji.'
                    },
                ]
            },
        },
        EN: {
            'CC0': {
                link: 'https://creativecommons.org/publicdomain/zero/1.0/legalcode',
                secondLink: 'https://creativecommons.org/publicdomain/zero/1.0/deed',
                description: {
                    name: 'No Copyright',
                    description: 'The person who associated a work with this deed has dedicated the work to the public domain by waiving all of his or her rights to the work worldwide under copyright law, including all related and neighboring rights, to the extent allowed by law. You can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission. '
                }
            },
            'CCBY': {
                link: 'https://creativecommons.org/licenses/by/4.0/legalcode',
                secondLink: 'https://creativecommons.org/licenses/by/4.0/deed',
                allowed: [
                    {
                        name: 'Share',
                        description: 'copy and redistribute the material in any medium or format'
                    },
                    {
                        name: 'Adapt',
                        description: 'remix, transform, and build upon the material for any purpose, even commercially. \n' +
                            'The licensor cannot revoke these freedoms as long as you follow the license terms. \n'
                    },
                ],
                conditions: [
                    {
                        name: 'Attribution',
                        description: 'You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use. '
                    },
                    {
                        name: 'No additional restrictions',
                        description: 'You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.'
                    },
                ]
            },
            'CCBY-SA': {
                link: 'https://creativecommons.org/licenses/by-sa/4.0/legalcode',
                secondLink: 'https://creativecommons.org/licenses/by-sa/4.0/deed',
                allowed: [
                    {
                        name: 'Share',
                        description: 'copy and redistribute the material in any medium or format'
                    },
                    {
                        name: 'Adapt',
                        description: 'remix, transform, and build upon the material for any purpose, even commercially. \n' +
                            'The licensor cannot revoke these freedoms as long as you follow the license terms. \n'
                    },
                ],
                conditions: [
                    {
                        name: 'Attribution',
                        description: 'You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use. '
                    },
                    {
                        name: 'ShareAlike',
                        description: 'If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.'
                    },
                    {
                        name: 'No additional restrictions',
                        description: 'You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.'
                    },
                ]
            },
            'CCBY-NC': {
                link: 'https://creativecommons.org/licenses/by-nc/4.0/legalcode',
                secondLink: 'https://creativecommons.org/licenses/by-nc/4.0/deed',
                allowed: [
                    {
                        name: 'Share',
                        description: 'copy and redistribute the material in any medium or format'
                    },
                    {
                        name: 'Adapt',
                        description: 'remix, transform, and build upon the material for any purpose, even commercially. \n' +
                            'The licensor cannot revoke these freedoms as long as you follow the license terms. \n'
                    },
                ],
                conditions: [
                    {
                        name: 'Attribution',
                        description: 'You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use. '
                    },
                    {
                        name: 'NonCommercial',
                        description: 'You may not use the material for commercial purposes. '
                    },
                    {
                        name: 'No additional restrictions',
                        description: 'You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.'
                    },
                ]
            },
            'CCBY-NC-SA': {
                link: 'https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.pl/by/4.0/legalcode',
                secondLink: 'https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.pl/by/4.0/deed',
                allowed: [
                    {
                        name: 'Share',
                        description: 'copy and redistribute the material in any medium or format'
                    },
                    {
                        name: 'Adapt',
                        description: 'remix, transform, and build upon the material for any purpose, even commercially. \n' +
                            'The licensor cannot revoke these freedoms as long as you follow the license terms. \n'
                    },
                ],
                conditions: [
                    {
                        name: 'Attribution',
                        description: 'You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use. '
                    },
                    {
                        name: 'NonCommercial',
                        description: 'You may not use the material for commercial purposes. '
                    },
                    {
                        name: 'ShareAlike',
                        description: 'If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.'
                    },
                    {
                        name: 'No additional restrictions',
                        description: 'You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.'
                    },
                ]
            },
            'CCBY-ND': {
                link: 'https://creativecommons.org/licenses/by-nd/4.0/legalcode',
                secondLink: 'https://creativecommons.org/licenses/by-nd/4.0/deed',
                allowed: [
                    {
                        name: 'Share',
                        description: 'copy and redistribute the material in any medium or format'
                    },
                    {
                        name: 'Adapt',
                        description: 'remix, transform, and build upon the material for any purpose, even commercially. \n' +
                            'The licensor cannot revoke these freedoms as long as you follow the license terms. \n'
                    },
                ],
                conditions: [
                    {
                        name: 'Attribution',
                        description: 'You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use. '
                    },
                    {
                        name: 'NoDerivatives',
                        description: 'If you remix, transform, or build upon the material, you may not distribute the modified material. '
                    },
                    {
                        name: 'No additional restrictions',
                        description: 'You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.'
                    },
                ]
            },
            'CCBY-NC-ND': {
                link: 'https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode',
                secondLink: 'https://creativecommons.org/licenses/by-nc-nd/4.0/deed',
                allowed: [
                    {
                        name: 'Share',
                        description: 'copy and redistribute the material in any medium or format'
                    },
                    {
                        name: 'Adapt',
                        description: 'remix, transform, and build upon the material for any purpose, even commercially. \n' +
                            'The licensor cannot revoke these freedoms as long as you follow the license terms. \n'
                    },
                ],
                conditions: [
                    {
                        name: 'Attribution',
                        description: 'You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use. '
                    },
                    {
                        name: 'NonCommercial',
                        description: 'You may not use the material for commercial purposes. '
                    },
                    {
                        name: 'NoDerivatives',
                        description: 'If you remix, transform, or build upon the material, you may not distribute the modified material. '
                    },
                    {
                        name: 'No additional restrictions',
                        description: 'You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.'
                    },
                    {
                        name: 'Uznanie autorstwa',
                        description: 'Utwór należy odpowiednio oznaczyć, podać link do licencji i wskazać jeśli zostały dokonane w nim zmiany. Możesz to zrobić w dowolny, rozsądny sposób, o ile nie sugeruje to udzielania przez licencjodawcę poparcia dla Ciebie lub sposobu, w jaki wykorzystujesz ten utwór.'
                    },
                    {
                        name: 'Użycie niekomercyjne',
                        description: 'Nie należy wykorzystywać utworu do celów komercyjnych.'
                    },
                    {
                        name: 'Bez utworów zależnych',
                        description: 'Remiksując, przetwarzając lub tworząc na podstawie utworu, nie wolno rozpowszechniać zmodyfikowanych treści.'
                    },
                    {
                        name: 'Brak dodatkowych ograniczeń',
                        description: 'Nie możesz korzystać ze środków prawnych lub technologicznych, które ograniczają innych w korzystaniu z utworu na warunkach określonych w licencji.'
                    },
                ]
            },
        }
    }
;

export const LICENSES = licenses;
