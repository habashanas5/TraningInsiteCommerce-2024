import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadAccountsIfNeeded from "@insite/client-framework/Store/Pages/RfqRequestQuote/Handlers/LoadAccountsIfNeeded";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import LoadingOverlay, { LoadingOverlayProps } from "@insite/mobius/LoadingOverlay";
import Page from "@insite/mobius/Page";
import React, { Component } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapDispatchToProps = {
    loadAccountsIfNeeded,
};

const mapStateToProps = (state: ApplicationState) => ({
    cart: getCurrentCartState(state),
    isUpdatingCartLine: state.pages.cart.isUpdatingCartLine,
});

type Props = ResolveThunks<typeof mapDispatchToProps> & PageProps & ReturnType<typeof mapStateToProps>;

export interface RfqRequestQuotePageStyles {
    loadingOverlay?: LoadingOverlayProps;
}

export const rfqRequestQuotePageStyles: RfqRequestQuotePageStyles = {
    loadingOverlay: {
        css: css`
            width: 100%;
        `,
    },
};

class RfqRequestQuotePage extends Component<Props> {
    componentDidMount() {
        this.props.loadAccountsIfNeeded();
    }

    render() {
        const styles = rfqRequestQuotePageStyles;
        return (
            <Page>
                <LoadingOverlay
                    {...styles.loadingOverlay}
                    loading={this.props.cart.isLoading || this.props.isUpdatingCartLine}
                >
                    <Zone contentId={this.props.id} zoneName="Content" />
                </LoadingOverlay>
            </Page>
        );
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RfqRequestQuotePage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        fieldDefinitions: [],
        pageType: "System",
    },
};

export default pageModule;

export const RfqRequestQuotePageContext = "RfqRequestQuotePage";
