import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RequisitionConfirmationPageContext } from "@insite/content-library/Pages/RequisitionConfirmationPage";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import LoadingSpinner from "@insite/mobius/LoadingSpinner";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    cartState: getCartState(state, state.pages.requisitionConfirmation.cartId),
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface RequisitionConfirmationPageContainerStyles {
    spinnerWrapper?: InjectableCss;
    container?: InjectableCss;
    cartLinesContainer?: InjectableCss;
    totalContainer?: InjectableCss;
}

export const requisitionConfirmationPageContainerStyles: RequisitionConfirmationPageContainerStyles = {
    spinnerWrapper: {
        css: css`
            display: flex;
            justify-content: center;
            align-items: center;
            height: 300px;
        `,
    },
    container: {
        css: css`
            /* stylelint-disable value-no-vendor-prefix */
            display: -ms-grid;
            display: grid;
            padding: 1.5rem 0 0 1.5rem;
            margin: -1.5rem;
            overflow: hidden;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            grid-template-columns: minmax(0, 1fr);
                            -ms-grid-columns: minmax(0, 1fr);
                        `,
                        null,
                        null,
                        css`
                            grid-template-columns: repeat(2, minmax(0, 1fr));
                            -ms-grid-columns: minmax(0, 1fr) minmax(0, 1fr);
                            grid-template-rows: repeat(5, auto);
                            -ms-grid-rows: auto auto auto auto auto;
                        `,
                        css`
                            grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
                            -ms-grid-columns: minmax(0, 2fr) minmax(0, 1fr);
                        `,
                    ],
                    "min",
                )}
        `,
    },
    cartLinesContainer: {
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            border: 0 solid transparent;
                            border-width: 0 1.5rem 1.5rem 0;
                        `,
                        null,
                        null,
                        css`
                            grid-column-start: 1;
                            -ms-grid-column: 1;
                            grid-row-start: 1;
                            -ms-grid-row: 1;
                            grid-row-end: 6;
                            -ms-grid-row-span: 6;
                        `,
                    ],
                    "min",
                )}
        `,
    },
    totalContainer: {
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            border: 0 solid transparent;
                            border-width: 0 1.5rem 1.5rem 0;
                        `,
                        null,
                        null,
                        css`
                            grid-column-start: 2;
                            -ms-grid-column: 2;
                            grid-row-start: 1;
                            -ms-grid-row: 1;
                        `,
                    ],
                    "min",
                )}
        `,
    },
};

const styles = requisitionConfirmationPageContainerStyles;

const RequisitionConfirmationPageContainer = ({ cartState, id }: Props) => {
    if (!cartState.value) {
        return (
            <StyledWrapper {...styles.spinnerWrapper}>
                <LoadingSpinner />
            </StyledWrapper>
        );
    }

    return (
        <StyledWrapper {...styles.container}>
            <StyledWrapper {...styles.totalContainer}>
                <Zone zoneName="Content1" contentId={id} />
            </StyledWrapper>
            <StyledWrapper {...styles.cartLinesContainer}>
                <Zone zoneName="Content0" contentId={id} />
            </StyledWrapper>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(RequisitionConfirmationPageContainer),
    definition: {
        group: "Requisition Confirmation",
        allowedContexts: [RequisitionConfirmationPageContext],
        displayName: "Page Container",
    },
};

export default widgetModule;
