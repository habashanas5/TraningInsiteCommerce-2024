import Button from "@insite/mobius/Button";
import Modal from "@insite/mobius/Modal";
import Typography from "@insite/mobius/Typography";
import { closeMakeDefaultVariant, updateDefaultVariantRoot } from "@insite/shell/Store/PageTree/PageTreeActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

const mapStateToProps = (state: ShellState) => {
    const {
        pageTree: { makingDefaultPageUnderId, variantPageId },
    } = state;

    return {
        variantPageId,
        makingDefaultPageUnderId,
        visible: !!makingDefaultPageUnderId,
    };
};

const mapDispatchToProps = {
    updateDefaultVariantRoot,
    closeMakeDefaultVariant,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const MakeDefaultVariantModal: React.FC<Props> = ({
    variantPageId,
    makingDefaultPageUnderId,
    visible,
    updateDefaultVariantRoot,
    closeMakeDefaultVariant,
}) => {
    return (
        <Modal
            data-test-selector="MakeDefaultVariantModal"
            size={500}
            isOpen={visible}
            handleClose={closeMakeDefaultVariant}
            headline="Make Default"
        >
            <Typography>
                The rules for this variant will be deactivated and the current default variant will now require rules to
                be displayed.
            </Typography>
            <SetAsDefaultCancelButtonContainer>
                <CancelButton variant="tertiary" onClick={closeMakeDefaultVariant}>
                    Cancel
                </CancelButton>
                <Button
                    variant="primary"
                    onClick={() => updateDefaultVariantRoot(makingDefaultPageUnderId, variantPageId)}
                >
                    Set as Default
                </Button>
            </SetAsDefaultCancelButtonContainer>
        </Modal>
    );
};

const SetAsDefaultCancelButtonContainer = styled.div`
    text-align: right;
`;

const CancelButton = styled(Button)`
    margin-top: 20px;
    margin-right: 10px;
    height: 32px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(MakeDefaultVariantModal);
