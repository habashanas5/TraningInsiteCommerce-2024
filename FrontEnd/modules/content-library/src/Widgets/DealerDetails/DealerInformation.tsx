import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { DealerStateContext } from "@insite/client-framework/Store/Data/Dealers/DealersSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import { DealerModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import AddressInfoCondensedDisplay, {
    AddressInfoCondensedDisplayStyles,
} from "@insite/content-library/Components/AddressInfoCondensedDisplay";
import DistanceDisplay, { DistanceUnitOfMeasure } from "@insite/content-library/Components/DistanceDisplay";
import GoogleMapsDirectionLink from "@insite/content-library/Components/GoogleMapsDirectionLink";
import { DealerDetailsPageContext } from "@insite/content-library/Pages/DealerDetailsPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import ChevronLeft from "@insite/mobius/Icons/ChevronLeft";
import MapPin from "@insite/mobius/Icons/MapPin";
import Phone from "@insite/mobius/Icons/Phone";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import parse from "html-react-parser";
import React, { useContext } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    locationFinderUrl: getPageLinkByPageType(state, "LocationFinderPage")?.url,
});

type Props = ReturnType<typeof mapStateToProps> & HasHistory;

export interface DealerInformationStyles {
    container?: GridContainerProps;
    selectedDealerDisplayBackToResultsGridItem?: GridItemProps;
    selectedDealerDisplayBackToResultsLink?: LinkPresentationProps;
    nameGridItem?: GridItemProps;
    nameText?: TypographyPresentationProps;
    addressInfoGridItem?: GridItemProps;
    addressInfoIcon?: IconPresentationProps;
    addressInfoCondensed?: AddressInfoCondensedDisplayStyles;
    phoneGridItem?: GridItemProps;
    phoneLink?: LinkPresentationProps;
    distanceGridItem?: GridItemProps;
    distanceDisplayText?: TypographyPresentationProps;
    htmlContentGridItem?: GridItemProps;
    googleMapsDirectionLinkGridItem?: GridItemProps;
    googleMapsDirectionLink?: LinkPresentationProps;
    visitWebsiteLinkGridItem?: GridItemProps;
    visitWebsiteLink?: LinkPresentationProps;
}

export const dealerInformationStyles: DealerInformationStyles = {
    container: {
        gap: 10,
    },
    selectedDealerDisplayBackToResultsGridItem: {
        width: 12,
    },
    selectedDealerDisplayBackToResultsLink: {
        icon: {
            iconProps: {
                src: ChevronLeft,
            },
            position: "left",
        },
    },
    nameGridItem: {
        width: 12,
        css: css`
            padding-left: 40px;
        `,
    },
    nameText: {
        color: "primary",
        weight: "bold",
        ellipsis: true,
    },
    addressInfoGridItem: {
        width: 12,
    },
    addressInfoIcon: {
        src: "MapPin",
        color: "primary",
    },
    addressInfoCondensed: {
        wrapper: {
            css: css`
                padding-left: 10px;
                font-style: normal;
            `,
        },
    },
    phoneGridItem: {
        width: 12,
    },
    phoneLink: {
        icon: {
            iconProps: {
                src: Phone,
            },
            position: "left",
        },
        typographyProps: {
            css: css`
                padding-left: 10px;
            `,
        },
    },
    htmlContentGridItem: {
        width: 12,
        css: css`
            padding-left: 40px;
        `,
    },
    googleMapsDirectionLinkGridItem: {
        width: 3,
    },
    visitWebsiteLinkGridItem: {
        width: 6,
    },
};

const styles = dealerInformationStyles;

const DealerInformation: React.FC<Props> = ({ history, locationFinderUrl }) => {
    const { value: dealer } = useContext(DealerStateContext);
    if (!dealer) {
        return null;
    }

    const handleBackToResults = () => {
        history.push(locationFinderUrl!);
    };

    return (
        <GridContainer {...styles.container} data-test-selector="dealerInformation" data-test-key={`${dealer.id}`}>
            <GridItem {...styles.selectedDealerDisplayBackToResultsGridItem}>
                <Link onClick={handleBackToResults} {...styles.selectedDealerDisplayBackToResultsLink}>
                    {translate("Back to Results")}
                </Link>
            </GridItem>
            <GridItem {...styles.nameGridItem}>
                <Typography {...styles.nameText}>{dealer.name}</Typography>
            </GridItem>
            <GridItem {...styles.addressInfoGridItem}>
                <Icon {...styles.addressInfoIcon} />
                <AddressInfoCondensedDisplay {...dealer} extendedStyles={styles.addressInfoCondensed} />
            </GridItem>
            {dealer.phone && (
                <GridItem {...styles.phoneGridItem}>
                    {/* <Phone /> */}
                    <Link href={`tel:${dealer.phone}`} {...styles.phoneLink} target="_blank">
                        {dealer.phone}
                    </Link>
                </GridItem>
            )}
            {dealer.htmlContent && (
                <>
                    <GridItem {...styles.htmlContentGridItem}>
                        <StyledWrapper {...styles.container} data-test-selector="dealerInformation_htmlContent">
                            {parse(dealer.htmlContent, parserOptions)}
                        </StyledWrapper>
                    </GridItem>
                </>
            )}
            <GridItem {...styles.googleMapsDirectionLinkGridItem}>
                <GoogleMapsDirectionLink {...styles.googleMapsDirectionLink} {...dealer} />
            </GridItem>
            <GridItem {...styles.visitWebsiteLinkGridItem}>
                <Link href={dealer.webSiteUrl} target="_blank" {...styles.visitWebsiteLink}>
                    {translate("Visit Website")}
                </Link>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withHistory(DealerInformation)),
    definition: {
        allowedContexts: [DealerDetailsPageContext],
        group: "Dealer Details",
    },
};

export default widgetModule;
