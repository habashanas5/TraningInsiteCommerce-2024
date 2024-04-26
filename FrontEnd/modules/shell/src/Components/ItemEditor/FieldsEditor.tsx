import { Dictionary } from "@insite/client-framework/Common/Types";
import logger from "@insite/client-framework/Logger";
import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import { ChildFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import { TabDefinition } from "@insite/client-framework/Types/TabDefinition";
import Tab, { TabProps } from "@insite/mobius/Tab";
import TabGroup from "@insite/mobius/TabGroup";
import { setEditorTemplatesHotUpdate } from "@insite/shell-public/EditorTemplatesLoader";
import { getEditorTemplate } from "@insite/shell/Components/ItemEditor/EditorTemplatesLoader";
import { validateField, validateItem } from "@insite/shell/Services/ItemValidation";
import sortBy from "lodash/sortBy";
import * as React from "react";
import styled, { css, FlattenSimpleInterpolation } from "styled-components";

interface OwnProps {
    fieldDefinitions: ChildFieldDefinition[];
    item: HasFields;
    updateField: (fieldName: string, value: readonly HasFields[]) => void;
    updateHasValidationErrors: (hasValidationErrors: boolean) => void;
    registerHasValidationErrors: (validate: () => boolean) => void;
}

interface State {
    validationErrors: Dictionary<string | null | undefined>;
}

export default class FieldsEditor extends React.Component<OwnProps, State> {
    constructor(props: OwnProps) {
        super(props);

        this.state = {
            validationErrors: {},
        };

        props.updateHasValidationErrors(false);
        props.registerHasValidationErrors(() => {
            const validationErrors = validateItem(props.fieldDefinitions, this.props.item);
            this.setState({
                validationErrors,
            });
            const hasValidationErrors = Object.keys(validationErrors).length !== 0;
            this.props.updateHasValidationErrors(hasValidationErrors);
            return hasValidationErrors;
        });

        if (module.hot) {
            this.forceUpdate = this.forceUpdate.bind(this);
            setEditorTemplatesHotUpdate(this.forceUpdate);
        }
    }

    updateField = (fieldName: string, value: readonly HasFields[]) => {
        this.props.updateField(fieldName, value);

        setTimeout(() => {
            // we need item to be updated before we can validate it
            this.checkForValidationErrors(fieldName);
        });
    };

    checkForValidationErrors = (fieldName: string) => {
        const { fieldDefinitions, item } = this.props;
        const newValidationErrors = { ...this.state.validationErrors };
        let updateState = false;

        const changedDefinitions = fieldDefinitions.filter(o => o.name === fieldName);
        if (changedDefinitions.length !== 1) {
            return;
        }

        let fieldNames = [fieldName];
        if (changedDefinitions[0].dependentFields) {
            fieldNames = fieldNames.concat(changedDefinitions[0].dependentFields);
        }

        for (const name of fieldNames) {
            const definitions = fieldDefinitions.filter(o => o.name === name);
            if (definitions.length !== 1) {
                continue;
            }

            const validationError = validateField(definitions[0], item);

            updateState = true;
            if (!validationError) {
                delete newValidationErrors[name];
            } else {
                newValidationErrors[name] = validationError;
            }
        }

        if (!updateState) {
            return;
        }

        this.props.updateHasValidationErrors(Object.keys(newValidationErrors).length !== 0);

        this.setState({
            validationErrors: newValidationErrors,
        });
    };

    render() {
        const { fieldDefinitions, item } = this.props;

        const fieldsByTab: Dictionary<typeof fieldDefinitions> = {};
        let tabs: TabDefinition[] = [];

        fieldDefinitions.forEach(fieldDefinition => {
            const tab = fieldDefinition.tab!;
            if (tabs.findIndex(o => o.displayName === tab.displayName) < 0) {
                tabs.push(tab);
                fieldsByTab[tab.displayName] = [];
            }

            fieldsByTab[tab.displayName].push(fieldDefinition);
        });

        tabs = sortBy(tabs, [(o: TabDefinition) => o.sortOrder, (o: TabDefinition) => o.displayName]);

        const renderFields = (tab: TabDefinition) => {
            return fieldsByTab[tab.displayName].map(fieldDefinition => {
                if (fieldDefinition.isVisible && !fieldDefinition.isVisible(item)) {
                    if (this.state.validationErrors[fieldDefinition.name]) {
                        logger.warn(
                            "Field has validation error and hidden, use dependentFields to prevent such situations",
                        );
                    }
                    return null;
                }

                const editorProps = {
                    fieldDefinition,
                    item,
                    fieldValue: item.fields[fieldDefinition.name],
                    updateField: this.updateField,
                };
                return (
                    <FieldErrorBoundary
                        key={fieldDefinition.name + fieldDefinition.sortOrder}
                        name={fieldDefinition.name}
                    >
                        {getEditorTemplate(fieldDefinition, editorProps)}
                        <ErrorMessage data-test-selector={`controlFor_${fieldDefinition.name}_error`}>
                            {this.state.validationErrors[fieldDefinition.name]}
                        </ErrorMessage>
                    </FieldErrorBoundary>
                );
            });
        };

        return (
            <>
                {tabs.length === 0 ? null : tabs.length > 1 ? (
                    <TabGroup cssOverrides={{ tabContent, tabGroup, wrapper }}>
                        {tabs.map(tab => (
                            <Tab
                                key={tab.displayName}
                                tabKey={tab.displayName}
                                headline={tab.displayName}
                                css={tabCss}
                                data-test-selector={`editItem_${tab.dataTestSelector}`}
                            >
                                {renderFields(tab)}
                            </Tab>
                        ))}
                    </TabGroup>
                ) : (
                    renderFields(tabs[0])
                )}
            </>
        );
    }
}

const ErrorMessage = styled.span`
    color: red;
`;

const tabCss: FlattenSimpleInterpolation = css`
    font-size: 16px;
    padding: 6px;
    &:hover {
        cursor: ${(props: TabProps) => (props.selected ? "default" : "pointer")};
    }
    font-weight: ${(props: TabProps) => (props.selected ? "bold" : "inherit")};
` as FlattenSimpleInterpolation;

const tabContent = css`
    border-bottom: none;
    padding: 12px 25px;
`;

const tabGroup = css`
    padding: 0;
`;

const wrapper = css`
    margin: 0 -25px;
    padding: 0;
`;

type FieldErrorBoundaryProps = { name: string };

class FieldErrorBoundary extends React.Component<FieldErrorBoundaryProps, { hasError?: true }> {
    constructor(props: FieldErrorBoundaryProps) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return `Failed to render field "${this.props.name}".`;
        }

        return this.props.children;
    }
}
