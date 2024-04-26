import { HasLinksState } from "@insite/client-framework/Store/Links/LinksState";
import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import { ListFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import Button from "@insite/mobius/Button";
import Drag from "@insite/shell/Components/Icons/Drag";
import Trash from "@insite/shell/Components/Icons/Trash";
import FieldsEditor from "@insite/shell/Components/ItemEditor/FieldsEditor";
import { HasSideBarForm, withSideBarForm } from "@insite/shell/Components/Shell/SideBarForm";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ThunkDispatch } from "redux-thunk";
import styled, { css } from "styled-components";

interface State {
    hasValidationErrors: boolean;
}

interface ItemProps {
    item: HasFields;
    index: number;
    editingIndex: number;
    delete: (index: number) => void;
    onDragEnd: () => void;
    onDragStart: (index: number) => void;
    fieldDefinition: ListFieldDefinition;
    editRow: (index: number) => void;
    onChange: (index: number, item: HasFields) => void;
}

const mapStateToProps = (state: ShellState, ownProps: ItemProps) => {
    const display = ownProps.fieldDefinition.getDisplay(ownProps.item, state);
    let displayName: string | undefined;
    let dispatchForDisplay: ((dispatch: ThunkDispatch<HasLinksState, void, any>) => void) | undefined;

    if (typeof display === "function") {
        dispatchForDisplay = display;
    } else {
        displayName = display;
    }

    return {
        displayName,
        dispatchForDisplay,
    };
};

type Props = ItemProps & HasSideBarForm & ReturnType<typeof mapStateToProps> & { dispatch: Dispatch };

class ListFieldRow extends React.Component<Props, State> {
    // this is required because firefox doesn't set clientY in the drag event that uses this below
    private clientY = 0;
    private readonly row: React.RefObject<HTMLDivElement>;
    private hasValidationErrors: () => boolean;

    constructor(props: Props) {
        super(props);

        props.sideBarForm.registerOnSave(this.onSave);

        this.row = React.createRef();
        this.hasValidationErrors = () => false;
        this.state = {
            hasValidationErrors: false,
        };
    }

    componentDidMount() {
        document.addEventListener("dragover", this.documentDragOver);
    }

    componentWillUnmount() {
        document.removeEventListener("dragover", this.documentDragOver);
    }

    documentDragOver = (event: DragEvent) => {
        this.clientY = event.clientY;
    };

    onSave = () => {
        return !this.hasValidationErrors();
    };

    delete = () => {
        if (this.props.editingIndex >= 0) {
            return;
        }
        this.props.delete(this.props.index);
    };

    dragHandleMouseDown = () => {
        if (this.props.editingIndex >= 0) {
            return;
        }
        this.row.current!.setAttribute("draggable", "true");
    };

    dragStart = (event: React.DragEvent<HTMLElement>) => {
        setTimeout(() => {
            this.row.current!.style.display = "none";
        });

        this.props.onDragStart(this.props.index);

        return undefined;
    };

    dragEnd = () => {
        this.row.current!.setAttribute("draggable", "false");
        this.row.current!.style.display = "";
        this.props.onDragEnd();
    };

    drag = () => {
        const scrollContainer = this.row.current!.closest("[data-scroll-container]");
        if (!scrollContainer) {
            return;
        }

        const boundingClientRect = scrollContainer.getBoundingClientRect();

        const top = this.clientY - boundingClientRect.top;
        if (top < 40) {
            this.scroll(-10, scrollContainer);
        } else if (top < 60) {
            this.scroll(-5, scrollContainer);
        }

        const bottom = boundingClientRect.bottom - this.clientY;
        if (bottom < 40) {
            this.scroll(15, scrollContainer);
        } else if (bottom < 60) {
            this.scroll(8, scrollContainer);
        }
    };

    scroll = (step: number, element: Element) => {
        element.scrollTop += step;
    };

    updateField = (fieldName: string, value: any) => {
        const { item, index, onChange } = this.props;
        item.fields[fieldName] = value;
        if (!this.hasValidationErrors()) {
            onChange(index, item);
        }
    };

