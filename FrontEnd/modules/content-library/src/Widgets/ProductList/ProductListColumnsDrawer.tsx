import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setVisibleColumnNames from "@insite/client-framework/Store/Pages/ProductList/Handlers/SetVisibleColumnNames";
import { getProductListDataViewProperty } from "@insite/client-framework/Store/Pages/ProductList/ProductListSelectors";
import translate from "@insite/client-framework/Translate";
import { FacetModel } from "@insite/client-framework/Types/ApiModels";
import ProductListFiltersAccordionSection, {
    ProductListFilterAccordionSectionStyles,
} from "@insite/content-library/Widgets/ProductList/ProductListFilterAccordionSection";
import Checkbox, { CheckboxPresentationProps } from "@insite/mobius/Checkbox";
import CheckboxGroup, { CheckboxGroupProps } from "@insite/mobius/CheckboxGroup";
import Drawer, { DrawerPresentationProps } from "@insite/mobius/Drawer";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    drawerIsOpen?: boolean;
    onDrawerClose: () => void;
}

const mapStateToProps = (state: ApplicationState) => ({
    attributeTypeFacets: getProductListDataViewProperty(state, "attributeTypeFacets"),
    brandFacets: getProductListDataViewProperty(state, "brandFacets"),
    productLineFacets: getProductListDataViewProperty(state, "productLineFacets"),
    tableColumns: state.pages.productList.tableColumns,
    visibleColumnNames: state.pages.productList.visibleColumnNames,
});

const mapDispatchToProps = {
    setVisibleColumnNames,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export interface ProductListColumnsDrawerStyles {
    drawer?: DrawerPresentationProps;
    productListFilterAccordionSection?: ProductListFilterAccordionSectionStyles;
    wrapper?: InjectableCss;
    checkBoxGroup?: CheckboxGroupProps;
    checkBox?: CheckboxPresentationProps;
    checkBoxSelected?: CheckboxPresentationProps;
    errorMessageModal?: ModalPresentationProps;
    errorText?: TypographyPresentationProps;
}

export const productListColumnsDrawerStyles: ProductListColumnsDrawerStyles = {
    drawer: {
        position: "left",
        size: 350,
        closeButtonProps: {
            shape: "pill",
            buttonType: "solid",
            color: "common.background",
            size: 36,
        },
        cssOverrides: {
            drawerTitle: css`
                background: ${getColor("common.background")};
            `,
            drawerBody: css`
                background: ${getColor("common.background")};
            `,
            drawerContent: css`
                padding: 0 30px;
            `,
            headlineTypography: css`
                margin: 15px 0 15px 30px;
            `,
        },
        headlineTypographyProps: {
            color: "text.main",
        },
    },
    wrapper: {
        css: css`
            padding: 15px;
        `,
    },
    checkBoxGroup: {
        css: css`
            width: 100%;
            &:not(:last-child) {
                padding-bottom: 5px;
            }
        `,
    },
    errorMessageModal: {
        sizeVariant: "small",
    },
};

const styles = productListColumnsDrawerStyles;

const ProductListColumnsDrawer = ({
    drawerIsOpen,
    attributeTypeFacets,
    brandFacets,
    productLineFacets,
    tableColumns,
    visibleColumnNames,
    setVisibleColumnNames,
    onDrawerClose,
}: Props) => {
    const [errorMessageModalIsOpen, setErrorMessageModalIsOpen] = useState(false);
    if (!attributeTypeFacets?.length && !brandFacets?.length && !productLineFacets?.length) {
        return null;
    }

    const drawerCloseHandler = () => {
        onDrawerClose();
    };

    const onChangeFacet = (facet: FacetModel) => {
        let updatedColumnNames = [];
        if (facet.selected) {
            updatedColumnNames = visibleColumnNames.filter(o => o !== facet.name);
        } else if (visibleColumnNames.length === 3) {
            setErrorMessageModalIsOpen(true);
            return;
        } else {
            updatedColumnNames = [...visibleColumnNames, facet.name];
        }

        setVisibleColumnNames({ visibleColumnNames: updatedColumnNames });
    };

    const errorMessageModalColoseHandler = () => {
        setErrorMessageModalIsOpen(false);
    };

    const facets = tableColumns.map<FacetModel>(facet => ({
        id: facet.attributeTypeId,
        name:
            facet.nameDisplay ||
            (facet.name === "Brand"
                ? translate("Brand")
                : facet.name === "Product Line"
                ? translate("Product Line")
                : facet.name),
        count: -1,
        selected: visibleColumnNames.indexOf(facet.name) > -1,
    }));
    const attributesFacets = facets.filter(o => o.id);

    return (
        <>
            <Drawer
                {...styles.drawer}
                isOpen={drawerIsOpen}
                headline={translate("Compare Attribute")}
                handleClose={drawerCloseHandler}
            >
                {attributesFacets.length > 0 && (
                    <ProductListFiltersAccordionSection
                        title={translate("Product Attributes")}
                        facets={attributesFacets}
                        onChangeFacet={onChangeFacet}
                        showMoreLimit={100}
                        expandByDefault={true}
                        extendedStyles={styles.productListFilterAccordionSection}
                    />
                )}
                <StyledWrapper {...styles.wrapper}>
                    {facets
                        .filter(o => !o.id)
                        .map(facet => {
                            return (
                                <CheckboxGroup key={facet.name} {...styles.checkBoxGroup}>
                                    <Checkbox
                                        {...(facet.selected ? styles.checkBoxSelected : styles.checkBox)}
                                        checked={facet.selected}
                                        onChange={() => onChangeFacet(facet)}
                                    >
                                        {facet.name}
                                    </Checkbox>
                                </CheckboxGroup>
                            );
                        })}
                </StyledWrapper>
            </Drawer>
            <Modal
                {...styles.errorMessageModal}
                headline={translate("Warning")}
                isOpen={errorMessageModalIsOpen}
                handleClose={errorMessageModalColoseHandler}
            >
                <Typography {...styles.errorText} data-test-selector="productListColumns_limitMessage">
                    {translate("You cannot select more than 3 attributes.")}
                </Typography>
            </Modal>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductListColumnsDrawer);
