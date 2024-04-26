/* eslint-disable spire/export-styles */
import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import translate from "@insite/client-framework/Translate";
import { DealerModel } from "@insite/client-framework/Types/ApiModels";
import AddressInfoCondensedDisplay, {
    AddressInfoCondensedDisplayStyles,
} from "@insite/content-library/Components/AddressInfoCondensedDisplay";
import DistanceDisplay, { DistanceUnitOfMeasure } from "@insite/content-library/Components/DistanceDisplay";
import GoogleMapsDirectionLink from "@insite/content-library/Components/GoogleMapsDirectionLink";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import parse from "html-react-parser";
import React from "react";

interface LocationFinderDealerDisplayProps {
    extendedStyles?: LocationFinderDealerDisplayPresentationProps;
    dealer: DealerModel;
    distanceUnitOfMeasure: DistanceUnitOfMeasure;
}

export interface LocationFinderDealerDisplayPresentationProps {
    container?: GridContainerProps;
    nameGridItem?: GridItemProps;
    nameText?: TypographyPresentationProps;
    addressInfoGridItem?: GridItemProps;
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

export const locationFinderDealerDisplayStyles: LocationFinderDealerDisplayPresentationProps = {
    container: {
        gap: 10,
    },
    nameGridItem: {
        width: 12,
    },
    nameText: {
        color: "primary",
        weight: "bold",
        ellipsis: true,
    },
    addressInfoGridItem: {
        width: 12,
    },
    phoneGridItem: {
        width: 12,
    },
    distanceGridItem: {
        width: 12,
    },
    htmlContentGridItem: {
        width: 12,
    },
    googleMapsDirectionLinkGridItem: {
        width: 3,
    },
    visitWebsiteLinkGridItem: {
        width: 3,
    },
};

const LocationFinderDealerDisplay: React.FC<LocationFinderDealerDisplayProps> = ({
    extendedStyles,
    dealer,
    distanceUnitOfMeasure,
}) => {
    const [styles] = React.useState(() => mergeToNew(locationFinderDealerDisplayStyles, extendedStyles));

    return (
        <GridContainer
            {...styles.container}
            data-test-selector="locationFinderDealerDisplay"
            data-test-key={`${dealer.id}`}
        >
            <GridItem {...styles.nameGridItem}>
                <Typography {...styles.nameText}>{dealer.name}</Typography>
            </GridItem>
            <GridItem {...styles.addressInfoGridItem}>
                <AddressInfoCondensedDisplay {...styles.addressInfoCondensed} {...dealer} />
            </GridItem>
            {dealer.phone && (
                <GridItem {...styles.phoneGridItem}>
                    <Link href={`tel:${dealer.phone}`} {...styles.phoneLink} target="_blank">
                        {dealer.phone}
                    </Link>
                </GridItem>
            )}
            {dealer.htmlContent && (
                <>
                    <GridItem {...styles.htmlContentGridItem}>
                        <StyledWrapper
                            {...styles.container}
                            data-test-selector="locationFinderDealerDisplay_htmlContent"
                        >
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
            <GridItem {...styles.distanceGridItem}>
                <DistanceDisplay
                    {...styles.distanceDisplayText}
                    distance={dealer.distance}
                    unitOfMeasure={distanceUnitOfMeasure}
                />
            </GridItem>
        </GridContainer>
    );
};

export default LocationFinderDealerDisplay;
