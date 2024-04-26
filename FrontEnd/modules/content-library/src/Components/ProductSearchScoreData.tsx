import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSearchDataModeActive } from "@insite/client-framework/Store/Context/ContextSelectors";
import translate from "@insite/client-framework/Translate";
import Accordion, { AccordionPresentationProps } from "@insite/mobius/Accordion/Accordion";
import { ManagedAccordionSection } from "@insite/mobius/AccordionSection";
import { AccordionSectionPresentationProps } from "@insite/mobius/AccordionSection/AccordionSection";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import { GridItemProps } from "@insite/mobius/GridItem";
import { GridItem, Typography } from "@insite/mobius/index";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import { TypographyPresentationProps } from "@insite/mobius/Typography";
import React, { FC } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    searchDataModeActive: getSearchDataModeActive(state),
});

type Props = ReturnType<typeof mapStateToProps> & HasProduct;

export interface ProductSearchScoreDataStyles {
    container?: GridContainerProps;
    accordion?: AccordionPresentationProps;
    accordionSection?: AccordionSectionPresentationProps;
    gridItem?: GridItemProps;
    multilineGridItem?: GridItemProps;
    dataNameTypography?: TypographyPresentationProps;
    dataValueTypography?: TypographyPresentationProps;
    viewMoreLink?: LinkPresentationProps;
}

export const productSearchScoreDataStyles: ProductSearchScoreDataStyles = {
    container: {
        gap: 0,
        css: css`
            flex-direction: column;
        `,
    },
    gridItem: {
        width: 12,
    },
    multilineGridItem: {
        width: 12,
        css: css`
            flex-direction: column;
        `,
    },
    dataNameTypography: {
        weight: "bold",
        css: css`
            padding-right: 5px;
            word-wrap: normal;
        `,
    },
    viewMoreLink: {
        css: css`
            margin-top: 5px;
        `,
    },
};

const styles = productSearchScoreDataStyles;

const ProductSearchScoreData: FC<Props> = ({ searchDataModeActive, product, product: { score, scoreExplanation } }) => {
    const [extraData, toggleExtraData] = React.useState<boolean>(false);

    if (!searchDataModeActive || scoreExplanation == null || score === 0) {
        return null;
    }
    return (
        <Accordion {...styles.accordion} headingLevel={3}>
            <ManagedAccordionSection
                title={translate("Search Data")}
                initialExpanded={true}
                {...styles.accordionSection}
            >
                <GridContainer {...styles.container}>
                    <GridItem {...styles.gridItem}>
                        <Typography {...styles.dataNameTypography}>{translate("Score")}:</Typography>
                        <Typography {...styles.dataValueTypography}>{score}</Typography>
                    </GridItem>
                    <GridItem {...styles.gridItem}>
                        <Typography {...styles.dataNameTypography}>{translate("Matching Fields")}: </Typography>
                        <Typography {...styles.dataValueTypography}>
                            {scoreExplanation?.aggregateFieldScores?.map(s => s.name).join(", ")}
                        </Typography>
                    </GridItem>
                    {extraData && (
                        <>
                            <GridItem {...styles.gridItem}>
                                <Typography {...styles.dataNameTypography}>{translate("Total Boost")}:</Typography>
                                <Typography {...styles.dataValueTypography}>{scoreExplanation?.totalBoost}</Typography>
                            </GridItem>
                            {product.isSponsored && (
                                <GridItem {...styles.gridItem}>
                                    <Typography {...styles.dataNameTypography}>
                                        {translate("Sponsored Boost Active")}
                                    </Typography>
                                </GridItem>
                            )}
                            <GridItem {...styles.multilineGridItem}>
                                <Typography {...styles.dataNameTypography}>{translate("Field Scores")}: </Typography>
                                {scoreExplanation?.aggregateFieldScores
                                    ?.filter(s => s.score !== 0)
                                    .map(s => (
                                        <Typography key={s.name} {...styles.dataValueTypography}>
                                            {s.name}: {s.score}
                                        </Typography>
                                    ))}
                            </GridItem>
                        </>
                    )}
                    <GridItem {...styles.gridItem}>
                        <Link {...styles.viewMoreLink} onClick={() => toggleExtraData(!extraData)}>
                            {extraData ? "View Less" : "View More"}
                        </Link>
                    </GridItem>
                </GridContainer>
            </ManagedAccordionSection>
        </Accordion>
    );
};

export default connect(mapStateToProps)(withProduct(ProductSearchScoreData));
