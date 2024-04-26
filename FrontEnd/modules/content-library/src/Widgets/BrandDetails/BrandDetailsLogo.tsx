import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { BrandStateContext } from "@insite/client-framework/Store/Data/Brands/BrandsSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { BrandDetailsPageContext } from "@insite/content-library/Pages/BrandDetailsPage";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC, useContext } from "react";
import { css } from "styled-components";

interface Props extends WidgetProps {}

export interface BrandDetailsLogoStyles {
    container?: InjectableCss;
    image?: LazyImageProps;
    heading?: TypographyProps;
}

export const logoStyles: BrandDetailsLogoStyles = {
    heading: {
        variant: "h1",
        css: css`
            overflow-wrap: break-word;
            word-wrap: break-word;
        `,
    },
    container: {
        css: css`
            width: 100%;
            margin: 15px;
        `,
    },
    image: {
        css: css`
            width: 100%;
            img {
                height: 100%;
            }
        `,
    },
};

const styles = logoStyles;

const BrandDetailsLogo: FC<Props> = () => {
    const { value: brand } = useContext(BrandStateContext);
    if (!brand) {
        return null;
    }
    return (
        <StyledWrapper {...styles.container} data-test-selector="brandLogo">
            {brand.logoLargeImagePath ? (
                <LazyImage src={brand.logoLargeImagePath} altText={brand.logoAltText} {...styles.image} />
            ) : (
                <Typography data-test-selector="brandLogoHeading" {...styles.heading}>
                    {brand.name}
                </Typography>
            )}
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: BrandDetailsLogo,
    definition: {
        group: "Brand Details",
        icon: "Logo",
        displayName: "Brand Logo",
        allowedContexts: [BrandDetailsPageContext],
    },
};

export default widgetModule;
