import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCartState, getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import setNotes from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/SetNotes";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { CheckoutShippingPageContext } from "@insite/content-library/Pages/CheckoutShippingPage";
import TextArea, { TextAreaProps } from "@insite/mobius/TextArea";
import React, { ChangeEvent, Component } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {}

const mapStateToProps = (state: ApplicationState) => {
    const { cartId } = state.pages.checkoutShipping;
    const cart = cartId ? getCartState(state, cartId).value : getCurrentCartState(state).value;
    return {
        notes: cart?.notes,
    };
};

const mapDispatchToProps = {
    setNotes,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & TextAreaProps;

export interface CheckoutShippingOrderNotesEntryStyles {
    textArea?: TextAreaProps;
}

export const checkoutShippingOrderNotesEntryStyles: CheckoutShippingOrderNotesEntryStyles = {
    textArea: {
        css: css`
            min-width: 100%;
            max-width: 100%;
            min-height: 50px;
        `,
    },
};

const styles = checkoutShippingOrderNotesEntryStyles;

interface State {
    notes?: string;
}

class CheckoutShippingOrderNotesEntry extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            notes: this.props.notes,
        };
    }

    notesChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            notes: event.currentTarget.value,
        });
        this.props.setNotes({
            notes: event.currentTarget.value,
        });
    };

    static getDerivedStateFromProps(props: Props, state: State) {
        if (typeof state.notes === "undefined" && typeof props.notes !== "undefined") {
            return {
                notes: props.notes,
            };
        }
        return state;
    }

    render() {
        if (typeof this.state.notes === "undefined") {
            return null;
        }

        return (
            <TextArea
                {...styles.textArea}
                label={translate("Add Order Notes")}
                placeholder={translate("You can start typing here")}
                value={this.state.notes}
                onChange={this.notesChangeHandler}
            />
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CheckoutShippingOrderNotesEntry),
    definition: {
        group: "Checkout - Shipping",
        displayName: "Order Notes Entry",
        allowedContexts: [CheckoutShippingPageContext],
    },
};

export default widgetModule;
