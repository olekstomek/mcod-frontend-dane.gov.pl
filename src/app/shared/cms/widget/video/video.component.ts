import { Component, Input, OnInit } from '@angular/core';
import { WidgetAbstractComponent } from '@app/shared/cms/widget/widget.abstract.component';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { CmsService } from '@app/services/cms.service';
import { IVideo, IVideoHyperEditor } from '@app/services/models/cms/widgets/video';
import { IWidgetStyleForHtmlInject } from '@app/services/models/cms/controls/widget-style';

/**
 * Video component displays videos from CMS
 * @example
 * <cms-video></app-video>
 */
@Component({
    selector: 'cms-video',
    templateUrl: './video.component.html'
})

/**
* @ignore
*/
export class VideoComponent extends WidgetAbstractComponent implements OnInit {

    /**
     * Video to display
    */
    @Input() video: IVideo | IVideoHyperEditor ;

    /**
     * Safe resource url for video
     */
    videoUrl: SafeResourceUrl;

    /**
    * Css styles for video div container
    */
    videoStyles: IWidgetStyleForHtmlInject;

    /**
    * Is supported video player
    */
    isPlayerSupported = true;

    /**
    * Predefined video players properties
    */
    videoPlayers = [
        {
            name: 'youtube',
            separator: '=',
            url: 'https://www.youtube.com/embed/',
        },
        {
            name: 'youtu.be',
            separator: '/',
            url: 'https://www.youtube.com/embed/',
        },
        {
            name: 'vimeo',
            separator: '/',
            url: 'https://player.vimeo.com/video/',
        },
        {
            name: 'dailymotion',
            separator: 'video/',
            url: 'https://www.dailymotion.com/embed/video/',
        }
    ];

    /**
     * @ignore
     */
    constructor(cmsService: CmsService, sanitizer: DomSanitizer) {
        super(cmsService, sanitizer);
    }


    /**
    *  Prepare url and styles
    */
    ngOnInit() {
        if (this.video.settings && this.video.settings.video_url) {
            this.videoUrl = this.createEmbedUrl(this.video.settings.video_url);
            this.videoStyles = this.cmsService.addStyle(this.video, 'hyperEditor');
            return;
        }

        const videoFromCmsTextEditor = this.video as IVideo;
        if (videoFromCmsTextEditor.value && videoFromCmsTextEditor.value.video) {
            this.videoUrl = this.createEmbedUrl((this.video as IVideo).value.video);
        }
    }

    /**
    *  Create embed url
    *  @param {string} originalUrl
    *  @return {SafeUrl}
    */
    private createEmbedUrl(originalUrl: string): SafeUrl {
        const videoPlayer = this.videoPlayers.find(player => RegExp(player.name, 'i').test(originalUrl));
        if (!videoPlayer) {
            this.isPlayerSupported = false;
            return null;
        }
        const videoId = originalUrl.split(videoPlayer.separator).pop();
        return this.sanitizer.bypassSecurityTrustResourceUrl(videoPlayer.url + videoId);
    }
}
