import { useTokenExFrame } from "@insite/client-framework/Common/Hooks/useTokenExFrame";
import { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import logger from "@insite/client-framework/Logger";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import loadPaymetricConfig from "@insite/client-framework/Store/Context/Handlers/LoadPaymetricConfig";
import loadTokenExConfig from "@insite/client-framework/Store/Context/Handlers/LoadTokenExConfig";
import { getBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import loadBillTo from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadBillTo";
import { getCurrentCountries } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";
import addPaymentProfile from "@insite/client-framework/Store/Data/PaymentProfiles/Handlers/AddPaymentProfile";
import updatePaymentProfile from "@insite/client-framework/Store/Data/PaymentProfiles/Handlers/UpdatePaymentProfile";
import getPaymetricResponsePacket from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/GetPaymetricResponsePacket";
import updateEditModal from "@insite/client-framework/Store/Pages/SavedPayments/Handlers/UpdateEditModal";
import translate from "@insite/client-framework/Translate";
import { AccountPaymentProfileModel } from "@insite/client-framework/Types/ApiModels";
import { PaymentProfilesContext } from "@insite/content-library/Pages/SavedPaymentsPage";
import {
    convertPaymetricCardType,
    convertTokenExCardType,
} from "@insite/content-library/Widgets/SavedPayments/PaymentUtilities";
import PaymetricDetailsEntry, {
    PaymetricDetailsEntryStyles,
} from "@insite/content-library/Widgets/SavedPayments/PaymetricDetailsEntry";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Checkbox, { CheckboxPresentationProps, CheckboxProps } from "@insite/mobius/Checkbox";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import Modal, { ModalProps } from "@insite/mobius/Modal";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import TokenExFrame, { generateTokenExFrameStyleConfig } from "@insite/mobius/TokenExFrame";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import range from "lodash/range";
import * as React from "react";
import { useContext, useRef } from "react";
import { connect, ResolveThunks } from "react-redux";
import styled, { css, ThemeProps, withTheme } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const settingsCollection = getSettingsCollection(state);
    return {
        websiteSettings: settingsCollection.websiteSettings,
        countries: getCurrentCountries(state),
        editingPaymentProfile: state.pages.savedPayments.editingPaymentProfile,
        modalIsOpen: state.pages.savedPayments.editModalIsOpen,
        billToState: getBillToState(state, state.context.session.billToId),
        tokenExConfig: state.context.tokenExConfigs[""],
        usePaymetricGateway: settingsCollection.websiteSettings.usePaymetricGateway,
        paymetricConfig: state.context.paymetricConfig,
    };
};

const mapDispatchToProps = {
    updateEditModal,
    updatePaymentProfile,
    addPaymentProfile,
    loadTokenExConfig,
    loadBillTo,
    loadPaymetricConfig,
    getPaymetricResponsePacket,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & ThemeProps<BaseTheme>;

export interface SavedPaymentsEditCardModalStyles {
    editCardModal?: ModalProps;
    form?: InjectableCss;
    container?: GridContainerProps;
    leftColumn?: GridItemProps;
    cardInfoContainer?: GridContainerProps;
    makeDefaultCardGridItem?: GridItemProps;
    makeDefaultCardCheckbox?: CheckboxPresentationProps;
    cardNicknameGridItem?: GridItemProps;
    cardNicknameTextField?: TextFieldPresentationProps;
    cardNumberGridItem?: GridItemProps;
    cardNumberTokenExFrameWrapper?: InjectableCss;
    cardNumberTextField?: TextFieldPresentationProps;
    nameOnCardGridItem?: GridItemProps;
    nameOnCardTextField?: TextFieldPresentationProps;
    expirationMonthGridItem?: GridItemProps;
    expirationMonthSelect?: SelectPresentationProps;
    expirationYearGridItem?: GridItemProps;
    expirationYearSelect?: SelectPresentationProps;
    rightColumn?: GridItemProps;
    addressContainer?: GridContainerProps;
    useBillToAddressGridItem?: GridItemProps;
    useBillToAddressCheckbox?: CheckboxPresentationProps;
    address1TextFieldGridItem?: GridItemProps;
    address1TextField?: TextFieldPresentationProps;
    address2TextFieldGridItem?: GridItemProps;
    address2TextField?: TextFieldPresentationProps;
    address3TextFieldGridItem?: GridItemProps;
    address3TextField?: TextFieldPresentationProps;
    address4TextFieldGridItem?: GridItemProps;
    address4TextField?: TextFieldPresentationProps;
    countryGridItem?: GridItemProps;
    countrySelect?: SelectPresentationProps;
    stateGridItem?: GridItemProps;
    stateSelect?: SelectPresentationProps;
    cityGridItem?: GridItemProps;
    cityTextField?: TextFieldPresentationProps;
    postalCodeGridItem?: GridItemProps;
    postalCodeTextField?: TextFieldPresentationProps;
    bottomGridItem?: GridItemProps;
    buttonsHidden?: HiddenProps;
    buttonsContainer?: GridContainerProps;
    cancelGridItem?: GridItemProps;
    cancelButton?: ButtonPresentationProps;
    saveGridItem?: GridItemProps;
    saveButton?: ButtonPresentationProps;
    paymetricDetailsStyles?: PaymetricDetailsEntryStyles;
}

export const editCardModalStyles: SavedPaymentsEditCardModalStyles = {
    leftColumn: {
        width: [12, 6, 6, 6, 6],
        css: css`
            flex-direction: column;
        `,
    },
    cardInfoContainer: { gap: 20 },
    makeDefaultCardGridItem: { width: 12 },
    cardNicknameGridItem: { width: 12 },
    cardNumberGridItem: { width: 12 },
    nameOnCardGridItem: { width: 12 },
    expirationMonthGridItem: { width: [8, 7, 8, 8, 8] },
    expirationYearGridItem: {
        width: [4, 5, 4, 4, 4],
        css: css`
            align-items: flex-end;
        `,
    },
    rightColumn: {
        width: [12, 6, 6, 6, 6],
        css: css`
            flex-direction: column;
        `,
    },
    addressContainer: { gap: 20 },
    useBillToAddressGridItem: { width: 12 },
    address1TextFieldGridItem: { width: 12 },
    address2TextFieldGridItem: { width: 12 },
    address3TextFieldGridItem: { width: 12 },
    address4TextFieldGridItem: { width: 12 },
    countryGridItem: { width: 8 },
    stateGridItem: { width: 4 },
    cityGridItem: { width: [8, 6, 8, 8, 8] },
    postalCodeGridItem: { width: [4, 6, 4, 4, 4] },
    bottomGridItem: { width: 12 },
    buttonsHidden: {
        css: css`
            width: 100%;
            display: flex;
            justify-content: flex-end;
        `,
    },
    buttonsContainer: {
        gap: 20,
        css: css`
            & > div {
                justify-content: flex-end;
            }
        `,
    },
    cancelGridItem: { width: [6, 6, 2, 2, 2] },
    cancelButton: {
        variant: "secondary",
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        width: 100%;
                    `,
                    css`
                        width: 100%;
                    `,
                    css`
                        margin-right: 20px;
                    `,
                    css`
                        margin-right: 20px;
                    `,
                    css`
                        margin-right: 20px;
                    `,
                ])}
        `,
    },
    saveGridItem: { width: [6, 6, 2, 2, 2] },
    saveButton: {
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        width: 100%;
                    `,
                    css`
                        width: 100%;
                    `,
                    null,
                    null,
                    null,
                ])}
        `,
    },
};

const styles = editCardModalStyles;
const StyledForm = getStyledWrapper("form");

declare const TokenEx: any;
let tokenExIframe: any | undefined;
let tokenExFrameStyleConfig: any;

declare function $XIFrame(options: any): any;
let paymetricIframe: any;

const CardNumberTokenExFrameWrapper = styled.div<InjectableCss>`
    ${({ css }) => css}
`;

const SavedPaymentsEditCardModal: React.FC<Props> = ({
    theme,
    editingPaymentProfile,
    modalIsOpen,
    websiteSettings,
    countries,
    billToState,
    updateEditModal,
    updatePaymentProfile,
    addPaymentProfile,
    tokenExConfig,
    loadTokenExConfig,
    loadBillTo,
    usePaymetricGateway,
    paymetricConfig,
    loadPaymetricConfig,
    getPaymetricResponsePacket,
}) => {
    const paymentProfilesDataView = useContext(PaymentProfilesContext);
    const usePaymentGateway = websiteSettings.useTokenExGateway || websiteSettings.usePaymetricGateway;

    if (!usePaymentGateway || !countries || !paymentProfilesDataView.value) {
        return null;
    }

    if (websiteSettings.useTokenExGateway) {
        useTokenExFrame(websiteSettings);
    }

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

    React.useEffect(() => {
        if (!billToState.value && !billToState.isLoading && billToState.id) {
            loadBillTo({ billToId: billToState!.id });
        }
    });

    React.useEffect(() => {
        if (websiteSettings.useTokenExGateway) {
            loadTokenExConfig();
        }

        if (usePaymetricGateway) {
            loadPaymetricConfig();
        }
    }, []);

    if (!tokenExFrameStyleConfig) {
        tokenExFrameStyleConfig = generateTokenExFrameStyleConfig({ theme });
    }

    React.useEffect(() => {
        if (editingPaymentProfile) {
            resetFields(editingPaymentProfile);
        }
    }, [editingPaymentProfile]);

    const modalCloseHandler = () => {
        updateEditModal({ modalIsOpen: false });
    };
    const modalOnAfterOpenHandler = () => {
        !editingPaymentProfile && setUpTokenExIframe();

        if (usePaymetricGateway && !editingPaymentProfile) {
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
            paymetricFrameRef.current?.removeEventListener("load", setupPaymetricIframe);
        }
    };
    const modalOnAfterCloseHandler = () => {
        resetFields();
    };

    const [isTokenExIframeLoaded, setIsTokenExIframeLoaded] = React.useState(false);
    const setUpTokenExIframe = () => {
        if (!tokenExConfig) {
            return;
        }

        if (tokenExIframe) {
            tokenExIframe.remove();
        }

        const iframeConfig = {
            authenticationKey: tokenExConfig.authenticationKey,
            cvv: false,
            enablePrettyFormat: true,
            enableValidateOnBlur: true,
            inputType: "text",
            origin: tokenExConfig.origin,
            pci: true,
            styles: tokenExFrameStyleConfig,
            timestamp: tokenExConfig.timestamp,
            tokenExID: tokenExConfig.tokenExId,
            tokenScheme: tokenExConfig.tokenScheme,
        };
        tokenExIframe = new TokenEx.Iframe("tokenExCardNumber", iframeConfig);
        tokenExIframe.load();
        tokenExIframe.on("load", () => {
            setIsTokenExIframeLoaded(true);
        });
        tokenExIframe.on("tokenize", (data: any) => {
            setCardNumber(data.token);
            setCardType(convertTokenExCardType(data.cardType));
            setIsCardNumberTokenized(true);
        });
        tokenExIframe.on("validate", (data: any) => {
            const isCardNumberRequired = !data.isValid && data.validator && data.validator === "required";
            const isInvalidCardNumber = !data.isValid && data.validator && data.validator !== "required";
            const isCardAlreadyExists =
                data.isValid &&
                paymentProfilesDataView.value &&
                paymentProfilesDataView.value.some(
                    o =>
                        o.maskedCardNumber.substring(o.maskedCardNumber.length - 4) === data.lastFour &&
                        o.cardType === convertTokenExCardType(data.cardType),
                );

            if (isCardNumberRequired || isInvalidCardNumber) {
                setCardNumberError(translate("Credit card number is invalid."));
            } else if (isCardAlreadyExists) {
                setCardNumberError(translate("This card already exists."));
            } else {
                setCardNumberError("");
            }

            if (isCardNumberRequired || isInvalidCardNumber || isCardAlreadyExists) {
                setSaving(false);
            }
        });
        tokenExIframe.on("error", (data: any) => {
            logger.error(data);
            setUpTokenExIframe();
        });
    };

    const [makeDefaultCard, setMakeDefaultCard] = React.useState(false);
    const makeDefaultCardChangeHandler: CheckboxProps["onChange"] = (_, value) => {
        setMakeDefaultCard(value);
    };

    const [useBillToAddress, setUseBillToAddress] = React.useState(false);
    const useBillToAddressChangeHandler: CheckboxProps["onChange"] = (_, value) => {
        setUseBillToAddress(value);

        const { value: billTo } = billToState;

        if (value === false || !billTo) {
            return;
        }

        setAddress1(billTo.address1);
        setAddress2(billTo.address2);
        setAddress3(billTo.address3);
        setAddress4(billTo.address4);
        const billToCountry = countries.find(o => o.id === billTo!.country?.id)!;
        setCountry(billToCountry);
        if (billToCountry && billToCountry.states && billToCountry.states.length > 0) {
            setState(billToCountry.states.find(o => o.abbreviation === billTo!.state?.abbreviation));
        } else {
            setState(undefined);
        }
        setCity(billTo.city);
        setPostalCode(billTo.postalCode);
    };

    const [cardNickname, setCardNickname] = React.useState("");
    const [cardNicknameError, setCardNicknameError] = React.useState("");
    const cardNicknameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCardNickname(event.target.value);
        setCardNicknameError(
            paymentProfilesDataView.value &&
                paymentProfilesDataView.value.some(o => o.description === event.target.value)
                ? translate("This nickname already exists.")
                : "",
        );
    };

    const [cardNumber, setCardNumber] = React.useState("");
    const [cardNumberError, setCardNumberError] = React.useState("");
    const [cardType, setCardType] = React.useState("");

    const [nameOnCard, setNameOnCard] = React.useState("");
    const [nameOnCardError, setNameOnCardError] = React.useState("");
    const nameOnCardChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNameOnCard(event.target.value);
        setNameOnCardError(!event.target.value.trim() ? translate("Name on card is required.") : "");
    };

    const [minMonth, setMinMonth] = React.useState(new Date().getMonth() + 1);
    const [expirationMonth, setExpirationMonth] = React.useState(minMonth);
    const expirationMonthChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setExpirationMonth(Number(event.target.value));
    };

    const expirationYears = range(new Date().getFullYear(), new Date().getFullYear() + 10);
    const [expirationYear, setExpirationYear] = React.useState(expirationYears[0]);
    const expirationYearChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setExpirationYear(Number(event.target.value));
    };

    React.useEffect(() => {
        const newMinMonth = expirationYear === new Date().getFullYear() ? new Date().getMonth() + 1 : 1;
        setMinMonth(newMinMonth);

        if (expirationMonth < newMinMonth) {
            setExpirationMonth(newMinMonth);
        }
    }, [expirationYear, expirationMonth]);

    const [address1, setAddress1] = React.useState("");
    const [address1Error, setAddress1Error] = React.useState("");
    const address1ChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress1(event.target.value);
        setAddress1Error(!event.target.value.trim() ? translate("Address Line 1 is required.") : "");
    };

    const [address2, setAddress2] = React.useState("");
    const address2ChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress2(event.target.value);
    };

    const [address3, setAddress3] = React.useState("");
    const address3ChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress3(event.target.value);
    };

    const [address4, setAddress4] = React.useState("");
    const address4ChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress4(event.target.value);
    };

    const [country, setCountry] = React.useState(countries[0]);
    const countryChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCountry = countries.find(o => o.abbreviation === event.target.value) || countries[0];
        setCountry(selectedCountry);
        if (!selectedCountry.states || selectedCountry.states.length === 0) {
            setState(undefined);
        } else {
            setState(selectedCountry.states[0]);
        }
    };

    const [state, setState] = React.useState(country.states?.[0]);
    const stateChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setState(country.states!.find(o => o.abbreviation === event.target.value));
    };

    const [city, setCity] = React.useState("");
    const [cityError, setCityError] = React.useState("");
    const cityChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
        setCityError(!event.target.value.trim() ? translate("City is required.") : "");
    };

    const [postalCode, setPostalCode] = React.useState("");
    const [postalCodeError, setPostalCodeError] = React.useState("");
    const postalCodeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostalCode(event.target.value);
        setPostalCodeError(!event.target.value.trim() ? translate("Postal Code is required.") : "");
    };

    const [saving, setSaving] = React.useState(false);

    const resetFields = (paymentProfile?: AccountPaymentProfileModel) => {
        setSaving(false);
        setMakeDefaultCard(paymentProfile?.isDefault || false);
        setCardNickname(paymentProfile?.description || "");
        setCardNicknameError("");
        setCardNumber(paymentProfile?.maskedCardNumber || "");
        setCardNumberError("");
        setCardType(paymentProfile?.cardType || "");
        setNameOnCard(paymentProfile?.cardHolderName || "");
        setNameOnCardError("");
        setExpirationYear(
            paymentProfile ? Number(paymentProfile.expirationDate.split("/")[1]) + 2000 : expirationYears[0],
        );
        setExpirationMonth(
            paymentProfile ? Number(paymentProfile.expirationDate?.split("/")[0]) : new Date().getMonth() + 1,
        );
        setUseBillToAddress(false);
        setAddress1(paymentProfile?.address1 || "");
        setAddress1Error("");
        setAddress2(paymentProfile?.address2 || "");
        setAddress3(paymentProfile?.address3 || "");
        setAddress4(paymentProfile?.address4 || "");
        const country = countries.find(o => o.abbreviation === paymentProfile?.country) || countries[0];
        setCountry(country);
        const state =
            country.states && country.states.length > 0
                ? country.states.find(o => o.abbreviation === paymentProfile?.state) || country.states[0]
                : undefined;
        setState(state);
        setCity(paymentProfile?.city || "");
        setCityError("");
        setPostalCode(paymentProfile?.postalCode || "");
        setPostalCodeError("");
        setIsTokenExIframeLoaded(false);
        setIsCardNumberTokenized(false);
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
                    setNameOnCard(result.apiResult.creditCard.cardHolderName!);
                    setIsCardNumberTokenized(true);
                }
            },
        });
    };

    const validate = () => {
        if (!editingPaymentProfile && websiteSettings.useTokenExGateway) {
            tokenExIframe.validate();
        }

        if (!editingPaymentProfile && usePaymetricGateway) {
            const readyForPaymetricValidation = !(!address1.trim() || !city.trim() || !postalCode.trim());
            if (paymetricIframe && readyForPaymetricValidation) {
                paymetricIframe.validate({
                    onValidate: (success: boolean) => {
                        handlePaymetricValidateSuccess(success);
                    },
                });
            }
        }

        setNameOnCardError(!nameOnCard.trim() ? translate("Name on card is required.") : "");
        setAddress1Error(!address1.trim() ? translate("Address Line 1 is required.") : "");
        setCityError(!city.trim() ? translate("City is required.") : "");
        setPostalCodeError(!postalCode.trim() ? translate("Postal Code is required.") : "");

        if (cardNumberError.trim() || cardNicknameError.trim()) {
            return false;
        }

        if (!nameOnCard.trim() || !address1.trim() || !city.trim() || !postalCode.trim()) {
            return false;
        }

        return true;
    };

    const saveClickHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        if (!validate()) {
            setSaving(false);
            return;
        }

        setSaving(true);
        if (editingPaymentProfile) {
            continueSave();
        } else {
            tokenExIframe.tokenize();
        }
    };

    const [isCardNumberTokenized, setIsCardNumberTokenized] = React.useState(false);
    React.useEffect(() => {
        if (isCardNumberTokenized) {
            continueSave();
        }
    }, [isCardNumberTokenized]);
    const toasterContext = React.useContext(ToasterContext);

    const continueSave = () => {
        const paymentProfileToSave = {
            id: editingPaymentProfile ? editingPaymentProfile.id : undefined,
            description: cardNickname,
            expirationDate: `${`0${expirationMonth}`.slice(-2)}/${expirationYear.toString().substring(2)}`,
            cardIdentifier: cardNumber,
            cardType,
            cardHolderName: nameOnCard,
            address1,
            address2,
            address3,
            address4,
            country: country.abbreviation,
            state: state?.abbreviation ?? "",
            city,
            postalCode,
            isDefault: makeDefaultCard,
        } as AccountPaymentProfileModel;

        const onSuccessSave = () => {
            setSaving(false);
            updateEditModal({ modalIsOpen: false });
            toasterContext.addToast({
                body: translate(`Card ${!editingPaymentProfile ? "Saved" : "Updated"}`),
                messageType: "success",
            });
        };

        if (editingPaymentProfile) {
            updatePaymentProfile({
                paymentProfile: paymentProfileToSave,
                onSuccess: onSuccessSave,
                onComplete(resultProps) {
                    if (resultProps.apiResult) {
                        // "this" is targeting the object being created, not the parent SFC
                        // eslint-disable-next-line react/no-this-in-sfc
                        this.onSuccess?.();
                    }
                },
            });
        } else {
            addPaymentProfile({
                paymentProfile: paymentProfileToSave,
                onSuccess: onSuccessSave,
                onComplete(resultProps) {
                    if (resultProps.apiResult) {
                        // "this" is targeting the object being created, not the parent SFC
                        // eslint-disable-next-line react/no-this-in-sfc
                        this.onSuccess?.();
                    }
                },
            });
        }
    };

    const cancelClickHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        updateEditModal({ modalIsOpen: false });
    };

    const cancelBtn = (
        <Button onClick={cancelClickHandler} data-test-selector="editCardModal_cancelButton" {...styles.cancelButton}>
            {translate("Cancel")}
        </Button>
    );
    const saveBtn = (
        <Button
            type="submit"
            form="editCardForm"
            disabled={saving}
            onClick={saveClickHandler}
            data-test-selector="editCardModal_saveButton"
            {...styles.saveButton}
        >
            {translate("Save")}
        </Button>
    );

    return (
        <Modal
            headline={translate(editingPaymentProfile ? "Edit Card" : "Add a Card")}
            {...styles.editCardModal}
            isOpen={modalIsOpen}
            handleClose={modalCloseHandler}
            onAfterOpen={modalOnAfterOpenHandler}
            onAfterClose={modalOnAfterCloseHandler}
        >
            <StyledForm {...styles.form} id="editCardForm" data-test-selector="editCardModal">
                <GridContainer {...styles.container}>
                    <GridItem {...styles.leftColumn}>
                        <GridContainer {...styles.cardInfoContainer}>
                            <GridItem {...styles.makeDefaultCardGridItem}>
                                <Checkbox
                                    checked={makeDefaultCard}
                                    onChange={makeDefaultCardChangeHandler}
                                    {...styles.makeDefaultCardCheckbox}
                                    data-test-selector="isDefault"
                                >
                                    {translate("Make default")}
                                </Checkbox>
                            </GridItem>
                            <GridItem {...styles.cardNicknameGridItem}>
                                <TextField
                                    label={translate("Card Nickname")}
                                    {...styles.cardNicknameTextField}
                                    value={cardNickname}
                                    maxLength={100}
                                    error={cardNicknameError}
                                    onChange={cardNicknameChangeHandler}
                                    data-test-selector="cardNickname"
                                />
                            </GridItem>
                            {usePaymetricGateway && !editingPaymentProfile ? (
                                <PaymetricDetailsEntry
                                    ref={paymetricFrameRef}
                                    extendedStyles={styles.paymetricDetailsStyles}
                                />
                            ) : (
                                <>
                                    <GridItem {...styles.cardNumberGridItem}>
                                        {!editingPaymentProfile ? (
                                            <TokenExFrame
                                                label={translate("Card Number")}
                                                tokenExIFrameContainer={
                                                    <CardNumberTokenExFrameWrapper
                                                        {...styles.cardNumberTokenExFrameWrapper}
                                                        id="tokenExCardNumber"
                                                    />
                                                }
                                                disabled={!isTokenExIframeLoaded}
                                                required
                                                error={cardNumberError}
                                                data-test-selector="cardNumber"
                                            />
                                        ) : (
                                            <TextField
                                                label={translate("Card Number")}
                                                {...styles.cardNumberTextField}
                                                disabled
                                                value={editingPaymentProfile?.maskedCardNumber || ""}
                                            />
                                        )}
                                    </GridItem>
                                    <GridItem {...styles.nameOnCardGridItem}>
                                        <TextField
                                            label={translate("Name on Card")}
                                            {...styles.nameOnCardTextField}
                                            required
                                            maxLength={50}
                                            value={nameOnCard}
                                            error={nameOnCardError}
                                            onChange={nameOnCardChangeHandler}
                                            data-test-selector="nameOnCard"
                                        />
                                    </GridItem>
                                    <GridItem {...styles.expirationMonthGridItem}>
                                        <Select
                                            label={translate("Expiration")}
                                            {...styles.expirationMonthSelect}
                                            required
                                            value={expirationMonth}
                                            onChange={expirationMonthChangeHandler}
                                            data-test-selector="expirationMonth"
                                        >
                                            {minMonth === 1 && <option value="1">{translate("January")}</option>}
                                            {minMonth <= 2 && <option value="2">{translate("February")}</option>}
                                            {minMonth <= 3 && <option value="3">{translate("March")}</option>}
                                            {minMonth <= 4 && <option value="4">{translate("April")}</option>}
                                            {minMonth <= 5 && <option value="5">{translate("May")}</option>}
                                            {minMonth <= 6 && <option value="6">{translate("June")}</option>}
                                            {minMonth <= 7 && <option value="7">{translate("July")}</option>}
                                            {minMonth <= 8 && <option value="8">{translate("August")}</option>}
                                            {minMonth <= 9 && <option value="9">{translate("September")}</option>}
                                            {minMonth <= 10 && <option value="10">{translate("October")}</option>}
                                            {minMonth <= 11 && <option value="11">{translate("November")}</option>}
                                            {minMonth <= 12 && <option value="12">{translate("December")}</option>}
                                        </Select>
                                    </GridItem>
                                    <GridItem {...styles.expirationYearGridItem}>
                                        <Select
                                            {...styles.expirationYearSelect}
                                            required
                                            value={expirationYear}
                                            onChange={expirationYearChangeHandler}
                                            data-test-selector="expirationYear"
                                        >
                                            {expirationYears.map(year => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </Select>
                                    </GridItem>
                                </>
                            )}
                        </GridContainer>
                    </GridItem>
                    <GridItem {...styles.rightColumn}>
                        <GridContainer {...styles.addressContainer}>
                            <GridItem {...styles.useBillToAddressGridItem}>
                                <Checkbox
                                    checked={useBillToAddress}
                                    onChange={useBillToAddressChangeHandler}
                                    {...styles.useBillToAddressCheckbox}
                                    data-test-selector="copyBillToAddress"
                                >
                                    {translate("Copy address from Bill To")}
                                </Checkbox>
                            </GridItem>
                            <GridItem {...styles.address1TextFieldGridItem}>
                                <TextField
                                    label={translate("Address Line 1")}
                                    {...styles.address1TextField}
                                    required
                                    maxLength={100}
                                    value={address1}
                                    error={address1Error}
                                    disabled={useBillToAddress}
                                    onChange={address1ChangeHandler}
                                    data-test-selector="addressLine1"
                                />
                            </GridItem>
                            <GridItem {...styles.address2TextFieldGridItem}>
                                <TextField
                                    label={translate("Address Line 2")}
                                    {...styles.address2TextField}
                                    value={address2}
                                    maxLength={100}
                                    disabled={useBillToAddress}
                                    onChange={address2ChangeHandler}
                                    data-test-selector="addressLine2"
                                />
                            </GridItem>
                            <GridItem {...styles.address3TextFieldGridItem}>
                                <TextField
                                    label={translate("Address Line 3")}
                                    {...styles.address3TextField}
                                    value={address3}
                                    maxLength={100}
                                    disabled={useBillToAddress}
                                    onChange={address3ChangeHandler}
                                    data-test-selector="addressLine3"
                                />
                            </GridItem>
                            <GridItem {...styles.address4TextFieldGridItem}>
                                <TextField
                                    label={translate("Address Line 4")}
                                    {...styles.address4TextField}
                                    value={address4}
                                    maxLength={100}
                                    disabled={useBillToAddress}
                                    onChange={address4ChangeHandler}
                                    data-test-selector="addressLine4"
                                />
                            </GridItem>
                            <GridItem {...styles.countryGridItem}>
                                <Select
                                    label={translate("Country")}
                                    {...styles.countrySelect}
                                    required
                                    value={country.abbreviation}
                                    disabled={useBillToAddress}
                                    onChange={countryChangeHandler}
                                    data-test-selector="country"
                                >
                                    {countries.map(o => (
                                        <option key={o.abbreviation} value={o.abbreviation}>
                                            {o.name}
                                        </option>
                                    ))}
                                </Select>
                            </GridItem>
                            <GridItem {...styles.stateGridItem}>
                                {country.states && country.states.length > 0 && (
                                    <Select
                                        label={translate("State")}
                                        {...styles.stateSelect}
                                        required
                                        value={state?.abbreviation}
                                        disabled={useBillToAddress}
                                        onChange={stateChangeHandler}
                                        data-test-selector="state"
                                    >
                                        {country.states.map(o => (
                                            <option key={o.abbreviation} value={o.abbreviation}>
                                                {o.abbreviation}
                                            </option>
                                        ))}
                                    </Select>
                                )}
                            </GridItem>
                            <GridItem {...styles.cityGridItem}>
                                <TextField
                                    label={translate("City")}
                                    {...styles.cityTextField}
                                    required
                                    maxLength={50}
                                    value={city}
                                    error={cityError}
                                    disabled={useBillToAddress}
                                    onChange={cityChangeHandler}
                                    data-test-selector="city"
                                />
                            </GridItem>
                            <GridItem {...styles.postalCodeGridItem}>
                                <TextField
                                    label={translate("Postal Code")}
                                    {...styles.postalCodeTextField}
                                    required
                                    maxLength={50}
                                    value={postalCode}
                                    error={postalCodeError}
                                    disabled={useBillToAddress}
                                    onChange={postalCodeChangeHandler}
                                    data-test-selector="postalCode"
                                />
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    <GridItem {...styles.bottomGridItem}>
                        <Hidden above="sm" {...styles.buttonsHidden}>
                            <GridContainer {...styles.buttonsContainer}>
                                <GridItem {...styles.cancelGridItem}>{cancelBtn}</GridItem>
                                <GridItem {...styles.saveGridItem}>{saveBtn}</GridItem>
                            </GridContainer>
                        </Hidden>
                        <Hidden below="md" {...styles.buttonsHidden} data-test-selector="forDesktop">
                            {cancelBtn}
                            {saveBtn}
                        </Hidden>
                    </GridItem>
                </GridContainer>
            </StyledForm>
        </Modal>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(SavedPaymentsEditCardModal));
