import { CookieAttributes } from "js-cookie";

let internalSetCookie = (name: string, value: string, options?: CookieAttributes) => {};

// mobius can't reference setCookie directly, so Cookies calls this to allow mobius to call setCookie
export function setupSetCookie(value: typeof internalSetCookie) {
    internalSetCookie = value;
}

export const setCookie = (...params: Parameters<typeof internalSetCookie>) => {
    internalSetCookie(...params);
};
