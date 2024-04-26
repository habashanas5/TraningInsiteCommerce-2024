import Button from "@insite/mobius/Button";
import Modal from "@insite/mobius/Modal";
import Typography from "@insite/mobius/Typography";
import { closeRulesEdit } from "@insite/shell/Store/PageTree/PageTreeActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

const mapStateToProps = (state: ShellState) => {
    const {
        pageTree: { variantRulesForPageId, isNewVariant },
    } = state;

    return {
        variantRulesForPageId,
        visible: !!variantRulesForPageId,
        isNewVariant,
    };
};

const mapDispatchToProps = {
    closeRulesEdit,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const VariantRulesModal: React.FC<Props> = ({ variantRulesForPageId, visible, isNewVariant, closeRulesEdit }) => {
    const [saveDisabled, setSaveDisabled] = React.useState<boolean>(true);
    const [showSkip, setShowSkip] = React.useState<boolean | undefined>(isNewVariant);

    useEffect(() => {
        if (!visible) {
            return;
        }

        window.onmessage = (e: MessageEvent) => {
            const messagePrefix = "rule-manager-is-dirty-";
            if (typeof e.data === "string") {
                if (e.data.indexOf(messagePrefix) !== -1) {
                    setSaveDisabled(e.data === `${messagePrefix}false`);
                } else if (e.data === "rule-manager-is-saved") {
                    setShowSkip(false);
                }
            }
        };

        setShowSkip(isNewVariant);

        return () => {
            window.onmessage = null;
        };
    }, [visible]);

    if (!visible) {
        return null;
    }

    return (
        <Modal
            data-test-selector="VariantRulesModal"
            size={900}
            isOpen={visible}
            handleClose={closeRulesEdit}
            headline="Edit Variant Rules"
        >
            <Typography>
                Add rules to determine when this variant is displayed to website users. For example, add a location rule
                that matches a specific country to only show this variant to users from that country.
            </Typography>
            <RulesContainer>
                <RulesIFrame id="rule-manager-iframe" src={`/admin/data/pages/${variantRulesForPageId}?iframe=true`} />
            </RulesContainer>
            <SaveCancelButtonContainer>
                <CancelButton data-test-selector="VariantRulesModal_Cancel" variant="tertiary" onClick={closeRulesEdit}>
                    {showSkip === true ? "Skip for now" : showSkip === false ? "Close" : "Cancel"}
                </CancelButton>
                <Button
                    disabled={saveDisabled}
                    variant="primary"
                    onClick={() => {
                        const ruleManagerIframe = document.getElementById("rule-manager-iframe") as any;
                        if (ruleManagerIframe) {
                            ruleManagerIframe.contentWindow.postMessage("rule-manager-save", "*");
                        }
                    }}
                >
                    Save
                </Button>
            </SaveCancelButtonContainer>
        </Modal>
    );
};

const RulesContainer = styled.div`
    height: 500px;
`;

const RulesIFrame = styled.iframe`
    height: 100%;
    width: 100%;
    border: none;
`;

const SaveCancelButtonContainer = styled.div`
    border-top: 1px solid #c3c2c3;
    text-align: right;
`;

const CancelButton = styled(Button)`
    margin-top: 20px;
    margin-right: 10px;
    height: 32px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(VariantRulesModal);
