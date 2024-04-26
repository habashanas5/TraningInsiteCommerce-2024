/** Intended for use by the CMS to lazily load mobile configuration pages and widgets. */
export function loadMobileComponents() {
    return import(/* webpackChunkName: "mobileComponents" */ "./MobileComponents");
}
