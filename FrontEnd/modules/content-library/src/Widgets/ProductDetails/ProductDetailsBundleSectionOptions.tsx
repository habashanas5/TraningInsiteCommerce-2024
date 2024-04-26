import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasParentProductId, withParentProductId } from "@insite/client-framework/Components/ParentProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getProductState } from "@insite/client-framework/Store/Data/Products/ProductsSelectors";
import updateConfigurationSelection from "@insite/client-framework/Store/Pages/ProductDetails/Handlers/UpdateConfigurationSelection";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import Select, { SelectProps } from "@insite/mobius/Select";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

type Props = WidgetProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasParentProductId;

const mapStateToProps = (state: ApplicationState, ownProps: HasParentProductId) => ({
    configuration: getProductState(state, ownProps.parentProductId).value?.detail?.configuration,
    configurationSelection: state.pages.productDetails.configurationSelection,
});

const mapDispatchToProps = {
    updateConfigurationSelection,
};

export interface ProductDetailsBundleSectionOptionsStyles {
    wrapper?: InjectableCss;
    select?: SelectProps;
}

export const variantOptionsStyles: ProductDetailsBundleSectionOptionsStyles = {
    wrapper: {
        css: css`
            width: 100%;
        `,
    },
    select: {
        cssOverrides: {
            formField: css`
                margin-top: 10px;
            `,
        },
    },
};

const styles = variantOptionsStyles;

const ProductDetailsBundleSectionOptions: React.FC<Props> = ({
    configuration,
    configurationSelection,
    updateConfigurationSelection,
    parentProductId,
}) => {
    const sectionOptionChangeHandler = (configSectionId: string, sectionOptionId: string) => {
        updateConfigurationSelection({ configSectionId, sectionOptionId, productId: parentProductId });
    };

    if (!configuration || configuration.configSections?.length === 0) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            {!configuration.isKit &&
                configuration?.configSections?.map(
                    configSection =>
                        !!configSection.sectionOptions?.length && (
                            <Select
                                {...styles.select}
                                key={configSection.id}
                                label={configSection.label || configSection.sectionName}
                                value={configurationSelection[configSection.id]}
                                onChange={event => {
                                    sectionOptionChangeHandler(configSection.id, event.currentTarget.value);
                                }}
                            >
                                <option value="">{`${translate("Select")} ${
                                    configSection.label || configSection.sectionName
                                }`}</option>
                                {configSection.sectionOptions?.map(sectionOption => (
                                    <option value={`${sectionOption.id}`} key={`${sectionOption.id}`}>
                                        {sectionOption.description}
                                    </option>
                                ))}
                            </Select>
                        ),
                )}
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: withParentProductId(connect(mapStateToProps, mapDispatchToProps)(ProductDetailsBundleSectionOptions)),
    definition: {
        group: "Product Details",
        allowedContexts: [ProductDetailsPageContext],
    },
};

export default widgetModule;
