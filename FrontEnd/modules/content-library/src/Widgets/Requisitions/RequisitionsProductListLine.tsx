import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import setRequisitionIsExpanded from "@insite/client-framework/Store/Pages/Requisitions/Handlers/SetRequisitionIsExpanded";
import setRequisitionIsSelected from "@insite/client-framework/Store/Pages/Requisitions/Handlers/SetRequisitionIsSelected";
import translate from "@insite/client-framework/Translate";
import { RequisitionModel } from "@insite/client-framework/Types/ApiModels";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import ProductImage, { ProductImageStyles } from "@insite/content-library/Components/ProductImage";
import ProductPartNumbers, { ProductPartNumbersStyles } from "@insite/content-library/Components/ProductPartNumbers";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import RequisitionsRequisitionLinesTable from "@insite/content-library/Widgets/Requisitions/RequisitionsRequisitionLinesTable";
import Accordion, { AccordionPresentationProps } from "@insite/mobius/Accordion";
import AccordionSection from "@insite/mobius/AccordionSection";
import Checkbox, { CheckboxPresentationProps, CheckboxProps } from "@insite/mobius/Checkbox";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    requisition: RequisitionModel;
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => ({
    isSelected: !!state.pages.requisitions.selectedRequisitionIds.find(o => o === ownProps.requisition.id),
    isExpanded: !!state.pages.requisitions.expandedRequisitionIds.find(o => o === ownProps.requisition.id),
    productSettings: getSettingsCollection(state).productSettings,
    enableVat: getSettingsCollection(state).productSettings.enableVat,
    vatPriceDisplay: getSettingsCollection(state).productSettings.vatPriceDisplay,
});

