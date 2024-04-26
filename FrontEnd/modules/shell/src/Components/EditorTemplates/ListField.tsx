import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import { ListFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import Button from "@insite/mobius/Button";
import StandardControl from "@insite/shell-public/Components/StandardControl";
import { EditorTemplateProps } from "@insite/shell-public/EditorTemplateProps";
import ListFieldRow from "@insite/shell/Components/EditorTemplates/ListFieldRow";
import cloneDeep from "lodash/cloneDeep";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";

interface State {
    editingIndex: number;
}

type Props = EditorTemplateProps<readonly HasFields[], ListFieldDefinition> & { dispatch: Dispatch };

class ListField extends React.Component<Props, State> {
    private readonly listContainer: React.RefObject<HTMLDivElement>;
    private placeholder: HTMLElement | undefined;
    private draggingIndex = -1;

    constructor(props: Props) {
        super(props);

        this.listContainer = React.createRef();
        this.state = {
            editingIndex: -1,
        };
    }

    componentDidMount(): void {
        if (this.props.fieldDefinition.onLoad) {
            this.props.fieldDefinition.onLoad(this.props.dispatch);
        }
    }

    componentWillUnmount() {
        this.props.fieldDefinition.onDoneEditingRow?.(this.props.dispatch);
    }

    addItem = () => {
        const newChild: HasFields = {
            fields: {},
        };
        for (const fieldDefinition of this.props.fieldDefinition.fieldDefinitions) {
            newChild.fields[fieldDefinition.name] = fieldDefinition.defaultValue;
        }

        const array = this.props.fieldValue ? this.props.fieldValue : [];

        this.props.updateField(this.props.fieldDefinition.name, [...array, newChild]);
        this.setState({
            editingIndex: array.length,
        });
    };

    onChange = (index: number, item: HasFields) => {
        const value = [...this.props.fieldValue];
        value.splice(index, 1, item);
        this.props.updateField(this.props.fieldDefinition.name, value);
    };

    delete = (index: number) => {
        const value = [...this.props.fieldValue];
        value.splice(index, 1);
        this.props.updateField(this.props.fieldDefinition.name, value);
        this.setState({ editingIndex: -1 });
    };

    dragOver = (event: React.DragEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (typeof this.placeholder === "undefined") {
            this.placeholder = document.createElement("div");
            this.placeholder.style.backgroundColor = "#ddd";
            this.placeholder.style.width = "100%";
            this.placeholder.style.height = "36px";
        }

        this.placeholder.style.display = "";

        const listContainerElement = this.listContainer.current!;

        let foundSpot = false;

        listContainerElement.childNodes.forEach(childElement => {
            if (foundSpot) {
                return;
            }
            const actualElement = childElement as HTMLElement;
            if (actualElement === this.placeholder) {
                return;
            }

            const childRect = actualElement.getBoundingClientRect();
            if (childRect.top + childRect.height / 2 > event.clientY) {
                listContainerElement.insertBefore(this.placeholder!, childElement);
                foundSpot = true;
            }
        });

        if (!foundSpot) {
            listContainerElement.appendChild(this.placeholder);
        }
    };

    onDragEnd = () => {
        this.placeholder!.style.display = "none";
        this.setState({ editingIndex: -1 });
    };

    drop = (event: React.DragEvent<HTMLElement>) => {
        let newIndex = 0;
        let found = false;
        this.listContainer.current!.childNodes.forEach(childElement => {
            if (found) {
                return;
            }
            if (childElement === this.placeholder) {
                found = true;
                return;
            }
            if ((childElement as HTMLElement).style.display === "none") {
                return;
            }

            newIndex += 1;
        });

        const value = [...this.props.fieldValue];
        const removed = value.splice(this.draggingIndex, 1);
        value.splice(newIndex, 0, removed[0]);
        this.props.updateField(this.props.fieldDefinition.name, value);

        this.placeholder!.style.display = "none";
    };

    onDragStart = (index: number) => {
        this.draggingIndex = index;
    };

    editRow = (index: number) => {
        if (index === -1) {
            this.props.fieldDefinition.onDoneEditingRow?.(this.props.dispatch);
        } else {
            this.props.fieldDefinition.onEditRow?.(index, this.props.dispatch);
        }

        this.setState({
            editingIndex: index,
        });
    };

    render() {
        return (
            <StandardControl fieldDefinition={this.props.fieldDefinition}>
                <ChildListStyles ref={this.listContainer} onDragOver={this.dragOver} onDrop={this.drop}>
                    {this.props?.fieldValue.map((child, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <ListFieldRow
                            key={index}
                            onChange={this.onChange}
                            item={cloneDeep(child)}
                            index={index}
                            editingIndex={this.state.editingIndex}
                            editRow={this.editRow}
                            delete={this.delete}
                            onDragEnd={this.onDragEnd}
                            onDragStart={this.onDragStart}
                            fieldDefinition={this.props.fieldDefinition}
                        />
                    ))}
                </ChildListStyles>
                {!this.props.fieldDefinition.hideAdd && (
                    <AddStyle>
                        <Button variant="secondary" onClick={this.addItem} disabled={this.state.editingIndex >= 0}>
                            Add
                        </Button>
                    </AddStyle>
                )}
            </StandardControl>
        );
    }
}

export default connect()(ListField);

const AddStyle = styled.div`
    border-top: 1px dashed black;
    border-bottom: 1px dashed black;
    margin: 4px -35px 0;
    padding: 11px 25px;
    text-align: center;
`;

const ChildListStyles = styled.div`
    margin: 0 -35px;
`;
