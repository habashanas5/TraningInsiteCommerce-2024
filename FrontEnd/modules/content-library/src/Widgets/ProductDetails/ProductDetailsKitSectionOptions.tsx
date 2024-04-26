import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasParentProductId, withParentProductId } from "@insite/client-framework/Components/ParentProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getProductState } from "@insite/client-framework/Store/Data/Products/ProductsSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & HasParentProductId;

const mapStateToProps = (state: ApplicationState, ownProps: HasParentProductId) => ({
    configuration: getProductState(state, ownProps.parentProductId).value?.detail?.configuration,
});

export interface ProductDetailsKitSectionOptionsStyles {
    wrapper?: InjectableCss;
    configSectionWrapper?: InjectableCss;
    configSectionLabel?: TypographyPresentationProps;
    sectionOptionText?: TypographyPresentationProps;
}

export const productDetailsKitSectionOptionsStyles: ProductDetailsKitSectionOptionsStyles = {
    wrapper: {
        css: css`
            margin-bottom: 10px;
            line-height: 25px;
        `,
    },
    configSectionLabel: {
        weight: "bold",
        css: css`
            display: block;
        `,
    },
    sectionOptionText: {
        css: css`
            display: block;
        `,
    },
};

const styles = productDetailsKitSectionOptionsStyles;

const ProductDetailsKitSectionOptions: React.FC<Props> = ({ configuration }) => {
    if (!configuration || configuration.configSections?.length === 0) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            {configuration.isKit &&
                configuration?.configSections?.map(
                    configSection =>
                        !!configSection.sectionOptions?.length && (
                            <StyledWrapper {...styles.configSectionWrapper} key={configSection.id}>
                                <Typography {...styles.configSectionLabel}>
                                    {configSection.label || configSection.sectionName}:
                                </Typography>
                                {configSection.sectionOptions?.map(sectionOption => (
                                    <Typography {...styles.sectionOptionText} key={sectionOption.id}>
                                        {sectionOption.description}
                                    </Typography>
                                ))}
                            </StyledWrapper>
                        ),
                )}
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: withParentProductId(connect(mapStateToProps)(ProductDetailsKitSectionOptions)),
    definition: {
        group: "Product Details",
        allowedContexts: [ProductDetailsPageContext],
    },
};

export default widgetModule;
