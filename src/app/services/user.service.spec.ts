import { HttpHeaders } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, inject, TestBed } from '@angular/core/testing';
import * as jwt from 'jsonwebtoken';

import { ApiConfig } from '@app/services/api';
import { HttpCustomErrorResponse, IRegistration, User } from '@app/services/models';
import { ServiceTestbed } from '@app/services/tests/service.testbed';
import { Role } from '@app/shared/user-permissions/Role';
import { UserService } from './user.service';
import { ApiModel } from './api/api-model';

describe('UserService', () => {

    let injector: TestBed;
    let service: UserService;
    let httpMock: HttpTestingController;

    const userResponse = {
        result:
            {
                'id': 77,
                'attributes': {
                    'email': 'user@example.com',
                    'fullname': 'Jan Kowalski',
                    'token': 'lipsum',
                    'state': 'active'
                }
            }
    };

    beforeEach(() => {
        TestBed.configureTestingModule(ServiceTestbed.module(UserService));


        injector = getTestBed();
        service = injector.get(UserService);
        httpMock = injector.get(HttpTestingController);
        userResponse.result.attributes.token = jwt.sign({
            'sub': '1234567890',
            'name': 'John Doe',
            'iat': Math.floor(Date.now() / 1000),
            'exp': Math.floor(Date.now() / 1000) + (60 * 60)
        }, 'secret');
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', inject([UserService], (userService: UserService) => {
        expect(userService).toBeTruthy();
    }));

    describe('#registerUser', () => {
        it('should return an Observable<T>', done => {
            const newUser: IRegistration = <IRegistration>{
                email: 'user@example.com',
                password1: 'Demo#123',
                password2: 'Demo#123'
            };

            service.registerUser(newUser).subscribe(data => {
                expect(data.result.attributes.email).toBe(newUser.email);
                expect(data).toEqual(userResponse);
                done();
            });

            const req = httpMock.expectOne(service.base_url + ApiConfig.userRegistration);
            expect(req.request.method).toBe('POST');
            req.flush(userResponse);
        });
        it('should throw an error if trying to register without password', done => {
            const newUser: IRegistration = <IRegistration>{
                email: 'user@example.com'
            };
            service.registerUser(newUser)
                .subscribe((next) => {
                    },
                    err => {
                        expect(err.statusText).toBe('Missing password');
                        done();
                    });

            const req = httpMock.expectOne(service.base_url + ApiConfig.userRegistration);
            expect(req.request.method).toBe('POST');
            req.flush({}, {status: 422, statusText: 'Missing password'});
        });
    });

    describe('#resendConfirmationEmail', () => {
        it('should return an Observable<T>', done => {
            const email = 'user@example.com';
            const requestModel = service.prepareAuthParameters({email});

            service.resendConfirmationEmail(email).subscribe(data => {
                expect(data).toBe('');
                done();
            });

            const req = httpMock.expectOne(service.base_url + ApiConfig.userResendEmail);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(requestModel);
            req.flush('');
        });
    });

    describe('#verifyEmail', () => {
        it('should send GET with verification token', done => {
            const resetToken = 'lorem-ipsum';

            service.verifyEmail(resetToken).subscribe(data => {
                expect(data).toBe('');
                done()
            });

            const req = httpMock.expectOne(service.base_url + ApiConfig.userVerifyEmail + '/' + resetToken);
            expect(req.request.method).toBe('GET');
            req.flush('');
        });
    });

    describe('#forgotPass', () => {
        it('should send POST request with email', done => {
            const model = {email: 'user@example.com'};
            const requestModel = service.prepareAuthParameters(model);

            service.forgotPass(model).subscribe(data => {
                expect(data).toBe('');
                done();
            });

            const req = httpMock.expectOne(service.base_url + ApiConfig.userResetPass);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(requestModel);
            req.flush('');
        });
    });
    describe('#resetPass', () => {
        it('should send POST request with new passwords to specific token', done => {
            const resetToken = 'lorem-ipsum';
            const model = {new_password1: 'demo123', new_password2: 'demo123'};
            const requestModel = service.prepareAuthParameters(model);

            service.resetPass(resetToken, model).subscribe(data => {
                expect(data).toBe('');
                done();
            });

            const req = httpMock.expectOne(service.base_url + ApiConfig.userResetPass + '/' + resetToken);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(requestModel);
            req.flush('');
        });
    });

    describe('#login', () => {
        it('should send POST request with user credentials', done => {
            const login = 'demo@mc.gov.pl';
            const pass = 'demo123';
            service.login(login, pass).subscribe(data => {
                expect(data as User).toEqual(jasmine.objectContaining(userResponse.result));
                done();
            });

            const req = httpMock.expectOne(service.base_url + ApiConfig.userLogin);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual({
                data: {
                    attributes: {
                        email: 'demo@mc.gov.pl',
                        password: 'demo123'
                    },
                    type: 'user'
                }
            });
            req.flush({data: userResponse.result});
        });

        it('should throw error for login with incorrect credentials', function (done) {
            service.login('', '').subscribe(
                data => fail('should have failed with the network error'),
                (errorResponse: HttpCustomErrorResponse) => {
                    expect(errorResponse.error).toBeTruthy();
                    done();
                });

            const req = httpMock.expectOne(service.base_url + ApiConfig.userLogin);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual({
                data: {
                    attributes: {
                        email: '',
                        password: ''
                    },
                    type: 'user'
                }
            });
            req.error(new ErrorEvent('Network error', {
                message: '',
            }));
        });
    });


    describe('#getCurrentUser', () => {
        it('get currently logged user details', done => {

            service.getCurrentUser().subscribe(data => {
                expect(data).toStrictEqual(userResponse.result);
                done();
            });

            const req = httpMock.expectOne(service.base_url + ApiConfig.userProfile + '?include=institution,agent_institution');
            expect(req.request.method).toBe('GET');
            expect(req.request.body).toEqual(null);
            const resetToken = 'licksum';

            let headers = new HttpHeaders();
            headers = headers.append('Authorization', `Bearer ${resetToken}`);
            req.flush({data: userResponse.result}, {headers: headers});
        });
        it('should throw error if there is no user logged in', function (done) {
            service.getCurrentUser().subscribe(
                data => fail('should have failed with the network error'),
                (errorResponse: HttpCustomErrorResponse) => {
                    expect(errorResponse.ok).toBeFalsy();
                    expect(errorResponse.error).toBeTruthy();
                    done();
                });

            const req = httpMock.expectOne(service.base_url + ApiConfig.userProfile + '?include=institution,agent_institution');
            expect(req.request.method).toBe('GET');
            expect(req.request.body).toEqual(null);
            req.error(new ErrorEvent('Network error', {
                message: '',
            }));
        });
    });


    describe('#logout', () => {
        it('should send POST request', done => {

            service.logout().subscribe(data => {
                expect(data).toBe('');
                done()
            });

            const req = httpMock.expectOne(service.base_url + ApiConfig.userLogout);
            expect(req.request.method).toBe('POST');
            req.flush('');
        });
    });

    describe('#permission', () => {
        beforeEach(() => {
            spyOn(service, 'isLoggedIn').and.returnValue(true);
        });

        it('should return true when required roles is LOGGED_IN', () => {
            expect(service.hasRequiredRole([Role.LOGGED_IN, Role.EDITOR, Role.OFFICIAL])).toBe(true);
        });

        it('should return true when user is ADMIN and required roles is ADMIN', () => {
            spyOn(service, 'getTokenData').and.returnValue({user: {roles: ['admin']}});

            expect(service.hasRequiredRole([Role.ADMIN])).toBe(true);
        });

        it('should return false when user is EDITOR and required role is ADMIN or OFFICIAL', () => {
            spyOn(service, 'getTokenData').and.returnValue({user: {roles: ['editor']}});

            expect(service.hasRequiredRole([Role.ADMIN, Role.OFFICIAL])).toBe(false);
        });

        it('should return true when user is ADMIN and EDITOR and only EDITOR role is required', () => {
            spyOn(service, 'getTokenData').and.returnValue({user: {roles: ['editor', 'admin']}});

            expect(service.hasRequiredRole([Role.EDITOR, Role.REPRESENTATIVE])).toBe(true);
        });

        it('should return true when user is EDITOR and REPRESENTATIVE and only EDITOR role is required', () => {
            spyOn(service, 'getTokenData').and.returnValue({user: {roles: ['editor', 'representative']}});

            expect(service.hasRequiredRole([Role.OFFICIAL, Role.EDITOR, Role.ADMIN_AOD, Role.ADMIN_LOD, Role.PORTAL_ADMIN, Role.ADMIN]))
                .toBe(true);
        });

        it('should return true when user is ADMIN and EDITOR and both ADMIN and EDITOR role is required', () => {
            spyOn(service, 'getTokenData').and.returnValue({user: {roles: ['editor', 'admin']}});

            expect(service.hasRequiredRole([Role.EDITOR, Role.ADMIN])).toBe(true);
        });

        it('should pick ADMIN when user is both ADMIN and EDITOR', () => {

            expect(service.getRoleWithHighestPriority([Role.EDITOR, Role.ADMIN])).toBe(Role.ADMIN);
        });

        it('should pick REPRESENTATIVE when user is OFFICIAL, REPRESENTATIVE and EDITOR', () => {

            expect(service.getRoleWithHighestPriority([Role.OFFICIAL, Role.REPRESENTATIVE, Role.EDITOR])).toBe(Role.REPRESENTATIVE);
        });

        it('should return true when more then one role is duplicated', () => {

            expect(service.isMoreThenOneDuplicatedRoles([Role.OFFICIAL, Role.REPRESENTATIVE, Role.EDITOR],
                [Role.OFFICIAL, Role.REPRESENTATIVE, Role.EDITOR, Role.PORTAL_ADMIN])).toBe(true);
        });

        it('should return false when one role is duplicated', () => {

            expect(service.isMoreThenOneDuplicatedRoles([Role.OFFICIAL, Role.REPRESENTATIVE, Role.EDITOR],
                [Role.ADMIN, Role.REPRESENTATIVE, Role.ADMIN_LOD])).toBe(false);
        });

        it('should return false when there is 0 duplicated roles', () => {

            expect(service.isMoreThenOneDuplicatedRoles([Role.OFFICIAL, Role.REPRESENTATIVE, Role.EDITOR],
                [Role.ADMIN, Role.PORTAL_ADMIN, Role.ADMIN_LOD])).toBe(false);
        });
    });
});
