import { ExternalProviderLinkModel } from "@insite/client-framework/Services/IdentityService";

export default interface SignInState {
    isSigningInAsGuest: boolean;
    externalProviders?: ExternalProviderLinkModel[];
}
