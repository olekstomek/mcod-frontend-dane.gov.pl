import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiConfig } from '@app/services/api';

import { ServiceTestbed } from '@app/services/tests/service.testbed';
import { ScheduleService } from '@app/user/schedule/tabs/schedule.service';

const userSchedulesMock = {
    'meta': {
        'language': 'pl',
        'server_time': '2020-11-30T12:55:35Z',
        'path': '/1.4/auth/user_schedules/16',
        'params': {'include': 'schedule,user_schedule_item'},
        'notifications': {'datasets': {'new': 5}, 'queries': {'new': 85}},
        'relative_uri': '/1.4/auth/user_schedules/16?include=schedule,user_schedule_item'
    },
    'data': {
        'relationships': {
            'user': {'data': {'id': '2573', 'type': 'user'}},
            'period': {'data': {'id': '13', 'type': 'period'}, 'links': {'related': 'http://api.dev.dane.gov.pl/1.4/auth/periods/13'}},
            'schedule': {
                'data': {'id': '13', 'type': 'schedule'},
                'links': {'related': 'http://api.dev.dane.gov.pl/1.4/auth/schedules/13'}
            },
            'user_schedule_items': {
                'links': {'related': 'http://api.dev.dane.gov.pl/1.4/auth/user_schedules/16/items'},
                'meta': {'count': 2}
            }
        },
        'attributes': {
            'email': 'pelnomocnik1@gmail.com',
            'institution': 'Ministerstwo Cyfryzacji',
            'items_count': 2,
            'is_ready': false,
            'recommended_items_count': 1,
            'implemented_items_count': 2,
            'state': 'implemented'
        },
        'id': '16',
        'links': {'self': 'http://api.dev.dane.gov.pl/1.4/auth/user_schedules/16'},
        'type': 'user_schedule'
    },
    'jsonapi': {'version': '1.0'},
    'included': [{
        'relationships': {
            'period': {
                'data': {'id': '13', 'type': 'period'},
                'links': {'related': 'http://api.dev.dane.gov.pl/1.4/auth/periods/13'}
            },
            'user_schedules': {
                'links': {'related': 'http://api.dev.dane.gov.pl/1.4/auth/schedules/13/user_schedules'},
                'meta': {'count': 1}
            },
            'user_schedule_items': {
                'links': {'related': 'http://api.dev.dane.gov.pl/1.4/auth/schedules/13/user_schedule_items'},
                'meta': {'count': 2}
            }
        },
        'attributes': {
            'period': 'II p\u00f3\u0142rocze 2026',
            'end_date': '2020-11-01',
            'new_end_date': '2020-11-01',
            'link': '',
            'state': 'implemented',
            'name': 'Harmonogram otwierania danych na II p\u00f3\u0142rocze 2026'
        },
        'id': '13',
        'links': {'self': 'http://api.dev.dane.gov.pl/1.4/auth/schedules/13'},
        'type': 'schedule'
    }, {
        'relationships': {
            'user': {'data': {'id': '2573', 'type': 'user'}},
            'schedule': {
                'data': {'id': '13', 'type': 'schedule'},
                'links': {'related': 'http://api.dev.dane.gov.pl/1.4/auth/schedules/13'}
            },
            'user_schedule': {
                'data': {'id': '16', 'type': 'user_schedule'},
                'links': {'related': 'http://api.dev.dane.gov.pl/1.4/auth/user_schedules/16'}
            },
            'comments': {'links': {'related': 'http://api.dev.dane.gov.pl/1.4/auth/user_schedule_items/51/comments'}, 'meta': {'count': 0}}
        },
        'attributes': {
            'institution': 'Urz\u0105d Miejski w B\u0142oniu 30.11.2020',
            'institution_unit': 'Urz\u0105d Miejski w B\u0142oniu 30.11.2020',
            'dataset_title': 'xyz - admin update 30.11.2020',
            'created': '2020-11-18',
            'format': 'csv,xlsx',
            'is_new': false,
            'is_openness_score_increased': true,
            'is_quality_improved': false,
            'description': 'Uwagi 30.11.2020',
            'state': 'implemented',
            'is_accepted': false,
            'is_resource_added': true,
            'is_resource_added_notes': 'Komentarz do realizacji 30.11.2020',
            'resource_link': 'http://example.com'
        },
        'id': '51',
        'links': {'self': 'http://api.dev.dane.gov.pl/1.4/auth/user_schedule_items/51'},
        'type': 'user_schedule_item'
    }, {
        'relationships': {
            'user': {'data': {'id': '2573', 'type': 'user'}},
            'schedule': {
                'data': {'id': '13', 'type': 'schedule'},
                'links': {'related': 'http://api.dev.dane.gov.pl/1.4/auth/schedules/13'}
            },
            'user_schedule': {
                'data': {'id': '16', 'type': 'user_schedule'},
                'links': {'related': 'http://api.dev.dane.gov.pl/1.4/auth/user_schedules/16'}
            },
            'comments': {'links': {'related': 'http://api.dev.dane.gov.pl/1.4/auth/user_schedule_items/52/comments'}, 'meta': {'count': 0}}
        },
        'attributes': {
            'institution': 'Urz\u0105d Miejski w B\u0142oniu',
            'institution_unit': 'Instytut Badawczy Dr\u00f3g i Most\u00f3w',
            'dataset_title': 'aaaa',
            'created': '2020-11-18',
            'format': 'doc',
            'is_new': true,
            'is_openness_score_increased': true,
            'is_quality_improved': false,
            'description': 'brak uwag od pe\u0142nomocnika',
            'state': 'implemented',
            'is_accepted': true,
            'is_resource_added': true,
            'is_resource_added_notes': 'komentarz pe\u0142nomocnika do realizacja i linku',
            'resource_link': 'http://www.example.com?q=pelnomocnik1&realizacja=tak'
        },
        'id': '52',
        'links': {'self': 'http://api.dev.dane.gov.pl/1.4/auth/user_schedule_items/52'},
        'type': 'user_schedule_item'
    }],
    'links': {'self': 'http://api.dev.dane.gov.pl/1.4/auth/user_schedules/16?include=schedule,user_schedule_item'}
};

