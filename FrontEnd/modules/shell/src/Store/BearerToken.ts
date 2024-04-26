import { getAccessTokenFromLocalStorage } from "@insite/shell/Services/AccessTokenService";

const b64DecodeUnicode = (str: string) =>
    decodeURIComponent(
        atob(str)
            .split("")
            .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
            .join(""),
    );

type RawInsiteToken = Readonly<{
    client_id: "isc" | "ext" | "isc_admin" | "isc_admin_ext" | "mobile";
    scope: readonly ("iscapi" | "offline_access" | "isc_admin_api")[];
    sub: string;
    amr: readonly "password"[];
    auth_time: number;
    /** Identity provider. */
    idp: "idsrv";
    preferred_username: string;
    role: string;
    /** Issuer. */
    iss: string;
    /** Audience. */
    aud: string;
    exp: number;
    nbf: number;
}>;

type InsiteToken = Omit<RawInsiteToken, "auth_time" | "exp" | "nbf"> &
    Readonly<{
        /** Authorization completed at this time. */
        auth_time: Date;
        /** Token expiration time. */
        exp: Date;
        /** Token is not valid before this time. */
        nbf: Date;
    }>;

export const parseAdminTokenFromLocalStorage = (returnExpiredTokens?: true) => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (!accessToken) {
        return null;
    }

    try {
        const raw = JSON.parse(b64DecodeUnicode(accessToken.split(".")[1])) as RawInsiteToken;

        const converted: InsiteToken = {
            ...raw,
            // eslint-disable-next-line @typescript-eslint/camelcase
            auth_time: new Date(raw.auth_time * 1000),
            exp: new Date(raw.exp * 1000),
            nbf: new Date(raw.nbf * 1000),
        };

        if (!returnExpiredTokens && converted && converted.exp < new Date()) {
            return null;
        }

        return converted;
    } catch (e) {
        return null;
    }
};
