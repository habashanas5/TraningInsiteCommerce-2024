import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import React from "react";
import { css } from "styled-components";

interface OwnProps {
    modalIsOpen: boolean;
    headlineText: React.ReactNode;
    messageText: React.ReactNode;
    cancelButtonText: string;
    submitButtonText: string;
    extendedStyles?: TwoButtonModalStyles;
    onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    onSubmit: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    submitTestSelector?: string;
    dataTestSelector?: string;
}

type Props = OwnProps;

export interface TwoButtonModalStyles {
    modal?: ModalPresentationProps;
    container?: GridContainerProps;
    textGridItem?: GridItemProps;
    messageText?: TypographyProps;
    buttonsGridItem?: GridItemProps;
    submitButton?: ButtonPresentationProps;
    cancelButton?: ButtonPresentationProps;
}

export const twoButtonModalStyles: TwoButtonModalStyles = {
    modal: {
        sizeVariant: "small",
    },
    textGridItem: {
        width: 12,
    },
    buttonsGridItem: {
        width: 12,
        css: css`
            justify-content: flex-end;
        `,
    },
    cancelButton: {
        variant: "secondary",
        css: css`
            margin-right: 10px;
        `,
    },
    submitButton: {
        color: "secondary",
    },
};

class TwoButtonModal extends React.Component<Props> {
    private readonly styles: TwoButtonModalStyles;

    constructor(props: Props) {
        super(props);

        this.styles = mergeToNew(twoButtonModalStyles, props.extendedStyles);
    }

    formCancelHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        this.props.onCancel(e);
    };

    formSubmitHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        this.props.onSubmit(e);
    };

    render() {
        const styles = this.styles;

        return (
            <Modal
                headline={this.props.headlineText}
                {...styles.modal}
                isOpen={this.props.modalIsOpen}
                data-test-selector={this.props.dataTestSelector}
                handleClose={this.formCancelHandler}
            >
                <GridContainer {...styles.container}>
                    <GridItem {...styles.textGridItem}>
                        <Typography {...styles.messageText}>{this.props.messageText}</Typography>
                    </GridItem>
                    <GridItem {...styles.buttonsGridItem}>
                        <Button {...styles.cancelButton} onClick={this.formCancelHandler}>
                            {this.props.cancelButtonText}
                        </Button>
                        <Button
                            {...styles.submitButton}
                            onClick={this.formSubmitHandler}
                            data-test-selector={this.props.submitTestSelector}
                        >
                            {this.props.submitButtonText}
                        </Button>
                    </GridItem>
                </GridContainer>
            </Modal>
        );
    }
}

export default TwoButtonModal;