describe('ApplicationsService', () => {

    let service: ScheduleService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule(ServiceTestbed.module(ScheduleService));

        service = TestBed.inject(ScheduleService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch schedules item for current schedule from user schedules endpoint when user is admin', () => {
        service.getSchedulesItemForCurrentSchedule(1, true, 1)
            .subscribe(() => {

            });
        expect(httpMock.expectOne(`/api${ApiConfig.userSchedules}/${1}?include=schedule,user_schedule_item`)).toBeTruthy();
    });


    it('should fetch schedules item for current schedule from schedules endpoint when user isn\'t admin', () => {
        service.getSchedulesItemForCurrentSchedule(1, false, 1)
            .subscribe(() => {
            });
        expect(httpMock.expectOne(`/api${ApiConfig.schedules}/${1}/user_schedule_items?include=schedule,user_schedule`)).toBeTruthy();
    });

    it('should map response to UserSchedule', done => {
        service.getSchedulesItemForCurrentSchedule(1, true, 1)
            .subscribe((data) => {
                expect(data).toEqual({
                    'completed': false,
                    'data': [
                        {
                            'accepted': 'Tak',
                            'creationDate': '2020-11-18',
                            'datasets': 'aaaa',
                            'department': 'Instytut Badawczy Dróg i Mostów',
                            'finished': 'Tak',
                            'id': 52,
                            'institution': 'Urząd Miejski w Błoniu'
                        },
                        {
                            'accepted': 'Nie',
                            'creationDate': '2020-11-18',
                            'datasets': 'xyz - admin update 30.11.2020',
                            'department': 'Urząd Miejski w Błoniu 30.11.2020',
                            'finished': 'Tak',
                            'id': 51,
                            'institution': 'Urząd Miejski w Błoniu 30.11.2020'
                        }
                    ],
                    'id': 13,
                    'link': '',
                    'newPlanningEndDate': '2020-11-01',
                    'planningEndDate': '2020-11-01',
                    'representativeEmail': 'pelnomocnik1@gmail.com',
                    'state': 'implemented',
                    'userScheduleId': '16'
                });
                done();
            });
        const req = httpMock.expectOne(`/api${ApiConfig.userSchedules}/${1}?include=schedule,user_schedule_item`);
        req.flush(userSchedulesMock);
    });
});
