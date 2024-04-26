/* eslint-disable spire/export-styles */
import { useShellContext } from "@insite/client-framework/Components/IsInShell";
import { useGetLink } from "@insite/client-framework/Store/Links/LinksSelectors";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import Button from "@insite/mobius/Button";
import { useHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import * as React from "react";
import { FC } from "react";
import styled from "styled-components";

const enum fields {
    variant = "variant",
    label = "label",
    link = "link",
    alignment = "alignment",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.variant]: "primary" | "secondary" | "tertiary";
        [fields.label]: string;
        [fields.link]: LinkFieldValue;
        [fields.alignment]: string;
    };
}

export interface ButtonStyles {
    wrapperStyles: InjectableCss;
}

const wrapperStyles: InjectableCss = {};

export const CmsButton: FC<OwnProps> = ({ fields }) => {
    const history = useHistory();
    const link = useGetLink(fields.link);
    const { isInShell } = useShellContext();

    const onClick = () => {
        if (!link.url) {
            return;
        }

        if (link.url.startsWith("http")) {
            if (isInShell) {
                return;
            }

            window.location.href = link.url;
        } else {
            history.push(link.url);
        }
    };

    const styles = useMergeStyles("button", { wrapperStyles });

    return (
        <ContentWrapper alignment={fields.alignment} {...styles?.wrapperStyles}>
            <Button variant={fields.variant} onClick={onClick}>
                {fields.label}
            </Button>
        </ContentWrapper>
    );
};

export const ContentWrapper = styled.div<InjectableCss & { alignment: string }>`
    display: flex;
    width: 100%;
    justify-content: ${props => props.alignment ?? "flex-start"};
    ${injectCss};
`;

const widgetModule: WidgetModule = {
    component: CmsButton,
    definition: {
        group: "Basic",
        icon: "Button",
        fieldDefinitions: [
            {
                name: fields.variant,
                displayName: "Button Variant",
                editorTemplate: "DropDownField",
                options: [
                    { displayName: "Primary", value: "primary" },
                    { displayName: "Secondary", value: "secondary" },
                    { displayName: "Tertiary", value: "tertiary" },
                ],
                defaultValue: "primary",
                fieldType: "General",
            },
            {
                name: fields.label,
                displayName: "Button Label",
                editorTemplate: "TextField",
                defaultValue: "",
                fieldType: "Translatable",
            },
            {
                name: fields.link,
                displayName: "Button Link",
                editorTemplate: "LinkField",
                defaultValue: {
                    value: "",
                    type: "Page",
                },
                fieldType: "General",
            },
            {
                name: fields.alignment,
                displayName: "Button Alignment",
                editorTemplate: "DropDownField",
                options: [
                    { displayName: "Left", value: "flex-start" },
                    { displayName: "Center", value: "center" },
                    { displayName: "Right", value: "flex-end" },
                ],
                defaultValue: "primary",
                fieldType: "General",
            },
        ],
    },
};

export default widgetModule;
