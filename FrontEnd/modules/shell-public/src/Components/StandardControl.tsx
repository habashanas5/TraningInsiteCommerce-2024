import FieldDefinition, { ChildFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import Tooltip, { TooltipPresentationProps } from "@insite/mobius/Tooltip/Tooltip";
import * as React from "react";
import styled, { css } from "styled-components";

interface Props {
    fieldDefinition: FieldDefinition | (ChildFieldDefinition & { fieldType?: undefined });
    labelId?: string;
}

const tooltipStyles: TooltipPresentationProps = {
    cssOverrides: {
        tooltipWrapper: css`
            margin-left: 5px;
        `,
    },
};

const StandardControl: React.FC<Props> = props => (
    <>
        <Label htmlFor={props.fieldDefinition.name} id={props.labelId}>
            {props.fieldDefinition.displayName}
            {props.fieldDefinition.isRequired && <RequiredStyle>(Required)</RequiredStyle>}
            {props.fieldDefinition.tooltip && <Tooltip {...tooltipStyles} text={props.fieldDefinition.tooltip} />}
            {props.fieldDefinition.fieldType && (
                <FieldTypeStyle>{props.fieldDefinition.fieldType.substr(0, 1)}</FieldTypeStyle>
            )}
        </Label>
        <div data-test-selector={`controlFor_${props.fieldDefinition.name}`}>{props.children}</div>
    </>
);

export default StandardControl;

const Label = styled.label`
    display: block;
    font-size: 16px;
    line-height: 21px;
    font-weight: bold;
    margin: 25px 0 -4px;
    text-transform: uppercase;
    position: relative;
`;

const FieldTypeStyle = styled.span`
    position: absolute;
    right: 0;
    font-size: 12px;
    font-weight: normal;
`;

const RequiredStyle = styled.span`
    color: ${props => props.theme.colors.text.accent};
    text-transform: none;
    margin-left: 4px;
`;

const ToolTipStyle = styled.span`
    position: relative;
    margin-left: 6px;
    svg {
        position: absolute;
    }
    span {
        display: none;
    }
    svg:hover + span {
        position: absolute;
        display: block;
        z-index: 1;
        right: -20px;
        width: 200px;
        background-color: ${props => props.theme.colors.common.accent};
        padding: 10px;
        text-transform: none;
        font-weight: 300;
        box-shadow: 2px 2px 4px #666;
        border-radius: 3px;
    }
`;
