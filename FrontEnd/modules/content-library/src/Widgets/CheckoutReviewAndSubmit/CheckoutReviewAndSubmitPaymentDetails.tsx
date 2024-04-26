import { useTokenExFrame } from "@insite/client-framework/Common/Hooks/useTokenExFrame";
import StyledWrapper, { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import validateCreditCard from "@insite/client-framework/Common/Utilities/validateCreditCard";
import logger from "@insite/client-framework/Logger";
import { TokenExConfig } from "@insite/client-framework/Services/SettingsService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import loadPaymetricConfig from "@insite/client-framework/Store/Context/Handlers/LoadPaymetricConfig";
import loadTokenExConfig from "@insite/client-framework/Store/Context/Handlers/LoadTokenExConfig";
import { getBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import loadBillTo from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadBillTo";
import { getCartState, getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import resetCurrentCartId from "@insite/client-framework/Store/Data/Carts/Handlers/ResetCurrentCartId";
import { getCurrentCountries } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import checkoutWithPayPal from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/CheckoutWithPayPal";
import getPaymetricResponsePacket from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/GetPaymetricResponsePacket";
import placeOrder from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/PlaceOrder";
import preloadOrderConfirmationData from "@insite/client-framework/Store/Pages/OrderConfirmation/Handlers/PreloadOrderConfirmationData";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { CheckoutReviewAndSubmitPageContext } from "@insite/content-library/Pages/CheckoutReviewAndSubmitPage";
import CreditCardBillingAddressEntry, {
    CreditCardBillingAddressEntryStyles,
} from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/CreditCardBillingAddressEntry";
import CreditCardDetailsEntry, {
    CreditCardDetailsEntryStyles,
} from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/CreditCardDetailsEntry";
import ECheckDetailsEntry, {
    ECheckDetailsEntryStyles,
    Validatable,
} from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/ECheckDetailsEntry";
import PaymentProfileBillingAddress from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/PaymentProfileBillingAddress";
import PayPalButton, { PayPalButtonStyles } from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/PayPalButton";
import SavedPaymentProfileEntry, {
    SavedPaymentProfileEntryStyles,
} from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/SavedPaymentProfileEntry";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import { generateTokenExFrameStyleConfig } from "@insite/mobius/TokenExFrame";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React, { useEffect, useRef, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css, ThemeProps, withTheme } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const { cartId } = state.pages.checkoutReviewAndSubmit;
    const cartState = cartId ? getCartState(state, cartId) : getCurrentCartState(state);
    const settingsCollection = getSettingsCollection(state);
    return {
        cartState,
        billToState: getBillToState(state, cartState.value ? cartState.value.billToId : undefined),
        countries: getCurrentCountries(state),
        websiteSettings: settingsCollection.websiteSettings,
        cartSettings: settingsCollection.cartSettings,
        tokenExConfigs: state.context.tokenExConfigs,
        orderConfirmationPageLink: getPageLinkByPageType(state, "OrderConfirmationPage"),
        savedPaymentsPageLink: getPageLinkByPageType(state, "SavedPaymentsPage"),
        session: state.context.session,
        signInPageLink: getPageLinkByPageType(state, "SignInPage"),
        checkoutReviewAndSubmitPageLink: getPageLinkByPageType(state, "CheckoutReviewAndSubmitPage"),
        payPalRedirectUri: state.pages.checkoutReviewAndSubmit.payPalRedirectUri,
        location: getLocation(state),
        usePaymetricGateway: settingsCollection.websiteSettings.usePaymetricGateway,
        paymetricConfig: state.context.paymetricConfig,
        enableVat: settingsCollection.productSettings.enableVat,
    };
};

const mapDispatchToProps = {
    loadTokenExConfig,
    placeOrder,
    checkoutWithPayPal,
    preloadOrderConfirmationData,
    loadBillTo,
    loadPaymetricConfig,
    getPaymetricResponsePacket,
    resetCurrentCartId,
};

type Props = ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    ThemeProps<BaseTheme> &
    HasHistory &
    HasToasterContext;

export interface CheckoutReviewAndSubmitPaymentDetailsStyles {
    form?: InjectableCss;
    fieldset?: InjectableCss;
    paymentDetailsHeading?: TypographyPresentationProps;
    paymentMethodPayPalText?: TypographyPresentationProps;
    paymentMethodAndPONumberContainer?: GridContainerProps;
    paymentMethodGridItem?: GridItemProps;
    paymentMethodSelect?: SelectPresentationProps;
    paymentProfileBillingAddress?: any;
    paymentProfileExpiredErrorWrapper?: InjectableCss;
    paymentProfileExpiredErrorText?: TypographyPresentationProps;
    paymentProfileEditCardLink?: LinkPresentationProps;
    vatNumberGridItem?: GridItemProps;
    vatNumberText?: TextFieldPresentationProps;
    poNumberGridItem?: GridItemProps;
    poNumberText?: TextFieldPresentationProps;
    emptyGridItem?: GridItemProps;
    mainContainer?: GridContainerProps;
    savedPaymentProfile?: SavedPaymentProfileEntryStyles;
    creditCardDetailsGridItem?: GridItemProps;
    eCheckDetailsGridItem?: GridItemProps;
    creditCardDetails?: CreditCardDetailsEntryStyles;
    creditCardAddressGridItem?: GridItemProps;
    creditCardAddress?: CreditCardBillingAddressEntryStyles;
    payPalButton?: PayPalButtonStyles;
    eCheckDetailsEntryStyles?: ECheckDetailsEntryStyles;
}

export const checkoutReviewAndSubmitPaymentDetailsStyles: CheckoutReviewAndSubmitPaymentDetailsStyles = {
    fieldset: {
        css: css`
            margin: 0;
            padding: 0;
            border: 0;
        `,
    },
    paymentDetailsHeading: { variant: "h5" },
    paymentMethodAndPONumberContainer: {
        gap: 10,
        css: css`
            margin-bottom: 1rem;
        `,
    },
    paymentMethodGridItem: {
        width: 6,
        css: css`
            flex-direction: column;
        `,
    },
    paymentProfileExpiredErrorWrapper: {
        css: css`
            display: flex;
            width: 100%;
        `,
    },
    paymentProfileExpiredErrorText: { color: "danger" },
    paymentProfileEditCardLink: {
        css: css`
            margin-left: 1rem;
        `,
    },
    vatNumberGridItem: { width: 6 },
    poNumberGridItem: { width: 6 },
    emptyGridItem: { width: 6 },
    creditCardDetailsGridItem: { width: [12, 12, 12, 6, 6] },
    eCheckDetailsGridItem: { width: [12, 12, 12, 6, 6] },
    creditCardAddressGridItem: {
        width: [12, 12, 12, 6, 6],
        css: css`
            flex-direction: column;
        `,
    },
};

// TokenEx doesn't provide an npm package or type definitions for using the iframe solution.
// This is just enough types to avoid the build warnings and make using TokenEx a bit easier.
export type TokenExIframeStyles = {
    base?: string;
    focus?: string;
    error?: string;
    cvv?: TokenExIframeStyles;
};

export type TokenExIframeConfig = {
    tokenExID: string;
    tokenScheme: string;
    authenticationKey: string;
    timestamp: string;
    origin: string;
    styles?: TokenExIframeStyles;
    pci?: boolean;
    enableValidateOnBlur?: boolean;
    inputType?: "number" | "tel" | "text";
    debug?: boolean;
    cvv?: boolean;
    cvvOnly?: boolean;
    cvvContainerID?: string;
    cvvInputType?: "number" | "tel" | "text";
    enableAriaRequired?: boolean;
    customDataLabel?: string;
    title?: string;
};

type TokenExPCIIframeConfig = TokenExIframeConfig & {
    pci: true;
    enablePrettyFormat?: boolean;
};

type TokenExCvvOnlyIframeConfig = TokenExIframeConfig & {
    cvvOnly: true;
    token?: string;
    cardType?: string;
};

export type IFrame = {
    new (containerId: string, config: TokenExIframeConfig): IFrame;
    load: () => void;
    on: (
        eventName: "load" | "validate" | "tokenize" | "error" | "cardTypeChange",
        callback: (data: any) => void,
    ) => void;
    remove: () => void;
    validate: () => void;
    tokenize: () => void;
    reset: () => void;
};

export type TokenEx = {
    Iframe: IFrame;
};

declare const TokenEx: TokenEx;
let tokenExIframe: IFrame | undefined;
let tokenExAccountNumberIframe: IFrame | undefined;

let tokenExFrameStyleConfig: TokenExIframeStyles;

declare function $XIFrame(options: any): any;
let paymetricIframe: any;

const isNonEmptyString = (value: string | undefined) => value !== undefined && value.trim() !== "";

const isMonthAndYearBeforeToday = (month: number, year: number) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    return year < currentYear || (year === currentYear && month < currentMonth + 1);
};

const convertTokenExCardTypeToApiData = (cardType: string) => {
    if (cardType.includes("american")) {
        return "AMERICAN EXPRESS";
    }

    return cardType.toUpperCase();
};

const convertApiDataToTokenExCardType = (cardType: string) => {
    const loweredCardType = cardType.toLowerCase();

    if (loweredCardType === "mastercard") {
        return "masterCard";
    }
    if (loweredCardType === "american express") {
        return "americanExpress";
    }

    return loweredCardType;
};

const convertPaymetricCardType = (cardType: string) => {
    switch (cardType.toLowerCase()) {
        case "vi":
            return "Visa";
        case "mc":
            return "MasterCard";
        case "ax":
            return "American Express";
        case "dc":
            return "Diner's";
        case "di":
            return "Discover";
        case "jc":
            return "JCB";
        case "sw":
            return "Maestro";
        default:
            return "unknown";
    }
};

const styles = checkoutReviewAndSubmitPaymentDetailsStyles;
const StyledForm = getStyledWrapper("form");
const StyledFieldSet = getStyledWrapper("fieldset");

const CheckoutReviewAndSubmitPaymentDetails = ({
    loadBillTo,
    cartState,
    billToState,
    countries,
    websiteSettings,
    cartSettings,
    tokenExConfigs,
    placeOrder,
    orderConfirmationPageLink,
    savedPaymentsPageLink,
    history,
    checkoutWithPayPal,
    payPalRedirectUri,
    preloadOrderConfirmationData,
    loadTokenExConfig,
    theme,
    session,
    checkoutReviewAndSubmitPageLink,
    location,
    toaster,
    paymetricConfig,
    loadPaymetricConfig,
    usePaymetricGateway,
    getPaymetricResponsePacket,
    resetCurrentCartId,
    enableVat,
}: Props) => {
    const [paymentMethod, setPaymentMethod] = useState("");
    const [poNumber, setPONumber] = useState("");
    const [vatNumber, setVatNumber] = useState("");
    const [saveCard, setSaveCard] = useState(false);
    const [cardHolderName, setCardHolderName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardType, setCardType] = useState("");
    const [possibleCardType, setPossibleCardType] = useState("");
    const [expirationMonth, setExpirationMonth] = useState(1);
    const [expirationYear, setExpirationYear] = useState(new Date().getFullYear());
    const [securityCode, setSecurityCode] = useState("");
    const [useBillingAddress, setUseBillingAddress] = useState(true);
    const [address1, setAddress1] = useState("");
    const [countryId, setCountryId] = useState("");
    const [stateId, setStateId] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");

    const [paymentMethodError, setPaymentMethodError] = useState("");
    const [poNumberError, setPONumberError] = useState("");
    const [cardHolderNameError, setCardHolderNameError] = useState("");
    const [cardNumberError, setCardNumberError] = useState("");
    const [cardTypeError, setCardTypeError] = useState("");
    const [securityCodeError, setSecurityCodeError] = useState("");
    const [expirationError, setExpirationError] = useState("");
    const [address1Error, setAddress1Error] = useState("");
    const [countryError, setCountryError] = useState("");
    const [stateError, setStateError] = useState("");
    const [cityError, setCityError] = useState("");
    const [postalCodeError, setPostalCodeError] = useState("");
    const [payPalError, setPayPalError] = useState("");

    const [showFormErrors, setShowFormErrors] = useState(false);
    const [isCardNumberTokenized, setIsCardNumberTokenized] = useState(false);
    const [isTokenExIframeLoaded, setIsTokenExIframeLoaded] = useState(false);
    const [isECheckTokenized, setIsECheckTokenized] = useState(false);
    const [accountHolderName, setAccountHolderName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [routingNumber, setRoutingNumber] = useState("");

    // Used in deciding which form element to focus on in the case the form is submitted with errors
    const paymentMethodRef = useRef<HTMLSelectElement>(null);
    const poNumberRef = useRef<HTMLInputElement>(null);
    const cardHolderNameRef = useRef<HTMLInputElement>(null);
    const cardNumberRef = useRef<HTMLInputElement>(null);
    const cardTypeRef = useRef<HTMLSelectElement>(null);
    const securityCodeRef = useRef<HTMLInputElement>(null);
    const expirationMonthRef = useRef<HTMLSelectElement>(null);
    const expirationYearRef = useRef<HTMLSelectElement>(null);
    const address1Ref = useRef<HTMLInputElement>(null);
    const countryRef = useRef<HTMLSelectElement>(null);
    const stateRef = useRef<HTMLSelectElement>(null);
    const cityRef = useRef<HTMLInputElement>(null);
    const postalCodeRef = useRef<HTMLInputElement>(null);

    // Used in validation of form, since some form elements will not be validated when PayPal is active.
    const [isPayPal, setIsPayPal] = useState(false);
    // Help to work in the flow of React to validate the form.
    // Since setting isPayPal and validating will not have the correct "effect" in place to correctly validate the form.
    const [runSubmitPayPal, setRunSubmitPayPal] = useState(false);

    // will exist after we are redirected back here from paypal
    const {
        PayerID: payPalPayerId,
        token: payPalToken,
        cartId,
    } = parseQueryString<{
        PayerID?: string;
        token?: string;
        cartId?: string;
    }>(location.search);

    const resetForm = () => {
        setCardHolderNameError("");
        setCardNumberError("");
        setCardTypeError("");
        setExpirationError("");
        setSecurityCodeError("");
        setAddress1("");
        setCountryError("");
        setStateError("");
        setCityError("");
        setPostalCodeError("");
        setPayPalError("");
        setIsCardNumberTokenized(false);
        setIsTokenExIframeLoaded(false);
    };

    useEffect(() => {
        if (!billToState.value && !billToState.isLoading && cartState.value && cartState.value.billToId) {
            loadBillTo({ billToId: cartState.value.billToId });
        }
    }, [billToState]);

    useTokenExFrame(websiteSettings);

    useEffect(() => resetForm(), [paymentMethod]);

    useEffect(() => {
        if (isCardNumberTokenized || isECheckTokenized) {
            placeOrder({
                paymentMethod,
                poNumber,
                vatNumber,
                saveCard,
                cardHolderName,
                cardNumber,
                cardType,
                expirationMonth,
                expirationYear,
                securityCode,
                useBillingAddress,
                address1,
                countryId,
                stateId,
                city,
                postalCode,
                payPalToken,
                payPalPayerId,
                accountHolderName,
                accountNumber,
                routingNumber,
                onSuccess: (cartId: string) => {
                    if (!orderConfirmationPageLink) {
                        return;
                    }

                    if (cart?.isAwaitingApproval) {
                        resetCurrentCartId({});
                        toaster.addToast({
                            body: siteMessage("OrderApproval_OrderPlaced"),
                            messageType: "success",
                        });
                    }

                    history.push(`${orderConfirmationPageLink.url}?cartId=${cartId}`);
                },
                onError: () => {
                    setIsCardNumberTokenized(false);
                    tokenExIframe?.reset();
                },
                onComplete(resultProps) {
                    if (resultProps.apiResult?.cart) {
                        // "this" is targeting the object being created, not the parent SFC
                        // eslint-disable-next-line react/no-this-in-sfc
                        this.onSuccess?.(resultProps.apiResult.cart.id);
                    } else {
                        // "this" is targeting the object being created, not the parent SFC
                        // eslint-disable-next-line react/no-this-in-sfc
                        this.onError?.();
                    }
                },
            });
        }
    }, [isCardNumberTokenized, isECheckTokenized]);

    useEffect(() => {
        if (!cartState.isLoading && cartState.value && cartState.value.paymentMethod && paymentMethod === "") {
            setPaymentMethod(cartState.value.paymentMethod.name);
        }
    }, [cartState.isLoading]);

    // IsPayPal
    // Setup isPayPal from cart.paymentOptions and validates form when cartState changes and is loaded.
    useEffect(() => {
        if (cartState.value) {
            const tempIsPayPal = cartState.value.paymentOptions?.isPayPal || !!payPalToken;
            setIsPayPal(tempIsPayPal);
            if (tempIsPayPal) {
                validateForm();
            }
        }
    }, [cartState]);

    // Submit PayPal
    // When isPayPal and runSubmitPayPal are true will validate form, and submitPayPal with the current page redirectUri and current cart.
    useEffect(() => {
        if (isPayPal && runSubmitPayPal) {
            if (!validateForm()) {
                setShowFormErrors(true);
                return;
            }
            if (!checkoutReviewAndSubmitPageLink) {
                return;
            }
            let redirectUri = `${window.location.host}${checkoutReviewAndSubmitPageLink.url}`;
            if (cartId) {
                redirectUri += `?cartId=${cartId}`;
            }
            checkoutWithPayPal({ redirectUri });
        }
    }, [runSubmitPayPal, isPayPal]);

    // Submit PayPal State Check
    // Handles the PayPal button click response, getting the payPal redirectUri from the server on cart update call.
    useEffect(() => {
        if (payPalRedirectUri) {
            window.location.href = payPalRedirectUri;
        }
    }, [payPalRedirectUri]);

    const { value: cart } = cartState;

    const { useTokenExGateway, useECheckTokenExGateway } = websiteSettings;
    const { showPayPal } = cartSettings;
    const paymentOptions = cart ? cart.paymentOptions : undefined;
    const paymentMethods = paymentOptions ? paymentOptions.paymentMethods : undefined;

    const paymentMethodDto = paymentMethods?.find(method => method.name === paymentMethod);
    const selectedCountry = countries?.find(country => country.id === countryId);
    let tokenName: string | undefined;
    const eCheckDetails = useRef<Validatable>(null);

    if (useTokenExGateway) {
        if (paymentMethodDto?.isPaymentProfile) {
            tokenName = paymentMethodDto.name;
        } else if (paymentMethodDto?.isCreditCard) {
            tokenName = "";
        }
    }

    if (useECheckTokenExGateway) {
        if (paymentMethodDto?.isECheck) {
            tokenName = "";
        }
    }

    useEffect(() => {
        if (typeof tokenName !== "undefined") {
            const isECheck = paymentMethodDto?.isECheck === true;
            loadTokenExConfig({ token: tokenName, isECheck });
        }
    }, [paymentMethod]);

    const tokenExConfig = typeof tokenName !== "undefined" ? tokenExConfigs[tokenName] : undefined;

    useEffect(() => {
        if (typeof TokenEx === "undefined" || !tokenExConfig) {
            return;
        }

        setIsTokenExIframeLoaded(false);
        setUpTokenEx();
    }, [tokenExConfig, typeof TokenEx]);

    const setUpTokenEx = () => {
        if (!tokenExConfig || !paymentMethodDto) {
            return;
        }

        if (paymentMethodDto.isPaymentProfile && !paymentMethodDto.isPaymentProfileExpired) {
            setUpTokenExIFrameCvvOnly(tokenExConfig);
        } else if (paymentMethodDto.isCreditCard) {
            setUpTokenExIFrame(tokenExConfig);
        }
    };

    const setUpTokenExIFrame = (config: TokenExConfig) => {
        if (tokenExIframe) {
            tokenExIframe.remove();
        }

        const iframeConfig: TokenExPCIIframeConfig = {
            authenticationKey: config.authenticationKey,
            cvv: true,
            cvvContainerID: "tokenExSecurityCode",
            cvvInputType: "text",
            enablePrettyFormat: true,
            inputType: "text",
            origin: config.origin,
            pci: true,
            styles: tokenExFrameStyleConfig,
            timestamp: config.timestamp,
            tokenExID: config.tokenExId,
            tokenScheme: config.tokenScheme,
            enableAriaRequired: true,
            title: translate("Credit card information"),
            customDataLabel: translate("credit card number"),
        };

        tokenExIframe = new TokenEx.Iframe("tokenExCardNumber", iframeConfig);
        tokenExIframe.load();
        tokenExIframe.on("load", _ => setIsTokenExIframeLoaded(true));
        tokenExIframe.on("tokenize", data => {
            setCardNumber(data.token);
            setSecurityCode("CVV");
            setCardType(convertTokenExCardTypeToApiData(data.cardType));
            setIsCardNumberTokenized(true);
        });
        tokenExIframe.on("cardTypeChange", data => setPossibleCardType(data.possibleCardType));
        tokenExIframe.on("validate", data => {
            setShowFormErrors(true);
            if (data.isValid) {
                setCardNumberError("");
            } else {
                if (data.validator === "required") {
                    setCardNumberError(translate("Credit card number is required."));
                }
                if (data.validator === "format") {
                    setCardNumberError(translate("Credit card number is invalid."));
                }
            }

            if (data.isCvvValid) {
                setSecurityCodeError("");
            } else {
                if (data.cvvValidator === "required") {
                    setSecurityCodeError(translate("Security code is required."));
                }
                if (data.cvvValidator === "format") {
                    setSecurityCodeError(translate("Security code is invalid."));
                }
            }
        });
        tokenExIframe.on("error", data => {
            logger.error(data);
            setUpTokenExIFrame(config);
        });
    };

    const setUpTokenExIFrameCvvOnly = (config: TokenExConfig) => {
        if (tokenExIframe) {
            tokenExIframe.remove();
        }

        const iframeConfig: TokenExCvvOnlyIframeConfig = {
            authenticationKey: config.authenticationKey,
            cardType: convertApiDataToTokenExCardType(paymentMethodDto!.cardType),
            cvv: true,
            cvvOnly: true,
            inputType: "text",
            origin: config.origin,
            styles: tokenExFrameStyleConfig,
            timestamp: config.timestamp,
            token: paymentMethodDto!.name,
            tokenExID: config.tokenExId,
            tokenScheme: paymentMethodDto!.tokenScheme,
            enableAriaRequired: true,
            title: translate("Security code"),
            customDataLabel: translate("Security code"),
        };

        tokenExIframe = new TokenEx.Iframe("ppTokenExSecurityCode", iframeConfig);
        tokenExIframe.load();
        tokenExIframe.on("load", _ => setIsTokenExIframeLoaded(true));
        tokenExIframe.on("tokenize", _ => setIsCardNumberTokenized(true));
        tokenExIframe.on("validate", data => {
            if (data.isValid) {
                setSecurityCodeError("");
            } else {
                setShowFormErrors(true);
                if (data.validator === "required") {
                    setSecurityCodeError(translate("Security code is required."));
                }
                if (data.validator === "format") {
                    setSecurityCodeError(translate("Security code is invalid."));
                }
            }
        });
        tokenExIframe.on("error", data => {
            logger.error(data);
            setUpTokenExIFrameCvvOnly(config);
        });
    };

    const paymetricFrameRef = useRef<HTMLIFrameElement>(null);
    const setupPaymetricIframe = () => {
        if (!paymetricConfig) {
            return;
        }
        paymetricIframe = $XIFrame({
            iFrameId: "paymetricIframe",
            targetUrl: paymetricConfig?.message,
            autosizewidth: false,
            autosizeheight: true,
        });
        paymetricIframe.onload();
    };
    useEffect(() => {
        if (usePaymetricGateway && paymentMethodDto?.isCreditCard) {
            loadPaymetricConfig();
        }
    }, [usePaymetricGateway, paymentMethod]);
    useEffect(() => {
        if (paymetricConfig?.success && paymetricFrameRef.current) {
            const paymetricScript = document.createElement("script");
            paymetricScript.src = paymetricConfig.javaScriptUrl;
            paymetricScript.onload = () => {
                if (paymetricFrameRef.current) {
                    paymetricFrameRef.current.setAttribute("src", paymetricConfig.message);
                    paymetricFrameRef.current.addEventListener("load", setupPaymetricIframe);
                }
            };
            document.body.appendChild(paymetricScript);
        }

        return () => {
            paymetricFrameRef.current?.removeEventListener("load", setupPaymetricIframe);
        };
    }, [paymetricConfig, paymetricFrameRef]);

    const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPaymentMethod(event.currentTarget.value);
        validatePaymentMethod(event.currentTarget.value);
    };
    const handlePONumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPONumber(event.currentTarget.value);
        validatePONumber(event.currentTarget.value);
    };
    const handleVatNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVatNumber(event.currentTarget.value);
    };
    const handleSaveCardChange = (_: React.SyntheticEvent<Element, Event>, value: boolean) => setSaveCard(value);
    const handleCardHolderNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCardHolderName(event.currentTarget.value);
        validateCardHolderName(event.currentTarget.value);
    };
    const handleCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCardNumber(event.currentTarget.value);
        validateCardNumber(event.currentTarget.value);
    };
    const handleCardTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCardType(event.currentTarget.value);
        validateCardType(event.currentTarget.value);
    };
    const handleExpirationMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const month = Number(event.currentTarget.value);
        if (Number.isNaN(month)) {
            return;
        }
        setExpirationMonth(month);
        validateCardExpiration(month, expirationYear);
    };
    const handleExpirationYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const year = Number(event.currentTarget.value);
        if (Number.isNaN(year)) {
            return;
        }
        setExpirationYear(year);
        validateCardExpiration(expirationMonth, year);
    };
    const handleSecurityCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSecurityCode(event.currentTarget.value);
        validateSecurityCode(event.currentTarget.value);
    };
    const handleUseBillingAddressChange = (_: React.SyntheticEvent<Element, Event>, value: boolean) =>
        setUseBillingAddress(value);
    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress1(event.currentTarget.value);
        validateAddress1(event.currentTarget.value);
    };
    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCountryId(event.currentTarget.value);
        validateCountry(event.currentTarget.value);
    };
    const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStateId(event.currentTarget.value);
        validateState(event.currentTarget.value);
    };
    const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCity(event.currentTarget.value);
        validateCity(event.currentTarget.value);
    };
    const handlePostalCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostalCode(event.currentTarget.value);
        validatePostalCode(event.currentTarget.value);
    };

    const handleEditCardClick = () => {
        if (!savedPaymentsPageLink) {
            return;
        }

        history.push(savedPaymentsPageLink.url);
    };

    const validatePaymentMethod = (paymentMethod: string) => {
        const paymentMethodValid =
            isPayPal || !paymentMethods || paymentMethods.length === 0 || isNonEmptyString(paymentMethod);
        setPaymentMethodError(!paymentMethodValid ? translate("Payment Method is required.") : "");
        return paymentMethodValid;
    };

    const validatePONumber = (poNumber: string) => {
        const poNumberValid = !cart || !cart.requiresPoNumber || isNonEmptyString(poNumber);
        setPONumberError(!poNumberValid ? translate("PO Number is required.") : "");
        return poNumberValid;
    };

    const validateCardHolderName = (cardHolderName: string) => {
        const cardHolderNameValid = !paymentMethodDto?.isCreditCard || isNonEmptyString(cardHolderName);
        setCardHolderNameError(!cardHolderNameValid ? translate("Cardholder name is required.") : "");
        return cardHolderNameValid;
    };

    const validateCardNumber = (cardNumber: string) => {
        let cardNumberEmpty = false;
        let cardNumberValid = true;

        if (paymentMethodDto?.isCreditCard && !useTokenExGateway) {
            cardNumberEmpty = !isNonEmptyString(cardNumber);
            cardNumberValid = validateCreditCard(cardNumber);
        }

        if (cardNumberEmpty) {
            setCardNumberError(translate("Credit card number is required."));
        } else if (!cardNumberValid) {
            setCardNumberError(translate("Credit card number is invalid."));
        } else {
            setCardNumberError("");
        }

        return { cardNumberEmpty, cardNumberValid };
    };

    const validateCardType = (cardType: string) => {
        const cardTypeValid =
            !paymentMethodDto?.isCreditCard || useTokenExGateway || (!useTokenExGateway && isNonEmptyString(cardType));
        setCardTypeError(!cardTypeValid ? translate("Credit card type is required.") : "");
        return cardTypeValid;
    };

    const validateCardExpiration = (expirationMonth: number, expirationYear: number) => {
        const cardExpired =
            paymentMethodDto?.isCreditCard && isMonthAndYearBeforeToday(expirationMonth, expirationYear);
        setExpirationError(cardExpired ? translate("Card is expired. Please enter a valid expiration date.") : "");
        return cardExpired;
    };

    const validateSecurityCode = (securityCode: string) => {
        let securityCodeEmpty = false;
        let securityCodeValid = true;

        if (paymentMethodDto?.isCreditCard && !useTokenExGateway) {
            securityCodeEmpty = !isNonEmptyString(securityCode);
            securityCodeValid = /^\d+$/.test(securityCode);
        }

        if (securityCodeEmpty) {
            setSecurityCodeError(!securityCodeValid ? translate("Security code is required.") : "");
        } else if (!securityCodeValid) {
            setSecurityCodeError(translate("Security code is invalid."));
        } else {
            setSecurityCodeError("");
        }

        return { securityCodeEmpty, securityCodeValid };
    };

    const validateAddress1 = (address1: string) => {
        const address1Valid =
            !(paymentMethodDto?.isCreditCard || paymentMethodDto?.isECheck) ||
            useBillingAddress ||
            (!useBillingAddress && isNonEmptyString(address1));
        setAddress1Error(!address1Valid ? translate("Address is required.") : "");
        return address1Valid;
    };

    const validateCountry = (countryId: string) => {
        const countryValid =
            !(paymentMethodDto?.isCreditCard || paymentMethodDto?.isECheck) ||
            useBillingAddress ||
            (!useBillingAddress && isNonEmptyString(countryId));
        setCountryError(!countryValid ? translate("Country is required.") : "");
        return countryValid;
    };

    const validateState = (stateId: string) => {
        const stateValid =
            !(paymentMethodDto?.isCreditCard || paymentMethodDto?.isECheck) ||
            useBillingAddress ||
            (!useBillingAddress && isNonEmptyString(stateId));
        setStateError(!stateValid ? translate("State is required.") : "");
        return stateValid;
    };

    const validateCity = (city: string) => {
        const cityValid =
            !(paymentMethodDto?.isCreditCard || paymentMethodDto?.isECheck) ||
            useBillingAddress ||
            (!useBillingAddress && isNonEmptyString(city));
        setCityError(!cityValid ? translate("City is required.") : "");
        return cityValid;
    };

    const validatePostalCode = (postalCode: string) => {
        const postalCodeValid =
            !(paymentMethodDto?.isCreditCard || paymentMethodDto?.isECheck) ||
            useBillingAddress ||
            (!useBillingAddress && isNonEmptyString(postalCode));
        setPostalCodeError(!postalCodeValid ? translate("Postal Code is required.") : "");
        return postalCodeValid;
    };

    const handleAccountNumberIFrame = (accountNumberIFrame: IFrame) => {
        tokenExAccountNumberIframe = accountNumberIFrame;
    };

    const handlePaymetricValidateSuccess = (success: boolean) => {
        if (success) {
            paymetricIframe.submit({
                onSuccess: (msg: string) => {
                    // The HasPassed is case sensitive, and not standard json.
                    const message: { data: { HasPassed: boolean } } = JSON.parse(msg);
                    if (message.data.HasPassed) {
                        handleSuccessSubmitPaymetricIframe();
                    }
                },
                onError: (msg: string) => {
                    const message: { data: { Code: number } } = JSON.parse(msg);
                    // Code = 150 -> Already submitted
                    if (message.data.Code === 150) {
                        handleSuccessSubmitPaymetricIframe();
                    }
                },
            });
        }
    };

    const handleSuccessSubmitPaymetricIframe = () => {
        if (!paymetricConfig?.accessToken) {
            return;
        }

        getPaymetricResponsePacket({
            accessToken: paymetricConfig.accessToken,
            onComplete: result => {
                if (result.apiResult?.success) {
                    setCardType(convertPaymetricCardType(result.apiResult.creditCard.cardType));
                    setExpirationMonth(result.apiResult.creditCard.expirationMonth!);
                    setExpirationYear(result.apiResult.creditCard.expirationYear!);
                    setCardNumber(result.apiResult.creditCard.cardNumber!);
                    setSecurityCode(result.apiResult.creditCard.securityCode!);
                    setCardHolderName(result.apiResult.creditCard.cardHolderName!);
                    setIsCardNumberTokenized(true);
                }
            },
        });
    };

    const validateForm = () => {
        const paymentMethodValid = validatePaymentMethod(paymentMethod);
        const poNumberValid = validatePONumber(poNumber);
        if (isPayPal) {
            return paymentMethodValid;
        }

        if (useTokenExGateway && (paymentMethodDto?.isPaymentProfile || paymentMethodDto?.isCreditCard)) {
            tokenExIframe?.validate();
        } else if (useECheckTokenExGateway && paymentMethodDto?.isECheck) {
            tokenExAccountNumberIframe?.validate();
        }

        if (usePaymetricGateway && cart && cart.showCreditCard && !cart.requiresApproval) {
            const isFormValidForPaymetricPayment = paymentMethodValid && poNumberValid;
            if (!isFormValidForPaymetricPayment) {
                return false;
            }
            if (paymentMethodDto?.isCreditCard && paymetricIframe) {
                paymetricIframe.validate({
                    onValidate: (success: boolean) => {
                        handlePaymetricValidateSuccess(success);
                    },
                });
            } else if (paymentMethodDto?.isPaymentProfile) {
                return true;
            }
        }

        const cardHolderNameValid = validateCardHolderName(cardHolderName);
        const cardNumberResult = validateCardNumber(cardNumber);
        const cardTypeValid = validateCardType(cardType);
        const cardExpired = validateCardExpiration(expirationMonth, expirationYear);
        const securityCodeResult = validateSecurityCode(securityCode);
        const address1Valid = validateAddress1(address1);
        const countryValid = validateCountry(countryId);
        const stateValid = validateState(stateId);
        const cityValid = validateCity(city);
        const postalCodeValid = validatePostalCode(postalCode);
        let accountHolderNameValid = true;
        let accountNumberValid = true;
        let routingNumberValid = true;
        if (eCheckDetails?.current) {
            accountHolderNameValid = eCheckDetails.current.validateAccountHolderNameChange(accountHolderName);
            accountNumberValid = eCheckDetails.current.validateAccountNumberChange(accountNumber);
            routingNumberValid = eCheckDetails.current.validateRoutingNumberChange(routingNumber);
        }

        if (!paymentMethodValid) {
            paymentMethodRef.current?.focus();
        } else if (!poNumberValid) {
            poNumberRef.current?.focus();
        } else if (!cardHolderNameValid) {
            cardHolderNameRef.current?.focus();
        } else if (cardNumberResult.cardNumberEmpty || !cardNumberResult.cardNumberValid) {
            cardNumberRef.current?.focus();
        } else if (!cardTypeValid) {
            cardTypeRef.current?.focus();
        } else if (cardExpired) {
            const today = new Date();
            if (expirationYear < today.getFullYear()) {
                expirationYearRef.current?.focus();
            } else {
                expirationMonthRef.current?.focus();
            }
        } else if (securityCodeResult.securityCodeEmpty || !securityCodeResult.securityCodeValid) {
            securityCodeRef.current?.focus();
        } else if (!address1Valid) {
            address1Ref.current?.focus();
        } else if (!countryValid) {
            countryRef.current?.focus();
        } else if (!stateValid) {
            stateRef.current?.focus();
        } else if (!cityValid) {
            cityRef.current?.focus();
        } else if (!postalCodeValid) {
            postalCodeRef.current?.focus();
        }

        return (
            paymentMethodValid &&
            poNumberValid &&
            cardHolderNameValid &&
            !cardNumberResult.cardNumberEmpty &&
            cardNumberResult.cardNumberValid &&
            cardTypeValid &&
            !cardExpired &&
            !securityCodeResult.securityCodeEmpty &&
            securityCodeResult.securityCodeValid &&
            address1Valid &&
            countryValid &&
            stateValid &&
            cityValid &&
            postalCodeValid &&
            accountHolderNameValid &&
            accountNumberValid &&
            routingNumberValid
        );
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            setShowFormErrors(true);
            return false;
        }

        if (useTokenExGateway && (paymentMethodDto?.isPaymentProfile || paymentMethodDto?.isCreditCard) && !isPayPal) {
            tokenExIframe?.tokenize();
        } else if (useECheckTokenExGateway && !isPayPal && paymentMethodDto?.isECheck) {
            tokenExAccountNumberIframe?.tokenize();
        } else {
            placeOrder({
                paymentMethod,
                poNumber,
                vatNumber,
                saveCard,
                cardHolderName,
                cardNumber,
                cardType,
                expirationMonth,
                expirationYear,
                securityCode,
                useBillingAddress,
                address1,
                countryId,
                stateId,
                city,
                postalCode,
                payPalToken,
                payPalPayerId,
                accountHolderName,
                accountNumber,
                routingNumber,
                onSuccess: (cartId: string) => {
                    preloadOrderConfirmationData({
                        cartId,
                        onSuccess: () => {
                            if (cart?.isAwaitingApproval) {
                                resetCurrentCartId({});
                                toaster.addToast({
                                    body: siteMessage("OrderApproval_OrderPlaced"),
                                    messageType: "success",
                                });
                            }
                            history.push(`${orderConfirmationPageLink!.url}?cartId=${cartId}`);
                        },
                    });
                },
                onComplete(resultProps) {
                    if (!resultProps.apiResult?.cart) {
                        return;
                    }
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.(resultProps.apiResult.cart.id);
                },
            });
        }

        return false;
    };

    const submitPayPalRequest = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        if (!checkoutReviewAndSubmitPageLink) {
            return;
        }
        if (!session?.isAuthenticated) {
            return;
        }
        setPaymentMethod("");
        setRunSubmitPayPal(true);
        setIsPayPal(true);
    };

    if (!tokenExFrameStyleConfig) {
        tokenExFrameStyleConfig = generateTokenExFrameStyleConfig({ theme });
    }

    if (!cart || cart.requiresApproval || !paymentOptions || !orderConfirmationPageLink) {
        return null;
    }

    return (
        <StyledForm
            {...styles.form}
            id="reviewAndSubmitPaymentForm"
            onSubmit={handleFormSubmit}
            noValidate={true}
            data-test-selector="reviewAndSubmitPaymentForm"
        >
            <StyledFieldSet {...styles.fieldset}>
                <Typography {...styles.paymentDetailsHeading} as="h2">
                    {translate("Payment Details")}
                </Typography>
                {isPayPal && (
                    <Typography {...styles.paymentMethodPayPalText} as="span">
                        {translate("Payment Method: PayPal")}
                    </Typography>
                )}
                {!isPayPal && (
                    <GridContainer {...styles.paymentMethodAndPONumberContainer}>
                        <GridItem {...styles.paymentMethodGridItem}>
                            {paymentMethods && paymentMethods.length > 0 && (
                                <>
                                    <Select
                                        {...styles.paymentMethodSelect}
                                        label={translate("Payment Method")}
                                        value={paymentMethod ?? paymentMethodDto?.name}
                                        onChange={handlePaymentMethodChange}
                                        required
                                        error={showFormErrors && paymentMethodError}
                                        data-test-selector="checkoutReviewAndSubmit_paymentMethod"
                                        ref={paymentMethodRef}
                                    >
                                        <option value="">{translate("Select Payment Method")}</option>
                                        {paymentMethods.map(method => (
                                            <option key={method.name} value={method.name}>
                                                {method.description}
                                            </option>
                                        ))}
                                    </Select>
                                    {paymentMethodDto?.isPaymentProfile &&
                                        !paymentMethodDto.isPaymentProfileExpired && (
                                            <PaymentProfileBillingAddress
                                                address={paymentMethodDto.billingAddress}
                                                extendedStyles={styles.paymentProfileBillingAddress}
                                            />
                                        )}
                                    {paymentMethodDto?.isPaymentProfile && paymentMethodDto.isPaymentProfileExpired && (
                                        <StyledWrapper {...styles.paymentProfileExpiredErrorWrapper}>
                                            <Typography {...styles.paymentProfileExpiredErrorText}>
                                                {siteMessage("Checkout_PaymentProfileExpired")}
                                            </Typography>
                                            {savedPaymentsPageLink && (
                                                <Link
                                                    {...styles.paymentProfileEditCardLink}
                                                    onClick={handleEditCardClick}
                                                >
                                                    {translate("Edit Card")}
                                                </Link>
                                            )}
                                        </StyledWrapper>
                                    )}
                                </>
                            )}
                            {showPayPal && (
                                <PayPalButton
                                    {...styles.payPalButton}
                                    submitPayPalRequest={submitPayPalRequest}
                                    error={showFormErrors ? payPalError : undefined}
                                ></PayPalButton>
                            )}
                        </GridItem>
                        {enableVat && (
                            <GridItem {...styles.vatNumberGridItem}>
                                <TextField
                                    {...styles.vatNumberText}
                                    label={translate("VAT Number")}
                                    value={vatNumber}
                                    onChange={handleVatNumberChange}
                                    maxLength={50}
                                    data-test-selector="checkoutReviewAndSubmit_vatNumber"
                                />
                            </GridItem>
                        )}
                        {cart.showPoNumber && (
                            <GridItem {...styles.poNumberGridItem}>
                                <TextField
                                    {...styles.poNumberText}
                                    label={
                                        <>
                                            <span aria-hidden>{translate("PO Number")}</span>
                                            <VisuallyHidden>{translate("Purchase Order Number")}</VisuallyHidden>
                                        </>
                                    }
                                    value={poNumber}
                                    onChange={handlePONumberChange}
                                    required={cart.requiresPoNumber}
                                    maxLength={50}
                                    error={showFormErrors && poNumberError}
                                    data-test-selector="checkoutReviewAndSubmit_poNumber"
                                    ref={poNumberRef}
                                />
                            </GridItem>
                        )}
                        {cart.showPoNumber && enableVat && <GridItem {...styles.emptyGridItem}></GridItem>}
                        {paymentMethodDto?.isPaymentProfile && !paymentMethodDto.isPaymentProfileExpired && (
                            <GridItem width={6}>
                                <SavedPaymentProfileEntry
                                    iframe={
                                        useTokenExGateway ? "TokenEx" : usePaymetricGateway ? "Paymetric" : undefined
                                    }
                                    isTokenExIframeLoaded={isTokenExIframeLoaded}
                                    securityCode={securityCode}
                                    onSecurityCodeChange={handleSecurityCodeChange}
                                    securityCodeError={showFormErrors ? securityCodeError : undefined}
                                    extendedStyles={styles.savedPaymentProfile}
                                />
                            </GridItem>
                        )}
                        {cart.showCreditCard && paymentMethodDto?.isCreditCard && (
                            <GridItem {...styles.creditCardDetailsGridItem}>
                                <CreditCardDetailsEntry
                                    canSaveCard={paymentOptions.canStorePaymentProfile}
                                    iframe={
                                        useTokenExGateway ? "TokenEx" : usePaymetricGateway ? "Paymetric" : undefined
                                    }
                                    paymetricFrameRef={paymetricFrameRef}
                                    isTokenExIframeLoaded={isTokenExIframeLoaded}
                                    saveCard={saveCard}
                                    onSaveCardChange={handleSaveCardChange}
                                    cardHolderName={cardHolderName}
                                    cardHolderNameRef={cardHolderNameRef}
                                    onCardHolderNameChange={handleCardHolderNameChange}
                                    cardHolderNameError={showFormErrors ? cardHolderNameError : undefined}
                                    cardNumber={cardNumber}
                                    cardNumberRef={cardNumberRef}
                                    onCardNumberChange={handleCardNumberChange}
                                    cardNumberError={showFormErrors ? cardNumberError : undefined}
                                    cardType={cardType}
                                    cardTypeRef={cardTypeRef}
                                    possibleCardType={possibleCardType}
                                    onCardTypeChange={handleCardTypeChange}
                                    cardTypeError={showFormErrors ? cardTypeError : undefined}
                                    expirationMonth={expirationMonth}
                                    expirationMonthRef={expirationMonthRef}
                                    onExpirationMonthChange={handleExpirationMonthChange}
                                    expirationYear={expirationYear}
                                    expirationYearRef={expirationYearRef}
                                    onExpirationYearChange={handleExpirationYearChange}
                                    expirationError={showFormErrors ? expirationError : undefined}
                                    securityCode={securityCode}
                                    securityCodeRef={securityCodeRef}
                                    onSecurityCodeChange={handleSecurityCodeChange}
                                    securityCodeError={showFormErrors ? securityCodeError : undefined}
                                    availableCardTypes={paymentOptions.cardTypes ?? []}
                                    availableMonths={paymentOptions.expirationMonths ?? []}
                                    availableYears={paymentOptions.expirationYears ?? []}
                                    extendedStyles={styles.creditCardDetails}
                                />
                            </GridItem>
                        )}
                        {cart.showECheck && paymentMethodDto?.isECheck && (
                            <GridItem {...styles.eCheckDetailsGridItem}>
                                <ECheckDetailsEntry
                                    iframe={useECheckTokenExGateway ? "TokenEx" : undefined}
                                    paymentMethod={paymentMethod}
                                    onAccountHolderNameChange={setAccountHolderName}
                                    onAccountNumberChange={setAccountNumber}
                                    onRoutingNumberChange={setRoutingNumber}
                                    tokenExConfig={tokenExConfig}
                                    tokenExFrameStyleConfig={tokenExFrameStyleConfig}
                                    extendedStyles={styles.eCheckDetailsEntryStyles}
                                    showFormErrors={showFormErrors}
                                    updateIsECheckTokenized={setIsECheckTokenized}
                                    updateShowFormErrors={setShowFormErrors}
                                    setAccountNumberIFrame={handleAccountNumberIFrame}
                                    ref={eCheckDetails}
                                />
                            </GridItem>
                        )}
                        {((cart.showECheck && paymentMethodDto?.isECheck) ||
                            (cart.showCreditCard && paymentMethodDto?.isCreditCard)) && (
                            <GridItem {...styles.creditCardAddressGridItem}>
                                <CreditCardBillingAddressEntry
                                    useBillTo={useBillingAddress}
                                    onUseBillToChange={handleUseBillingAddressChange}
                                    billTo={billToState.value}
                                    address1={address1}
                                    address1Ref={address1Ref}
                                    onAddress1Change={handleAddressChange}
                                    address1Error={showFormErrors ? address1Error : undefined}
                                    country={countryId}
                                    countryRef={countryRef}
                                    onCountryChange={handleCountryChange}
                                    countryError={showFormErrors ? countryError : undefined}
                                    state={stateId}
                                    stateRef={stateRef}
                                    onStateChange={handleStateChange}
                                    stateError={showFormErrors ? stateError : undefined}
                                    city={city}
                                    cityRef={cityRef}
                                    onCityChange={handleCityChange}
                                    cityError={showFormErrors ? cityError : undefined}
                                    postalCode={postalCode}
                                    postalCodeRef={postalCodeRef}
                                    onPostalCodeChange={handlePostalCodeChange}
                                    postalCodeError={showFormErrors ? postalCodeError : undefined}
                                    availableCountries={countries ?? []}
                                    availableStates={selectedCountry?.states}
                                    extendedStyles={styles.creditCardAddress}
                                />
                            </GridItem>
                        )}
                    </GridContainer>
                )}
            </StyledFieldSet>
            {/* This button should only be used to trigger the submit of the form, it is required for IE11 to function. */}
            <button id="reviewAndSubmitPaymentForm-submit" type="submit" style={{ display: "none" }}>
                {translate("Place Order")}
            </button>
        </StyledForm>
    );
};

const widgetModule: WidgetModule = {
    component: connect(
        mapStateToProps,
        mapDispatchToProps,
    )(withToaster(withHistory(withTheme(CheckoutReviewAndSubmitPaymentDetails)))),
    definition: {
        group: "Checkout - Review & Submit",
        displayName: "Payment Details",
        allowedContexts: [CheckoutReviewAndSubmitPageContext],
    },
};

export default widgetModule;
