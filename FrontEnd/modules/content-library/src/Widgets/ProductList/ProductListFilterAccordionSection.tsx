import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import translate from "@insite/client-framework/Translate";
import { FacetModel } from "@insite/client-framework/Types/ApiModels";
import { AccordionSectionPresentationProps, ManagedAccordionSection } from "@insite/mobius/AccordionSection";
import Checkbox, {
    CheckboxPresentationProps,
    StyleProps as CheckboxStyleProps,
} from "@insite/mobius/Checkbox/Checkbox";
import CheckboxGroup, { CheckboxGroupProps } from "@insite/mobius/CheckboxGroup/CheckboxGroup";
import Link, { LinkPresentationProps } from "@insite/mobius/Link/Link";
import React, { FC, useState } from "react";
import { css } from "styled-components";

export interface ProductListFilterAccordionSectionStyles {
    accordionSection?: AccordionSectionPresentationProps;
    checkBoxGroup?: CheckboxGroupProps;
    checkBox?: CheckboxPresentationProps;
    checkBoxSelected?: CheckboxPresentationProps;
    seeAllLink?: LinkPresentationProps;
    seeLessLink?: LinkPresentationProps;
}

export const productListFilterAccordionSectionStyles: ProductListFilterAccordionSectionStyles = {
    accordionSection: {
        panelProps: {
            css: css`
                overflow-y: auto;
                overflow-x: hidden;
                max-height: 350px;
            `,
        },
    },
    checkBoxGroup: {
        css: css`
            width: 100%;
            &:not(:last-child) {
                padding-bottom: 5px;
            }
        `,
    },
    checkBox: {
        css: css<CheckboxStyleProps>`
            align-items: flex-start;
            span[role="checkbox"] {
                ${({ _sizeVariant }) =>
                    _sizeVariant === "small"
                        ? css`
                              margin-top: 5px;
                          `
                        : css`
                              margin-top: 4px;
                          `}
            }
        `,
        typographyProps: {
            css: css`
                word-break: break-all;
            `,
        },
    },
    checkBoxSelected: {
        css: css<CheckboxStyleProps>`
            align-items: flex-start;
            span[role="checkbox"] {
                ${({ _sizeVariant }) =>
                    _sizeVariant === "small"
                        ? css`
                              margin-top: 5px;
                          `
                        : css`
                              margin-top: 4px;
                          `}
            }
        `,
        typographyProps: {
            css: css`
                word-break: break-all;
            `,
            weight: "bold",
        },
    },
    seeAllLink: {
        css: css`
            padding-top: 5px;
        `,
    },
    seeLessLink: {
        css: css`
            padding-top: 5px;
        `,
    },
};

export interface Props {
    title: string;
    facets: FacetModel[];
    onChangeFacet: (facet: FacetModel) => void;
    showMoreLimit: number;
    extendedStyles?: ProductListFilterAccordionSectionStyles;
    expandByDefault: boolean;
}

const ProductListFiltersAccordionSection: FC<Props> = ({
    title,
    facets,
    onChangeFacet,
    showMoreLimit,
    expandByDefault,
    extendedStyles,
}) => {
    const [styles] = React.useState(() => mergeToNew(productListFilterAccordionSectionStyles, extendedStyles));
    const [expanded, setExpanded] = useState(false);

    const limitedFacets = expanded ? facets : facets?.slice(0, showMoreLimit);
    const anySelected = facets.find(f => f.selected) !== undefined;

    return (
        <ManagedAccordionSection
            title={title}
            {...styles.accordionSection}
            initialExpanded={expandByDefault || anySelected}
        >
            {limitedFacets?.map(facet => (
                <CheckboxGroup key={facet.id} {...styles.checkBoxGroup}>
                    <Checkbox
                        {...(facet.selected ? styles.checkBoxSelected : styles.checkBox)}
                        checked={facet.selected}
                        onChange={() => onChangeFacet(facet)}
                        data-test-selector={`facetFilter${facet.id}`}
                    >
                        {facet.name} {facet.count !== -1 && `(${facet.count})`}
                    </Checkbox>
                </CheckboxGroup>
            ))}
            {facets &&
                facets.length > showMoreLimit &&
                (expanded ? (
                    <Link {...styles.seeLessLink} onClick={() => setExpanded(false)}>
                        {translate("See Less")}
                    </Link>
                ) : (
                    <Link {...styles.seeAllLink} onClick={() => setExpanded(true)}>
                        {translate("See All")}
                    </Link>
                ))}
        </ManagedAccordionSection>
    );
};

export default ProductListFiltersAccordionSection;
