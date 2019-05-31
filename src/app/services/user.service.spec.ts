import { TestBed, inject, getTestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { IRegistration, User } from '@app/services/models';
import { ApiConfig } from '@app/services/api';
import * as jwt from 'jsonwebtoken';
import { ServiceTestbed } from '@app/services/tests/service.testbed';

describe('UserService', () => {

    let injector: TestBed;
    let service: UserService;
    let httpMock: HttpTestingController;

    const userResponse = {result:
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
        it('should return an Observable<T>', () => {
            const newUser: IRegistration = <IRegistration>{
                email: 'user@example.com',
                password1: 'Demo#123',
                password2: 'Demo#123'
            };

            service.registerUser(newUser).subscribe(data => {
                expect(data.result.attributes.email).toBe(newUser.email);
                expect(data).toEqual(userResponse);
            });

            const req = httpMock.expectOne(service.base_url + ApiConfig.userRegistration);
            expect(req.request.method).toBe('POST');
            req.flush(userResponse);
        });
        it('should throw an error if trying to register without password', () => {
            const newUser: IRegistration = <IRegistration>{
                email: 'user@example.com'
            };
            service.registerUser(newUser)
                .subscribe((next) => {
                    console.log(next);
                }, err => {
                    expect(err.statusText).toBe('Missing password');
                });

            const req = httpMock.expectOne(service.base_url + ApiConfig.userRegistration);
            expect(req.request.method).toBe('POST');
            req.flush({}, {status: 422, statusText: 'Missing password'});
        });
    });

    describe('#resendConfirmationEmail', () => {
        it('should return an Observable<T>', () => {
            const email =  'user@example.com';

            service.resendConfirmationEmail(email).subscribe(data => {
                expect(data).toBe('');
            });

            const req = httpMock.expectOne(service.base_url + ApiConfig.userResendEmail);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual({email: email});
            req.flush('');
        });
    });

    describe('#verifyEmail', () => {
        it('should send GET with verification token', () => {
            const resetToken = 'lorem-ipsum';

            service.verifyEmail(resetToken).subscribe(data => {
                expect(data).toBe('');
            });

            const req = httpMock.expectOne(service.base_url + ApiConfig.userVerifyEmail + '/' + resetToken);
            expect(req.request.method).toBe('GET');
            req.flush('');
        });
    });

    describe('#forgotPass', () => {
        it('should send POST request with email', () => {
            const model =  {email: 'user@example.com'};

            service.forgotPass(model).subscribe(data => {
                expect(data).toBe('');
            });

            const req = httpMock.expectOne(service.base_url + ApiConfig.userResetPass);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(model);
            req.flush('');
        });
    });
    describe('#resetPass', () => {
        it('should send POST request with new passwords to specific token', () => {
            const resetToken =  'lorem-ipsum';
            const model =  {new_password1: 'demo123', new_password2: 'demo123'};

            service.resetPass(resetToken, model).subscribe(data => {
                expect(data).toBe('');
            });

            const req = httpMock.expectOne(service.base_url + ApiConfig.userResetPass + '/' + resetToken);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(model);
            req.flush('');
        });
    });

    describe('#login', () => {
        it('should send POST request with user credentials', () => {
            const login = 'demo@mc.gov.pl';
            const pass = 'demo123';
            service.login(login, pass).subscribe(data => {
                expect(data as User).toEqual(jasmine.objectContaining(userResponse.result));
            });

            const req = httpMock.expectOne(service.base_url + ApiConfig.userLogin);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual({email: login, password: pass});
            req.flush({data: userResponse.result});
        });

        it('should throw error for login with incorrect credentials', function () {
            service.login('', '').subscribe(
                data => fail('should have failed with the network error'),
                (errorResponse: HttpErrorResponse) => {
                    expect(errorResponse.error.message).toEqual('');
            });

            const req = httpMock.expectOne(service.base_url + ApiConfig.userLogin);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual({email: '', password: ''});
            req.error(new ErrorEvent('Network error', {
                message: '',
            }));
        });
    });


    describe('#getCurrentUser', () => {
        it('get currently logged user details', () => {

            service.getCurrentUser().subscribe(data => {
                expect(data).toBe(userResponse.result);
            });

            const req = httpMock.expectOne(service.base_url + ApiConfig.userProfile);
            expect(req.request.method).toBe('GET');
            expect(req.request.body).toEqual(null);
            const resetToken = 'licksum';

            let headers = new HttpHeaders();
            headers = headers.append('Authorization', `Bearer ${resetToken}`);
            req.flush({data: userResponse.result}, {headers: headers});
        });
        it('should throw error if there is no user logged in', function () {
            service.getCurrentUser().subscribe(
                data => fail('should have failed with the network error'),
                (error: HttpErrorResponse) => {
                    expect(error.ok).toBeFalsy();
                    expect(error.error.message).toEqual('');
                });

            const req = httpMock.expectOne(service.base_url + ApiConfig.userProfile);
            expect(req.request.method).toBe('GET');
            expect(req.request.body).toEqual(null);
            req.error(new ErrorEvent('Network error', {
                message: '',
            }));
        });
    });


    describe('#logout', () => {
        it('should send POST request', () => {

            service.logout().subscribe(data => {
                expect(data).toBe('');
            });

            const req = httpMock.expectOne(service.base_url + ApiConfig.userLogout);
            expect(req.request.method).toBe('POST');
            req.flush('');
        });
    });
});
