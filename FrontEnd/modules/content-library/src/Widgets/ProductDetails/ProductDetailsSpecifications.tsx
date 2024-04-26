import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import Accordion, { AccordionProps } from "@insite/mobius/Accordion";
import { AccordionSectionPresentationProps, ManagedAccordionSection } from "@insite/mobius/AccordionSection";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import { IconMemo, IconProps } from "@insite/mobius/Icon";
import File from "@insite/mobius/Icons/File";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import parse from "html-react-parser";
import * as React from "react";
import { css } from "styled-components";

const enum fields {
    showDocuments = "showDocuments",
    showAttributes = "showAttributes",
    attributesPosition = "attributesPosition",
    documentsPosition = "documentsPosition",
}

type Props = WidgetProps & HasProduct;

export interface ProductDetailsSpecificationsStyles {
    specificationsAccordion?: AccordionProps;
    specificationsAccordionSection?: AccordionSectionPresentationProps;
    documentsContainer?: GridContainerProps;
    documentGridItem?: GridItemProps;
    documentLink?: LinkPresentationProps;
    documentIcon?: IconProps;
    documentNameText?: TypographyPresentationProps;
    attributeTypeWrapper?: InjectableCss;
    attributeTypeLabelText?: TypographyPresentationProps;
    attributeTypeValuesText?: TypographyPresentationProps;
}

export const specificationsStyles: ProductDetailsSpecificationsStyles = {
    specificationsAccordion: {
        headingLevel: 2,
    },
    documentGridItem: {
        width: [12, 12, 6, 6, 6],
    },
    documentIcon: {
        src: File,
        color: "text.link",
        css: css`
            margin-right: 10px;
        `,
    },
    documentNameText: {
        css: css`
            vertical-align: super;
        `,
    },
    attributeTypeLabelText: {
        weight: "bold",
    },
};

const styles = specificationsStyles;

const ProductDetailsSpecifications: React.FC<Props> = ({
    product: { brand, attributeTypes, documents, specifications },
    fields: { showDocuments, showAttributes, documentsPosition, attributesPosition },
}) => {
    const renderingDocuments = showDocuments && documents && documents.length > 0;
    const renderingAttributes = showAttributes && (brand || (attributeTypes && attributeTypes?.length > 0));
    const renderingSpecifications = specifications && specifications.length > 0;
    const documentsFirst = documentsPosition === "first";
    const attributesFirst = attributesPosition === "first";

    if (!renderingDocuments && !renderingAttributes && !renderingSpecifications) {
        return null;
    }

    const documentsAccordion = renderingDocuments && (
        <ManagedAccordionSection
            title={translate("Documents")}
            data-test-selector="productDetails_specifications_documents"
            initialExpanded={
                ((!attributesFirst || !renderingAttributes) && documentsFirst) ||
                (!renderingSpecifications && !renderingAttributes)
            }
            {...styles.specificationsAccordionSection}
        >
            <GridContainer {...styles.documentsContainer}>
                {documents!.map(document => (
                    <GridItem key={document.id.toString()} {...styles.documentGridItem}>
                        <Link
                            href={document.filePath}
                            target="_new"
                            {...styles.documentLink}
                            data-test-selector={`productDetails_${document.id}`}
                        >
                            <IconMemo {...styles.documentIcon} />
                            <Typography {...styles.documentNameText}>{document.name}</Typography>
                        </Link>
                    </GridItem>
                ))}
            </GridContainer>
        </ManagedAccordionSection>
    );

    const attributesAccordion = renderingAttributes && (
        <ManagedAccordionSection
            title={translate("Attributes")}
            initialExpanded={attributesFirst || (!renderingSpecifications && !renderingDocuments)}
            data-test-selector="productDetails_specifications_attributes"
            {...styles.specificationsAccordionSection}
        >
            {brand && (
                <StyledWrapper {...styles.attributeTypeWrapper}>
                    <Typography {...styles.attributeTypeLabelText}>{translate("Brand")}:&nbsp;</Typography>
                    <Typography {...styles.attributeTypeValuesText}>{brand.name}</Typography>
                </StyledWrapper>
            )}
            {attributeTypes &&
                attributeTypes.map(attributeType => (
                    <StyledWrapper {...styles.attributeTypeWrapper} key={attributeType.id.toString()}>
                        <Typography {...styles.attributeTypeLabelText}>
                            {attributeType.label || attributeType.name}:&nbsp;
                        </Typography>
                        <Typography {...styles.attributeTypeValuesText}>
                            {attributeType
                                .attributeValues!.map(attributeValue => attributeValue.valueDisplay)
                                .join(", ")}
                        </Typography>
                    </StyledWrapper>
                ))}
        </ManagedAccordionSection>
    );

    return (
        <Accordion
            headingLevel={2}
            data-test-selector="productDetails_specifications"
            {...styles.specificationsAccordion}
        >
            {attributesFirst && attributesAccordion}
            {documentsFirst && documentsAccordion}
            {renderingSpecifications &&
                specifications?.map((specification, index) => (
                    <ManagedAccordionSection
                        initialExpanded={
                            index === 0 &&
                            (!documentsFirst || !renderingDocuments) &&
                            (!attributesFirst || !renderingAttributes)
                        }
                        key={specification.id.toString()}
                        title={specification.nameDisplay}
                        data-test-selector="productDetails_specifications_specification"
                        {...styles.specificationsAccordionSection}
                    >
                        {parse(specification.htmlContent, parserOptions)}
                    </ManagedAccordionSection>
                ))}
            {!attributesFirst && attributesAccordion}
            {!documentsFirst && documentsAccordion}
        </Accordion>
    );
};

const widgetModule: WidgetModule = {
    component: withProduct(ProductDetailsSpecifications),
    definition: {
        displayName: "Specification",
        group: "Product Details",
        allowedContexts: [ProductDetailsPageContext],
        fieldDefinitions: [
            {
                name: fields.showDocuments,
                displayName: "Show Documents",
                editorTemplate: "CheckboxField",
                defaultValue: false,
                fieldType: "General",
                sortOrder: 1,
            },
            {
                name: fields.documentsPosition,
                displayName: "Documents Position",
                editorTemplate: "RadioButtonsField",
                defaultValue: "first",
                fieldType: "General",
                sortOrder: 2,
                options: [
                    {
                        displayName: "Display First",
                        value: "first",
                    },
                    {
                        displayName: "Display Last",
                        value: "last",
                    },
                ],
                isVisible: widget => widget.fields.showDocuments,
            },
            {
                name: fields.showAttributes,
                displayName: "Show Attributes",
                editorTemplate: "CheckboxField",
                defaultValue: false,
                fieldType: "General",
                sortOrder: 3,
            },
            {
                name: fields.attributesPosition,
                displayName: "Attributes Position",
                editorTemplate: "RadioButtonsField",
                defaultValue: "first",
                fieldType: "General",
                sortOrder: 4,
                options: [
                    {
                        displayName: "Display First",
                        value: "first",
                    },
                    {
                        displayName: "Display Last",
                        value: "last",
                    },
                ],
                isVisible: widget => widget.fields.showAttributes,
            },
        ],
    },
};

export default widgetModule;
