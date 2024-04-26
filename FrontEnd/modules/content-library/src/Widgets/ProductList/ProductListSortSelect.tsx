import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import addProductFilters from "@insite/client-framework/Store/Pages/ProductList/Handlers/AddProductFilters";
import { getProductListDataViewProperty } from "@insite/client-framework/Store/Pages/ProductList/ProductListSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    pagination: getProductListDataViewProperty(state, "pagination"),
});

const mapDispatchToProps = {
    addProductFilters,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface ProductListSortSelectStyles {
    select?: SelectPresentationProps;
}

export const sortSelectStyles: ProductListSortSelectStyles = {
    select: {
        labelProps: {
            css: css`
                width: unset;
            `,
        },
        cssOverrides: {
            formField: css`
                width: 325px;
            `,
        },
    },
};

const styles = sortSelectStyles;

const ProductListSortSelect = ({ addProductFilters, pagination }: Props) => {
    if (!pagination) {
        return null;
    }

    const onChangeSortHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        addProductFilters({ sort: event.currentTarget.value });
    };

    return (
        <Select
            {...styles.select}
            label={translate("Sort by")}
            value={pagination.sortType}
            labelPosition="left"
            onChange={onChangeSortHandler}
            data-test-selector="productListSortSelect"
        >
            {pagination.sortOptions.map(sortOption => (
                <option key={sortOption.sortType} value={sortOption.sortType}>
                    {sortOption.displayName}
                </option>
            ))}
        </Select>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(ProductListSortSelect),
    definition: {
        group: "Product List",
        displayName: "Sort Select",
        allowedContexts: [ProductListPageContext],
    },
};

export default widgetModule;
