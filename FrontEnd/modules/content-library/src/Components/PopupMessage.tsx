import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import * as React from "react";

interface OwnProps {
    modalIsOpen: boolean;
    messageTitle: string;
    messageBody: string;
    onClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

type Props = OwnProps;

export interface PopupMessageStyles {
    modal?: ModalPresentationProps;
    bodyText?: TypographyProps;
}

export const popupMessageStyles: PopupMessageStyles = {
    modal: {
        sizeVariant: "small",
    },
};

const styles = popupMessageStyles;

const PopupMessage: React.FunctionComponent<Props> = props => {
    return (
        <Modal headline={props.messageTitle} {...styles.modal} isOpen={props.modalIsOpen} handleClose={props.onClose}>
            <Typography {...styles.bodyText}>{props.messageBody}</Typography>
        </Modal>
    );
};

export default PopupMessage;
