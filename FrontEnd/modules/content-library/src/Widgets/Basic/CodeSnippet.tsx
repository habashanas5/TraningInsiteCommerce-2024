import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import siteMessage from "@insite/client-framework/SiteMessage";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import merge from "lodash/merge";
import React, { useState } from "react";
import { css } from "styled-components";

const enum fields {
    content = "content",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.content]: string;
    };
    extendedStyles?: CodeSnippetStyles;
}

type Props = OwnProps & HasShellContext;

export interface CodeSnippetStyles {
    wrapper?: InjectableCss;
    titleText?: TypographyPresentationProps;
    instructionText?: TypographyPresentationProps;
}

export const codeSnippetStyles: CodeSnippetStyles = {
    wrapper: {
        css: css`
            background: #e5e5e5;
            padding: 10px;
        `,
    },
    titleText: {
        variant: "h6",
        css: css`
            margin: 0;
        `,
    },
};

const CodeSnippet = ({ fields, shellContext, extendedStyles }: Props) => {
    const [styles] = useState(() => merge(codeSnippetStyles, extendedStyles));

    return (
        <>
            {shellContext.isInShell && shellContext.isEditing && (
                <StyledWrapper {...styles.wrapper}>
                    <Typography {...styles.titleText}>{translate("Code Snippet")}</Typography>
                    <Typography {...styles.instructionText}>{siteMessage("CodeSnippet_Instruction")}</Typography>
                </StyledWrapper>
            )}
            {/* eslint-disable react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: fields.content }}></div>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: withIsInShell(CodeSnippet),
    definition: {
        group: "Basic",
        canAdd: context => context.permissions?.canUseAdvancedFeatures || false,
        fieldDefinitions: [
            {
                name: fields.content,
                displayName: "Code",
                tooltip: "",
                editorTemplate: "CodeSnippetField",
                defaultValue: "",
                fieldType: "Contextual",
            },
        ],
    },
};

export default widgetModule;
