import Button from "@insite/mobius/Button";
import Typography from "@insite/mobius/Typography";
import { ShellThemeProps } from "@insite/shell/ShellTheme";
import * as React from "react";
import styled from "styled-components";

interface Props {
    title: string;
    save: (event: React.MouseEvent) => void;
    saveText?: string;
    cancel: (event: React.MouseEvent) => void;
    disableSave?: boolean;
    name?: string;
}

class SideBarForm extends React.Component<Props> {
    onSave?: () => boolean | undefined;

    registerOnSave = (onSave: () => boolean | undefined) => {
        this.onSave = onSave;
    };

    saveClick = (event: React.MouseEvent) => {
        if (this.onSave && this.onSave() === false) {
            return;
        }

        this.props.save(event);
    };

    render() {
        return (
            <OverlayStyle data-scroll-container="true">
                <Wrapper>
                    <SideBarName variant="h1" data-test-selector={`sideBarName_${this.props.name}`}>
                        {this.props.title}
                    </SideBarName>
                    <SideBarFormContext.Provider value={{ registerOnSave: this.registerOnSave }}>
                        {this.props.children}
                    </SideBarFormContext.Provider>
                    <Buttons>
                        <Button data-test-selector="sideBar_cancel" variant="secondary" onClick={this.props.cancel}>
                            Cancel
                        </Button>
                        <Button
                            data-test-selector="sideBar_save"
                            variant="primary"
                            onClick={this.saveClick}
                            disabled={this.props.disableSave}
                        >
                            {this.props.saveText ? this.props.saveText : "Save"}
                        </Button>
                    </Buttons>
                </Wrapper>
            </OverlayStyle>
        );
    }
}

interface SideBarFormModel {
    registerOnSave: (onSave: () => boolean | undefined) => void;
}

export type HasSideBarForm = {
    sideBarForm: SideBarFormModel;
};

export const SideBarFormContext = React.createContext<SideBarFormModel>({ registerOnSave: () => {} });

export function withSideBarForm<P extends HasSideBarForm>(Component: React.ComponentType<P>) {
    return function SideBarFormComponent(props: Omit<P, keyof HasSideBarForm>) {
        return (
            <SideBarFormContext.Consumer>
                {sideBarForm => <Component {...(props as P)} sideBarForm={sideBarForm} />}
            </SideBarFormContext.Consumer>
        );
    };
}

export default SideBarForm;

const Buttons = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 340px;
    padding: 20px 35px;
    text-align: right;
    background: #fff;
    button {
        margin-left: 10px;
    }
    z-index: 5;
`;

export const OverlayStyle = styled.div`
    position: fixed;
    background: ${(props: ShellThemeProps) => props.theme.colors.common.background};
    left: 0;
    top: 0;
    height: 100%;
    width: ${(props: ShellThemeProps) => props.theme.sideBarWidth};
    overflow-y: auto;
    z-index: ${(props: ShellThemeProps) => props.theme.zIndex.modal};
`;

const Wrapper = styled.div`
    padding: 35px 35px 95px;
`;

const SideBarName = styled(Typography)`
    font-size: 1.25rem;
    color: ${props => props.theme.colors.text.main};
`;
