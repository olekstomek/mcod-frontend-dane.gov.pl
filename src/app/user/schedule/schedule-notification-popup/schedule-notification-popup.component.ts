import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy, Input, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import * as fas from '@fortawesome/free-solid-svg-icons';

import { toggleVertically } from "@app/animations/toggle-vertically";
import { ScheduleNotification } from "@app/user/schedule/services/schedule-notification";
import { ScheduleNotificationsService } from "../services/schedule-notifications.service";
import { UserService } from "@app/services/user.service";
import { ScheduleStage } from "../forms/schedule-stage";
import { ForumService } from "@app/user/forum/forum.service";
import { ForumNotificationWithBadge } from "@app/user/forum/forum.enum";

@Component({
    selector: "app-schedule-notification-popup",
    templateUrl: "./schedule-notification-popup.component.html",
    animations: [
        toggleVertically
    ]
})
export class ScheduleNotificationPopupComponent implements OnInit, AfterViewInit, OnDestroy {

    /**
     * Determines whether notificationsRef is visible
     */
    isPopupVisible = false;

    /**
     * Notifications
     */
    @Input() notifications: ScheduleNotification[] | ForumNotificationWithBadge[];

    /**
     * Determines whether is schedule or forum popup
     */
    @Input() isSchedulePopup = true;

    /**
     * Click outside listener
     */
    private clickOutsideListener: () => void;

    /**
     * Click escape listener
     */
    private clickEscapeListener: () => void;

    /**
     * Popup reference
     */
    @ViewChild('activity_notifications') notificationsRef: ElementRef;

    /**
     * Is admin
     */
    isAdmin: boolean;

    /**
     * Font Awesome icon set
     */
    fas = fas;
    
    /**
     * @ignore
     */
    constructor(private renderer: Renderer2,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private scheduleNotificationsService: ScheduleNotificationsService,
        private forumService: ForumService) {
    }

    /**
     * Checks whether current user has admin rights
     */
    ngOnInit() {
        this.isAdmin = this.userService.isAdmin(); 
        
        if (!this.isSchedulePopup) {
            this.forumService.getNotificationsWithBadges().subscribe(notifications => {
                this.notifications = notifications;
            });
        }
    }

    /**
     * Event listeners for hiding popup
     */
    ngAfterViewInit(): void {
        this.clickOutsideListener = this.renderer.listen('body', 'click', this.clickOutside.bind(this));
        this.clickEscapeListener = this.renderer.listen(this.notificationsRef.nativeElement, 'keydown.esc', (event: KeyboardEvent) => {
            this.isPopupVisible = false;
            this.onPopupBlur();
        });
        
    }

    /**
     * Click outside event listener. Hides dropdown.
     * @param {Event} event
     */
    clickOutside(event: Event) {
        if (!this.notificationsRef) return;

        const targetElement = event.target as HTMLElement;
        const parentElement = this.notificationsRef.nativeElement as HTMLElement;
        const clickedInside = parentElement.outerHTML.indexOf(targetElement.outerHTML) !== -1;

        if (!clickedInside) {
            this.isPopupVisible = false;
        }
    }

    /**
     * Removes listeners
     */
    ngOnDestroy() {
        this.clickOutsideListener();
        this.clickEscapeListener();
    }

    /**
     * Removes notification and redirects to the schedule view or directly to the schedule item
     * @param {number} id 
     */
    onNotificationClick(id: number) {
        this.isPopupVisible = false;
        this.redirectToSchedule(id);
    }

    /**
     * Sets notification as read. Redirects to the related schedule.
     * @param {number} id 
     */
    private redirectToSchedule(id: number) {
        this.scheduleNotificationsService.removeById(id).subscribe(() => {
            this.router.navigate(this.buildScheduleRedirectionRoute(id), { relativeTo: this.activatedRoute });
        })
    }

    /**
     * Builds schedule redirection route
     * @param {number} notificationId 
     * @returns {string[]}
     */
    private buildScheduleRedirectionRoute(notificationId: number): string[] {
        const notification = (<ScheduleNotification[]>this.notifications).find(item => item['id'] === notificationId);
        const { schedule_state, schedule_id, user_schedule_id, user_schedule_item_id } = notification;
        let url = ['../', 'schedule'];

        if (schedule_state) {
            let state = ScheduleStage.PLANNING;;

            if (schedule_state !== 'planned') {
                state = schedule_state === 'implemented' ? ScheduleStage.REALIZATION : ScheduleStage.ARCHIVE;
            }

            url = [...url, state];
            if (this.isAdmin) {
                if (!schedule_id || (schedule_id && state === ScheduleStage.PLANNING)) {
                    url = [...url, 'representative'];
                } else {
                    url = [...url, schedule_id, 'representative'];
                }

                if (user_schedule_id) {
                    url = [...url, user_schedule_id, 'edit'];
                }
            } else {
                if (state !== ScheduleStage.PLANNING) {
                    if (schedule_id) {
                        url = [...url, schedule_id, 'edit'];
                    }
                }
            }

            if (user_schedule_item_id) {
                url = [...url, user_schedule_item_id];
            }
        }
        
        return url;
    }

    /**
     * Marks notifaction as read
     */
    markAsRead() {
        this.forumService.markNotificationsAsRead().subscribe(() => {
            this.notifications = null;
            this.isPopupVisible = false;
            this.onPopupBlur();
        });
    }
    
    /**
     * Sets focus on popup trigger on popup blur
     */
    onPopupBlur() {
        ((<HTMLElement>this.notificationsRef.nativeElement).firstElementChild as HTMLButtonElement).focus();
    }
    
    /**
     * Closes popup on keyboard key combination
     */
    onPopupTriggerKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'Tab':
                if (event.shiftKey) {
                    this.isPopupVisible = false;
                }

                if (this.isPopupVisible && !this.notifications?.length) {
                    this.isPopupVisible = false;    
                }

                break;

            case 'Space':
                if (event.shiftKey) {
                    this.isPopupVisible = false;
                    event.preventDefault();
                }
                break;
        }
    }
}
