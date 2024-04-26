import Button from "@insite/mobius/Button";
import Modal from "@insite/mobius/Modal";
import ButtonBar from "@insite/shell/Components/Modals/ButtonBar";
import { ConfirmationContext, ConfirmationOptions } from "@insite/shell/Components/Modals/ConfirmationContext";
import * as React from "react";
import styled from "styled-components";

interface State {
    display?: boolean;
    options?: ConfirmationOptions;
}

class ConfirmationProvider extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);

        this.state = {};
    }

    display = (options: ConfirmationOptions) => {
        this.setState({
            display: true,
            options,
        });
    };

    cancel = () => {
        if (this.state.options!.onCancel) {
            this.state.options!.onCancel();
        }

        this.setState({
            display: false,
        });
    };

    confirm = () => {
        this.state.options!.onConfirm();
        this.setState({
            display: false,
        });
    };

    render() {
        return (
            <ConfirmationContext.Provider value={{ display: this.display }}>
                {this.props.children}
                <Modal
                    headline={this.state.options?.title}
                    isOpen={!!this.state.display}
                    handleClose={this.cancel}
                    size={500}
                    closeOnEsc
                    data-test-selector="confirmationModal"
                >
                    <MessageStyle>{this.state.options?.message}</MessageStyle>
                    <ButtonBar>
                        <Button variant="tertiary" onClick={this.cancel}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.confirm} data-test-selector="confirmationModal_confirm">
                            Delete
                        </Button>
                    </ButtonBar>
                </Modal>
            </ConfirmationContext.Provider>
        );
    }
}

export default ConfirmationProvider;

const MessageStyle = styled.div`
    text-align: center;
    padding-bottom: 20px;
`;
