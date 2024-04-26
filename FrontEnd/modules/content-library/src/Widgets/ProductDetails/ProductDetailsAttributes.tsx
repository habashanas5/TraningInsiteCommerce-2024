import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { css } from "styled-components";

type Props = WidgetProps & HasProduct;

export interface ProductDetailsAttributesStyles {
    wrapper?: InjectableCss;
    attributeTypeLabelText?: TypographyPresentationProps;
    attributeTypeValuesText?: TypographyPresentationProps;
}

export const attributesStyles: ProductDetailsAttributesStyles = {
    wrapper: {
        css: css`
            padding-bottom: 15px;
        `,
    },
    attributeTypeLabelText: {
        weight: "bold",
    },
    attributeTypeValuesText: {
        css: css`
            margin-bottom: 5px;
        `,
    },
};

const styles = attributesStyles;

const ProductDetailsAttributes: React.FC<Props> = ({ product: { brand, attributeTypes } }) => {
    if (!brand && (!attributeTypes || attributeTypes.length === 0)) {
        return null;
    }

    const limitedAttributeTypes = (attributeTypes ?? []).slice(0, 5);

    return (
        <StyledWrapper {...styles.wrapper} data-test-selector="productDetails_attributes">
            {brand && (
                <Typography data-test-selector="brand_item" as="p" {...styles.attributeTypeValuesText}>
                    <Typography data-test-selector="brand_item_label" {...styles.attributeTypeLabelText}>
                        {translate("Brand")}&nbsp;:&nbsp;
                    </Typography>
                    <span data-test-selector="brand_item_value">{brand.name}</span>
                </Typography>
            )}
            {limitedAttributeTypes.map(attributeType => (
                <Typography
                    key={attributeType.id.toString()}
                    data-test-selector="attributes_item"
                    data-attributetypeid={attributeType.id}
                    {...styles.attributeTypeValuesText}
                    as="p"
                >
                    <Typography data-test-selector="attributes_item_label" {...styles.attributeTypeLabelText}>
                        {attributeType.label || attributeType.name}&nbsp;:&nbsp;
                    </Typography>
                    <span data-test-selector="attributes_item_value">
                        {(attributeType.attributeValues ?? [])
                            .map(attributeValue => attributeValue.valueDisplay)
                            .join(", ")}
                    </span>
                </Typography>
            ))}
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: withProduct(ProductDetailsAttributes),
    definition: {
        displayName: "Attributes",
        group: "Product Details",
        allowedContexts: [ProductDetailsPageContext],
    },
};

export default widgetModule;