const mapDispatchToProps = {
    setRequisitionIsSelected,
    setRequisitionIsExpanded,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RequisitionsProductListLineStyles {
    mainContainer?: GridContainerProps;
    imageGridItem?: GridItemProps;
    selectedCheckbox?: CheckboxPresentationProps;
    imageWrapper?: InjectableCss;
    productImageStyles?: ProductImageStyles;
    infoGridItem?: GridItemProps;
    infoContainer?: GridContainerProps;
    descriptionGridItem?: GridItemProps;
    productBrandStyles?: ProductBrandStyles;
    productDescriptionStyles?: ProductDescriptionStyles;
    partNumbersGridItem?: GridItemProps;
    productPartNumbersStyles?: ProductPartNumbersStyles;
    priceGridItem?: GridItemProps;
    productPriceStyles?: ProductPriceStyles;
    quantityGridItem?: GridItemProps;
    quantityHeadingAndText?: SmallHeadingAndTextStyles;
    subtotalGridItem?: GridItemProps;
    subtotalWithoutVatHeadingAndText?: SmallHeadingAndTextStyles;
    subtotalHeadingAndText?: SmallHeadingAndTextStyles;
    requisitionLinesGridItem?: GridItemProps;
    requisitionLinesAccordion?: AccordionPresentationProps;
}

export const requisitionsProductListLineStyles: RequisitionsProductListLineStyles = {
    mainContainer: {
        gap: 10,
        css: css`
            padding: 20px 0;
            border-top: 1px solid ${getColor("common.border")};
        `,
    },
    imageGridItem: {
        width: [3, 3, 2, 2, 2],
    },
    selectedCheckbox: {
        css: css`
            margin-right: 10px;
        `,
    },
    imageWrapper: {
        css: css`
            width: 100%;
            min-width: 0;
            flex-direction: column;
        `,
    },
    infoGridItem: {
        width: [9, 9, 10, 10, 10],
    },
    infoContainer: {
        gap: 10,
    },
    descriptionGridItem: {
        width: [12, 12, 5, 6, 6],
        printWidth: 6,
        css: css`
            flex-direction: column;
        `,
    },
    partNumbersGridItem: { width: 12 },
    productPriceStyles: {
        priceLabelText: {
            variant: "p",
            transform: "uppercase",
            size: 10,
            weight: "bold",
            css: css`
                margin-bottom: 0.5rem;
            `,
        },
    },
    priceGridItem: { width: [4, 4, 2, 2, 2] },
    quantityGridItem: { width: [4, 4, 2, 2, 2] },
    quantityHeadingAndText: {
        heading: {
            size: 10,
            weight: "bold",
            css: css`
                margin-bottom: 0.5rem;
            `,
        },
    },
    subtotalGridItem: {
        width: [4, 4, 2, 2, 2],
        css: css`
            flex-direction: column;
        `,
    },
    subtotalWithoutVatHeadingAndText: {
        heading: {
            size: 10,
            weight: "bold",
            css: css`
                margin-bottom: 0.5rem;
            `,
        },
        text: {
            weight: "bold",
        },
        wrapper: {
            css: css`
                margin-bottom: 10px;
            `,
        },
    },
    subtotalHeadingAndText: {
        heading: {
            size: 10,
            weight: "bold",
            css: css`
                margin-bottom: 0.5rem;
            `,
        },
        text: {
            weight: "bold",
        },
    },
    requisitionLinesGridItem: {
        width: 12,
    },
    requisitionLinesAccordion: {
        css: css`
            width: 100%;
        `,
    },
};

const styles = requisitionsProductListLineStyles;

const RequisitionsProductListLine = ({
    requisition,
    isSelected,
    isExpanded,
    productSettings,
    enableVat,
    vatPriceDisplay,
    setRequisitionIsSelected,
    setRequisitionIsExpanded,
}: Props) => {
    const selectChangeHandler: CheckboxProps["onChange"] = (_, value) => {
        setRequisitionIsSelected({ requisitionId: requisition.id, isSelected: value });
    };

    const togglePanelHandler = () => {
        setRequisitionIsExpanded({ requisitionId: requisition.id, isExpanded: !isExpanded });
    };

    return (
        <>
            <GridContainer
                {...styles.mainContainer}
                data-test-selector={`requisition_${requisition.productId}_${requisition.unitOfMeasure}`}
            >
                <GridItem {...styles.imageGridItem}>
                    <Checkbox {...styles.selectedCheckbox} checked={isSelected} onChange={selectChangeHandler} />
                    <StyledWrapper {...styles.imageWrapper}>
                        <ProductImage product={requisition} extendedStyles={styles.productImageStyles} />
                    </StyledWrapper>
                </GridItem>
                <GridItem {...styles.infoGridItem}>
                    <GridContainer {...styles.infoContainer}>
                        <GridItem {...styles.descriptionGridItem}>
                            {requisition.brand && (
                                <ProductBrand brand={requisition.brand} extendedStyles={styles.productBrandStyles} />
                            )}
                            <ProductDescription
                                product={requisition}
                                extendedStyles={styles.productDescriptionStyles}
                            />
                            <GridItem {...styles.partNumbersGridItem}>
                                <ProductPartNumbers
                                    productNumber={requisition.erpNumber}
                                    customerProductNumber={requisition.customerName}
                                    manufacturerItem={requisition.manufacturerItem}
                                    extendedStyles={styles.productPartNumbersStyles}
                                />
                            </GridItem>
                        </GridItem>
                        <GridItem {...styles.priceGridItem}>
                            <ProductPrice
                                product={requisition}
                                showSavings={true}
                                showSavingsAmount={productSettings.showSavingsAmount}
                                showSavingsPercent={productSettings.showSavingsPercent}
                                extendedStyles={styles.productPriceStyles}
                            />
                        </GridItem>
                        <GridItem {...styles.quantityGridItem}>
                            <SmallHeadingAndText
                                heading={translate("QTY")}
                                text={requisition.qtyOrdered!}
                                extendedStyles={styles.quantityHeadingAndText}
                            />
                        </GridItem>
                        <GridItem {...styles.subtotalGridItem}>
                            {requisition.pricing && (
                                <>
                                    {enableVat && vatPriceDisplay === "DisplayWithAndWithoutVat" && (
                                        <SmallHeadingAndText
                                            heading={`${translate("Subtotal")} (${translate("Ex. VAT")})`}
                                            text={requisition.pricing.extendedUnitNetPriceDisplay}
                                            extendedStyles={styles.subtotalWithoutVatHeadingAndText}
                                        />
                                    )}
                                    <SmallHeadingAndText
                                        heading={
                                            !enableVat
                                                ? translate("Subtotal")
                                                : vatPriceDisplay !== "DisplayWithoutVat"
                                                ? `${translate("Subtotal")} (${translate("Inc. VAT")})`
                                                : `${translate("Subtotal")} (${translate("Ex. VAT")})`
                                        }
                                        text={
                                            enableVat && vatPriceDisplay !== "DisplayWithoutVat"
                                                ? requisition.pricing.extendedUnitRegularPriceWithVatDisplay
                                                : requisition.pricing.extendedUnitNetPriceDisplay
                                        }
                                        extendedStyles={styles.subtotalHeadingAndText}
                                        data-test-selector="subtotal"
                                    />
                                </>
                            )}
                        </GridItem>
                    </GridContainer>
                </GridItem>
                <GridItem {...styles.requisitionLinesGridItem}>
                    <Accordion {...styles.requisitionLinesAccordion} headingLevel={3}>
                        <AccordionSection
                            title={translate("View Requisitions")}
                            expanded={isExpanded}
                            onTogglePanel={togglePanelHandler}
                        >
                            {isExpanded && <RequisitionsRequisitionLinesTable requisitionId={requisition.id} />}
                        </AccordionSection>
                    </Accordion>
                </GridItem>
            </GridContainer>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(RequisitionsProductListLine);
