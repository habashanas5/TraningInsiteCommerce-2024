module insite.common {
    "use strict";

    export interface IReCaptchaService {
        render(location: string): void;
        validate(location: string): boolean;
    }

    export class ReCaptchaService implements IReCaptchaService {
        static $inject = ["$http", "$timeout", "ipCookie"];

        idByLocation: any = {};

        constructor(
            protected $http: ng.IHttpService,
            protected $timeout: ng.ITimeoutService,
            protected ipCookie: any) {
        }

        render(location: string): void {
            this.$timeout(() => { this.waitAndRender(location); });
        }

        protected waitAndRender(location: string): void {
            if (this.$http.pendingRequests.length > 0) {
                this.$timeout(() => { this.waitAndRender(location); }, 100);
                return;
            }

            const grecaptcha = (window as any).grecaptcha;
            if (!grecaptcha) {
                return;
            }

            const reCaptchaElement = angular.element(`#reCaptcha${location}`);
            if (!reCaptchaElement || !reCaptchaElement[0]) {
                return;
            }

            if (this.ipCookie("g-recaptcha-verified")) {
                reCaptchaElement.remove();
                return;
            }

            if (reCaptchaElement[0].innerHTML.indexOf("<iframe") > -1) {
                grecaptcha.reset();
                return;
            }

            this.idByLocation[location] = grecaptcha.render(`reCaptcha${location}`, {
                "sitekey": reCaptchaElement.data("sitekey"),
                "callback": () => { this.validate(location); },
            });
        }

        validate(location: string): boolean {
            const grecaptcha = (window as any).grecaptcha;
            if (!grecaptcha) {
                return true;
            }

            const reCaptchaElement = angular.element(`#reCaptcha${location}`);
            if (!reCaptchaElement || !reCaptchaElement[0]) {
                return true;
            }

            const reCaptchaErrorElement = angular.element(`#reCaptcha${location}Error`);
            const reCaptchaResponse = grecaptcha.getResponse(this.idByLocation[location]);
            if (!reCaptchaResponse) {
                reCaptchaErrorElement.show();
                return false;
            }

            reCaptchaErrorElement.hide();
            this.ipCookie("g-recaptcha-response", reCaptchaResponse, { path: "/" });
            return true;
        }
    }

    angular
        .module("insite-common")
        .service("reCaptcha", ReCaptchaService);
}
