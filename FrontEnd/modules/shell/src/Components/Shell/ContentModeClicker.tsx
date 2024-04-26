import ContentMode from "@insite/client-framework/Common/ContentMode";
import Icon from "@insite/mobius/Icon";
import ClickerStyle from "@insite/shell/Components/Shell/ClickerStyle";
import shellTheme from "@insite/shell/ShellTheme";
import { setContentMode } from "@insite/shell/Store/ShellContext/ShellContextActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ShellState, ownProps: OwnProps) => ({
    targetMatchesCurrentContentMode: state.shellContext.contentMode === ownProps.targetContentMode,
});

const mapDispatchToProps = {
    setContentMode,
};

type OwnProps = { targetContentMode: ContentMode; icon: React.FC | string; disabled?: boolean };

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

const contentModeLabel: Record<ContentMode, string> = {
    Editing: "Edit",
    Previewing: "Preview",
    Viewing: "View",
};

class ContentModeClicker extends React.Component<Props> {
    onClick = () => {
        const { targetMatchesCurrentContentMode, setContentMode, targetContentMode } = this.props;
        setContentMode(targetMatchesCurrentContentMode ? "Viewing" : targetContentMode);
    };

    render() {
        const { targetMatchesCurrentContentMode, icon, targetContentMode, disabled } = this.props;
        const {
            colors: { common, text },
        } = shellTheme;
        let iconColor: string;
        if (disabled) {
            iconColor = common.disabled;
        } else {
            iconColor = text.main;
        }

        return (
            <ClickerStyle
                active={targetMatchesCurrentContentMode}
                clickable
                onClick={this.onClick}
                data-test-selector={`contentModeClicker_${targetContentMode}`}
                disabled={disabled}
                title={contentModeLabel[targetContentMode]}
            >
                <Icon src={icon} color={iconColor} />
            </ClickerStyle>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentModeClicker);
