import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import preloadCheckoutShippingData from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/PreloadCheckoutShippingData";
import setInitialValues from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/SetInitialValues";
import setIsPreloadingData from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/SetIsPreloadingData";
import updateCart from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/UpdateCart";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import React, { Component, createContext } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapDispatchToProps = {
    preloadCheckoutShippingData,
    setIsPreloadingData,
    updateCart: makeHandlerChainAwaitable(updateCart),
    setInitialValues,
};

const mapStateToProps = (state: ApplicationState) => ({
    cartId: state.pages.checkoutShipping.cartId,
    isPreloadingData: state.pages.checkoutShipping.isPreloadingData,
    reviewAndSubmitPageLink: getPageLinkByPageType(state, "CheckoutReviewAndSubmitPage"),
    location: getLocation(state),
});

type Props = PageProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & HasHistory;

type Validator = () => Promise<boolean>;

type State = {
    formSubmitAttempted: boolean;
    validators: {
        [key: string]: Validator | undefined;
    };
    isRedirecting: boolean;
};

export const CheckoutShippingFormContext = createContext<State>({
    formSubmitAttempted: false,
    validators: {},
    isRedirecting: false,
});

class CheckoutShippingPage extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            formSubmitAttempted: false,
            validators: {},
            isRedirecting: false,
        };
    }

    componentDidMount() {
        const parsedQuery = parseQueryString<{ cartId?: string }>(this.props.location.search);
        const cartId = parsedQuery.cartId;
        if (!this.props.isPreloadingData) {
            this.props.preloadCheckoutShippingData({
                cartId,
                onSuccess: () => {
                    this.props.setInitialValues();
                    this.props.setIsPreloadingData({ isPreloadingData: false });
                },
            });
        } else {
            this.props.setIsPreloadingData({ isPreloadingData: false });
            this.props.setInitialValues();
        }
    }

    scrollToFirstFormError = () => {
        const firstErrorElement = document.querySelector("[aria-invalid='true']");
        if (firstErrorElement) {
            const formFieldParent = firstErrorElement.closest("[class*='FormFieldStyle']");
            if (!formFieldParent) {
                return;
            }
            const { top } = formFieldParent.getBoundingClientRect();
            window.scrollTo({
                top: top + window.pageYOffset,
                left: 0,
                behavior: "smooth",
            });
        }
    };

    handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        this.setState({ formSubmitAttempted: true });

        const validators: Validator[] = [];
        Object.keys(this.state.validators).forEach(key => {
            const validator = this.state.validators[key];
            if (validator) {
                validators.push(validator);
            }
        });
        const results = await Promise.all(validators.map(v => v()));

        if (results.every(o => o)) {
            this.setState({ isRedirecting: true });
            // TODO ISC-12556
            await this.props.updateCart({});
            const continueUrl = this.props.cartId
                ? `${this.props.reviewAndSubmitPageLink!.url}?cartId=${this.props.cartId}`
                : this.props.reviewAndSubmitPageLink!.url;
            this.props.history.push(continueUrl);
        } else {
            this.scrollToFirstFormError();
        }
    };

    render() {
        return (
            <Page data-test-selector="checkoutShipping">
                <CheckoutShippingFormContext.Provider value={this.state}>
                    <form id="checkoutShippingForm" onSubmit={this.handleFormSubmit} noValidate>
                        <Zone zoneName="Content" contentId={this.props.id} />
                    </form>
                </CheckoutShippingFormContext.Provider>
            </Page>
        );
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(CheckoutShippingPage)),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export const CheckoutShippingPageContext = "CheckoutShippingPage";
export default pageModule;
