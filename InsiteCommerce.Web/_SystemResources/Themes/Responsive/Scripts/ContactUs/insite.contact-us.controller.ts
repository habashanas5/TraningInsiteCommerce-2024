module insite.contactus {
    "use strict";

    export class ContactUsController {
        submitted = false;
        $form: JQuery;

        static $inject = ["$element", "$scope", "reCaptcha"];

        constructor(
            protected $element: ng.IRootElementService,
            protected $scope: ng.IScope,
            protected reCaptcha: common.IReCaptchaService) {
        }

        $onInit(): void {
            this.$form = this.$element.find("form");
            this.$form.removeData("validator");
            this.$form.removeData("unobtrusiveValidation");
            $.validator.unobtrusive.parse(this.$form);

            this.reCaptcha.render("ContactUs");
        }

        submit($event): boolean {
            $event.preventDefault();
            if (!this.$form.valid()) {
                return false;
            }

            if (!this.reCaptcha.validate("ContactUs")) {
                return false;
            }

            (this.$form as any).ajaxPost(() => {
                this.submitted = true;
                this.$scope.$apply();
            });

            return false;
        }
    }

    angular
        .module("insite")
        .controller("ContactUsController", ContactUsController);
}