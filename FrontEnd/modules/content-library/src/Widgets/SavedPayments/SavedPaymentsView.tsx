import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Zone from "@insite/client-framework/Components/Zone";
import siteMessage from "@insite/client-framework/SiteMessage";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { PaymentProfilesContext, SavedPaymentsPageContext } from "@insite/content-library/Pages/SavedPaymentsPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Icon, { IconProps } from "@insite/mobius/Icon";
import CreditCard from "@insite/mobius/Icons/CreditCard";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { useContext } from "react";
import { css } from "styled-components";

type Props = WidgetProps;

export interface SavedPaymentsViewStyles {
    centeringWrapper?: InjectableCss;
    loadingSpinner?: LoadingSpinnerProps;
    noPaymentsWrapper?: InjectableCss;
    noPaymentsIconWrapper?: InjectableCss;
    noPaymentsIcon?: IconProps;
    noPaymentsText?: TypographyProps;
    headerContainer?: GridContainerProps;
    headerLeftColumnGridItem?: GridItemProps;
    headerRightColumnGridItem?: GridItemProps;
    mainContainer?: GridContainerProps;
    mainLeftColumnGridItem?: GridItemProps;
    mainRightColumnGridItem?: GridItemProps;
}

export const viewStyles: SavedPaymentsViewStyles = {
    centeringWrapper: {
        css: css`
            height: 300px;
            display: flex;
            align-items: center;
        `,
    },
    loadingSpinner: {
        css: css`
            margin: auto;
        `,
    },
    noPaymentsWrapper: {
        css: css`
            height: 600px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        `,
    },
    noPaymentsIconWrapper: {
        css: css`
            height: 150px;
            width: 150px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: ${getColor("common.accent")};
            border-radius: 75px;
            margin-bottom: 20px;
        `,
    },
    noPaymentsIcon: {
        src: CreditCard,
        color: "primary",
        size: 75,
    },
    noPaymentsText: {
        variant: "h4",
        as: "span",
    },
    headerLeftColumnGridItem: {
        width: [10, 10, 6, 6, 6],
        align: "top",
    },
    headerRightColumnGridItem: {
        width: [2, 2, 6, 6, 6],
        align: "top",
    },
    mainLeftColumnGridItem: {
        width: [12, 12, 12, 6, 6],
        align: "top",
    },
    mainRightColumnGridItem: {
        width: [12, 12, 12, 6, 6],
        align: "top",
    },
};

const styles = viewStyles;

const SavedPaymentsView: React.FC<Props> = ({ id }) => {
    const paymentProfilesDataView = useContext(PaymentProfilesContext);

    const isLoaded = paymentProfilesDataView.value && !paymentProfilesDataView.isLoading;
    const hasSavedPayments = isLoaded && paymentProfilesDataView.value!.length > 0;

    return (
        <>
            <GridContainer {...styles.headerContainer}>
                <GridItem {...styles.headerLeftColumnGridItem}>
                    <Zone contentId={id} zoneName="Content0" />
                </GridItem>
                <GridItem {...styles.headerRightColumnGridItem}>
                    <Zone contentId={id} zoneName="Content1" />
                </GridItem>
            </GridContainer>
            {!isLoaded && (
                <StyledWrapper {...styles.centeringWrapper}>
                    <LoadingSpinner {...styles.loadingSpinner} />
                </StyledWrapper>
            )}
            {isLoaded && !hasSavedPayments && (
                <StyledWrapper {...styles.noPaymentsWrapper}>
                    <StyledWrapper {...styles.noPaymentsIconWrapper}>
                        <Icon {...styles.noPaymentsIcon} />
                    </StyledWrapper>
                    <Typography {...styles.noPaymentsText} data-test-selector="noPaymentsMessage">
                        {siteMessage("SavedPayments_NoSavedPaymentsMessage")}
                    </Typography>
                </StyledWrapper>
            )}
            {isLoaded && hasSavedPayments && (
                <GridContainer {...styles.mainContainer}>
                    <GridItem {...styles.mainLeftColumnGridItem}>
                        <Zone contentId={id} zoneName="Content2" />
                    </GridItem>
                    <GridItem {...styles.mainRightColumnGridItem}>
                        <Zone contentId={id} zoneName="Content3" />
                    </GridItem>
                </GridContainer>
            )}
        </>
    );
};

const widgetModule: WidgetModule = {
    component: SavedPaymentsView,
    definition: {
        displayName: "View",
        group: "Saved Payments",
        allowedContexts: [SavedPaymentsPageContext],
    },
};

export default widgetModule;
