import { setCookie } from "@insite/client-framework/Common/Cookies";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import Button from "@insite/mobius/Button";
import Checkbox from "@insite/mobius/Checkbox";
import Modal from "@insite/mobius/Modal";
import ButtonBar from "@insite/shell/Components/Modals/ButtonBar";
import { AnyShellAction } from "@insite/shell/Store/Reducers";
import ShellState from "@insite/shell/Store/ShellState";
import React, { useEffect, useState } from "react";
import { connect, DispatchProp } from "react-redux";
import styled from "styled-components";

interface OwnProps {
    updateField: (fieldName: string, value: LinkFieldValue) => void;
}

const mapStateToProps = ({ neverPublishedModal: { isOpen, fieldName, nodeId } }: ShellState) => ({
    isOpen,
    fieldName,
    nodeId,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps> & DispatchProp<AnyShellAction>;

const NeverPublishedModal: React.FC<Props> = ({ dispatch, isOpen, updateField, fieldName, nodeId }) => {
    const [preventWarning, setPreventWarning] = useState<boolean>(false);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setPreventWarning(false);
    }, [isOpen]);

    const close = () => {
        dispatch({
            type: "NeverPublishedModal/HideModal",
        });
    };

    const continueClick = () => {
        updateField(fieldName, { type: "Page", value: nodeId });
        if (preventWarning) {
            setCookie("NeverShowLinkWarning", preventWarning.toString());
        }
        close();
    };

    const handleChanged = (_: React.SyntheticEvent, value: boolean) => {
        setPreventWarning(value);
    };

    return (
        <Modal size={450} isOpen={!!isOpen} headline="Warning" isCloseable handleClose={close} closeOnEsc>
            <MainTextStyle>
                Creating a link to an unpublished page can create 404 errors for users of your site. Do you want to link
                to this page?
            </MainTextStyle>
            <Checkbox checked={preventWarning} onChange={handleChanged}>
                Do not show this warning again
            </Checkbox>
            <ButtonBar>
                <Button variant="secondary" onClick={close}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={continueClick}>
                    Continue
                </Button>
            </ButtonBar>
        </Modal>
    );
};

const MainTextStyle = styled.div`
    padding-bottom: 10px;
`;

export default connect(mapStateToProps)(NeverPublishedModal);
