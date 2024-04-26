import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { FulfillmentMethod } from "@insite/client-framework/Services/SessionService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import changeFulfillmentMethod from "@insite/client-framework/Store/Components/AddressDrawer/Handlers/ChangeFulfillmentMethod";
import setDrawerIsOpen from "@insite/client-framework/Store/Components/AddressDrawer/Handlers/SetDrawerIsOpen";
import setNavDrawerIsOpen from "@insite/client-framework/Store/Components/AddressDrawer/Handlers/SetNavDrawerIsOpen";
import { getSession, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Link, { LinkProps } from "@insite/mobius/Link";
import Radio, { RadioProps } from "@insite/mobius/Radio";
import RadioGroup, { RadioGroupComponentProps, RadioGroupProps } from "@insite/mobius/RadioGroup";
import Typography from "@insite/mobius/Typography";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {}

const mapStateToProps = (state: ApplicationState) => {
    const {
        components: {
            addressDrawer: { fulfillmentMethod },
        },
    } = state;
    const signInPageLink = getPageLinkByPageType(state, "SignInPage")?.url;
    return {
        fulfillmentMethod,
        showPickUpOption: getSettingsCollection(state).accountSettings.enableWarehousePickup,
        signInPageLink,
        showSignInMessage:
            fulfillmentMethod === FulfillmentMethod.Ship && !getSession(state).isAuthenticated && signInPageLink,
    };
};

const mapDispatchToProps = {
    changeFulfillmentMethod,
    setDrawerIsOpen,
    setNavDrawerIsOpen,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasHistory;

export interface AddressDrawerFulfillmentMethodSelectorStyles {
    container?: InjectableCss;
    radioGroup?: RadioGroupProps;
    shipRadio?: RadioProps;
    pickUpRadio?: RadioProps;
}

export const addressDrawerFulfillmentMethodSelectorStyles: AddressDrawerFulfillmentMethodSelectorStyles = {
    container: {
        css: css`
            display: flex;
            flex-direction: column;
        `,
    },
};

const styles = addressDrawerFulfillmentMethodSelectorStyles;

const AddressDrawerFulfillmentMethodSelector = ({
    fulfillmentMethod,
    showPickUpOption,
    signInPageLink,
    showSignInMessage,
    history,
    changeFulfillmentMethod,
    setDrawerIsOpen,
    setNavDrawerIsOpen,
}: Props) => {
    const handleChangeFulfillmentMethod: RadioGroupComponentProps["onChangeHandler"] = event => {
        changeFulfillmentMethod({ fulfillmentMethod: event.target.value });
    };

    const handleSignInMessageClick = () => {
        if (!signInPageLink) {
            return;
        }

        setDrawerIsOpen({ isOpen: false });
        setNavDrawerIsOpen({ navDrawerIsOpen: false });
        history.push(signInPageLink);
        setNavDrawerIsOpen({ navDrawerIsOpen: undefined });
    };

    return (
        <StyledWrapper {...styles.container}>
            <RadioGroup
                {...styles.radioGroup}
                label={translate("Fulfillment Method")}
                value={fulfillmentMethod}
                onChangeHandler={handleChangeFulfillmentMethod}
                aria-controls="addressDrawerPickUpLocationSelector"
            >
                <Radio
                    {...styles.shipRadio}
                    value={FulfillmentMethod.Ship}
                    disabled={!showPickUpOption}
                    data-test-selector="addressDrawer_fulfillmentMethod_ship"
                >
                    {translate("Ship")}
                </Radio>
                {showPickUpOption && (
                    <Radio
                        {...styles.pickUpRadio}
                        value={FulfillmentMethod.PickUp}
                        data-test-selector="addressDrawer_fulfillmentMethod_pickUp"
                    >
                        {translate("Pick Up")}
                    </Radio>
                )}
            </RadioGroup>
            {showSignInMessage && <SignInMessage onClick={handleSignInMessageClick} />}
        </StyledWrapper>
    );
};

interface SignInMessageProps {
    onClick: LinkProps["onClick"];
}

const SignInMessage = ({ onClick }: SignInMessageProps) => {
    return (
        <StyledWrapper
            css={css`
                margin-top: 1rem;
            `}
        >
            <Link onClick={onClick}>{translate("Sign In")}</Link>
            <Typography> {translate("or enter address during checkout")}</Typography>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(AddressDrawerFulfillmentMethodSelector)),
    definition: {
        displayName: "Fulfillment Method Selector",
        fieldDefinitions: [],
        group: "Header",
    },
};
export default widgetModule;
