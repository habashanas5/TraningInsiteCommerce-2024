import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setView from "@insite/client-framework/Store/Pages/ProductList/Handlers/SetView";
import {
    getProductListDataView,
    getProductListDataViewProperty,
} from "@insite/client-framework/Store/Pages/ProductList/ProductListSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
import ProductListColumnsDrawer from "@insite/content-library/Widgets/ProductList/ProductListColumnsDrawer";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import Drawer, { DrawerPresentationProps } from "@insite/mobius/Drawer";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import Filter from "@insite/mobius/Icons/Filter";
import Tag from "@insite/mobius/Icons/Tag";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {}

const mapStateToProps = (state: ApplicationState) => ({
    loaded: !!getProductListDataView(state).value,
    view: state.pages.productList.view,
    attributeTypeFacets: getProductListDataViewProperty(state, "attributeTypeFacets"),
    brandFacets: getProductListDataViewProperty(state, "brandFacets"),
    productLineFacets: getProductListDataViewProperty(state, "productLineFacets"),
});

const mapDispatchToProps = {
    setView,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export interface ProductListTableViewFilterStyles {
    wrapper?: InjectableCss;
    filterClickable?: ClickablePresentationProps;
    filterIcon?: IconPresentationProps;
    tagClickable?: ClickablePresentationProps;
    tagIcon?: IconPresentationProps;
    filterDrawer?: DrawerPresentationProps;
    filterDrawerContentWrapper?: InjectableCss;
}

export const viewSelectStyles: ProductListTableViewFilterStyles = {
    wrapper: {
        css: css`
            display: flex;
            padding-top: 5px;
        `,
    },
    filterClickable: {
        css: css`
            margin-right: 20px;
        `,
    },
    filterIcon: {
        src: Filter,
        size: 30,
    },
    tagIcon: {
        src: Tag,
        size: 30,
    },
    filterDrawer: {
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
                position: absolute;
                align-self: flex-end;
            `,
            drawerContent: css`
                padding: 30px 30px 0 30px;
            `,
            drawerBody: css`
                background: ${getColor("common.background")};
            `,
            headlineTypography: css`
                margin: 15px 0 15px 30px;
            `,
        },
        headlineTypographyProps: {
            color: "text.main",
        },
    },
};

const styles = viewSelectStyles;

const ProductListTableViewFilter = ({
    id,
    loaded,
    view,
    attributeTypeFacets,
    brandFacets,
    productLineFacets,
}: Props) => {
    const [filterDrawerIsOpen, setFilterDrawerIsOpen] = useState(false);
    const [attributesDrawerIsOpen, setAttributesDrawerIsOpen] = useState(false);

    if (!loaded && view !== "Table") {
        return null;
    }

    const clickFilterIconHandler = () => {
        setFilterDrawerIsOpen(!filterDrawerIsOpen);
    };

    const clickTagIconHandler = () => {
        setAttributesDrawerIsOpen(!attributesDrawerIsOpen);
    };

    const filterDrawerCloseHandler = () => {
        setFilterDrawerIsOpen(false);
    };

    const attributesDrawerCloseHandler = () => {
        setAttributesDrawerIsOpen(false);
    };

    return (
        <>
            <StyledWrapper {...styles.wrapper}>
                <Clickable
                    {...styles.filterClickable}
                    onClick={clickFilterIconHandler}
                    data-test-selector="productListFilterButton"
                >
                    <Icon {...styles.filterIcon} />
                </Clickable>
                {(attributeTypeFacets?.length || brandFacets?.length || productLineFacets?.length) && (
                    <Clickable
                        {...styles.tagClickable}
                        onClick={clickTagIconHandler}
                        data-test-selector="productListChooseColumns"
                    >
                        <Icon {...styles.tagIcon} />
                    </Clickable>
                )}
            </StyledWrapper>
            <Drawer
                {...styles.filterDrawer}
                isOpen={filterDrawerIsOpen}
                handleClose={filterDrawerCloseHandler}
                data-test-selector="productListFilterDrawer"
            >
                <StyledWrapper {...styles.filterDrawerContentWrapper}>
                    <Zone zoneName="Container" contentId={id} />
                </StyledWrapper>
            </Drawer>
            <ProductListColumnsDrawer
                drawerIsOpen={attributesDrawerIsOpen}
                onDrawerClose={attributesDrawerCloseHandler}
            />
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(ProductListTableViewFilter),
    definition: {
        group: "Product List",
        displayName: "Table View Filter",
        allowedContexts: [ProductListPageContext],
    },
};

export default widgetModule;