    onClick = () => {
        if (this.props.editingIndex === this.props.index) {
            if (!this.hasValidationErrors()) {
                this.props.editRow(-1);
            }
        } else {
            this.props.editRow(this.props.index);
        }
    };

    updateHasValidationErrors = (hasValidationErrors: boolean) => {
        this.setState({
            hasValidationErrors,
        });
    };

    registerHasValidationErrors = (hasValidationErrors: () => boolean) => {
        this.hasValidationErrors = hasValidationErrors;
    };

    render() {
        const { item, fieldDefinition, dispatchForDisplay, displayName, dispatch, index, editingIndex } = this.props;
        if (dispatchForDisplay) {
            dispatchForDisplay(dispatch);
        }

        const isBeingEdited = editingIndex === index;
        const somethingIsBeingEdited = editingIndex >= 0;

        return (
            <ChildStyle ref={this.row} onDragStart={this.dragStart} onDragEnd={this.dragEnd} onDrag={this.drag}>
                <ChildWrapper>
                    <OverflowStyle onMouseDown={this.dragHandleMouseDown} disabled={somethingIsBeingEdited}>
                        <Drag color1={somethingIsBeingEdited ? "#ddd" : "#4a4a4a"} />
                    </OverflowStyle>
                    <Content>{displayName}</Content>
                    {!this.props.fieldDefinition.hideEdit && (
                        <Button
                            variant={isBeingEdited ? "primary" : "secondary"}
                            sizeVariant="small"
                            css={buttonStyles}
                            disabled={somethingIsBeingEdited && !isBeingEdited}
                            onClick={this.onClick}
                            data-test-selector={`listFieldButton_${index}`}
                        >
                            {isBeingEdited ? "Done" : "Edit"}
                        </Button>
                    )}
                    {!this.props.fieldDefinition.hideDelete && (
                        <TrashStyle disabled={somethingIsBeingEdited} onClick={this.delete}>
                            <Trash height={18} color1={somethingIsBeingEdited ? "#ddd" : "#4a4a4a"} />
                        </TrashStyle>
                    )}
                </ChildWrapper>
                {isBeingEdited && (
                    <FieldsEditorStyle>
                        <FieldsEditor
                            fieldDefinitions={fieldDefinition.fieldDefinitions}
                            item={item}
                            updateField={this.updateField}
                            registerHasValidationErrors={this.registerHasValidationErrors}
                            updateHasValidationErrors={this.updateHasValidationErrors}
                        />
                    </FieldsEditorStyle>
                )}
            </ChildStyle>
        );
    }
}

export default withSideBarForm(connect(mapStateToProps)(ListFieldRow));

const Content = styled.div`
    flex-grow: 1;
    margin-left: 10px;
    word-break: break-word;
`;

const buttonStyles = css`
    height: 24px;
    border-radius: 3px;
    border-width: 1px;
    padding: 0 6px;
    span {
        text-transform: none;
        font-weight: normal;
    }
    margin-right: 10px;
`;

const ChildStyle = styled.div`
    background-color: ${props => props.theme.colors.common.accent};
    border-top: 1px solid ${props => props.theme.colors.text.accent};
    border-bottom: 1px solid ${props => props.theme.colors.text.accent};
    margin: 4px 0;
`;

const ChildWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 15px 10px;
`;

const OverflowStyle = styled.div<{ disabled: boolean }>`
    display: flex;
    width: 20px;
    height: 54px;
    cursor: ${props => (props.disabled ? "default" : "drag")};
    margin: -15px -10px -15px 0;
    align-items: center;
    flex-shrink: 0;
`;

const TrashStyle = styled.div<{ disabled: boolean }>`
    cursor: ${props => (props.disabled ? "default" : "pointer")};
    display: flex;
    align-items: center;
`;

const FieldsEditorStyle = styled.div`
    padding: 15px 35px;
    background-color: ${props => props.theme.colors.common.background};
`;
