import Button, { ButtonIcon } from "@insite/mobius/Button";
import X from "@insite/mobius/Icons/X";
import Popover, { PopoverPresentationProps } from "@insite/mobius/Popover";
import Typography from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import DisabledInCodeTooltip from "@insite/shell/Components/Shell/StyleGuide/DisabledInCodeTooltip";
import { ShellTheme } from "@insite/shell/ShellTheme";
import * as React from "react";
import { ColorChangeHandler, SketchPicker } from "react-color";
import styled, { css, ThemeProps } from "styled-components";

const LabelWithInputAtEnd = styled.label<ThemeProps<ShellTheme> & { firstInput?: boolean; disabled?: boolean }>`
    display: flex;
    justify-content: space-between;
    &:hover {
        .label {
            color: ${({ theme, disabled }) => (disabled ? "inherit" : theme.colors.primary.main)};
        }
    }
    > span {
        margin: 0;
    }
    > nav {
        margin-top: 8px;
    }
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

const ColorButton = styled.button<{ color: string }>`
    background: ${props =>
        props.color.toLowerCase() === "unset"
            ? css`
            repeating-linear-gradient(
                45deg,
                rgba(255,255,255,0.75),
                rgba(255,255,255,0.75) 5px,
                rgba(255,255,255,0.15) 5px,
                rgba(255,255,255,0.15) 10px
                )
            `
            : props.color};
    border: 1px ${getColor("common.border")} solid;
    margin: 0;
    padding: 0;
    height: 24px;
    width: 24px;
    border-radius: 6px;
    cursor: pointer;
    &:focus {
        outline-color: ${({ theme }) => theme.focus.color};
        outline-style: ${({ theme }) => theme.focus.style};
        outline-width: ${({ theme }) => theme.focus.width};
        outline-offset: 1px;
    }
`;

type ColorPickerProps = {
    id: string;
    label?: React.ReactNode;
    color: string | undefined;
    disabled?: boolean;
    onChange: ColorChangeHandler;
    presetColors?: string[];
    firstInput?: boolean;
    isInPopover?: boolean;
    popoverProps?: PopoverPresentationProps;
    preventColorReset?: boolean;
};

class ColorPicker extends React.Component<ColorPickerProps> {
    element = React.createRef<HTMLDivElement>();

    render() {
        const {
            id,
            label,
            color,
            disabled,
            firstInput,
            onChange,
            presetColors,
            isInPopover,
            popoverProps,
            preventColorReset,
        } = this.props;
        const labelId = `${id}-label`;
        return (
            <LabelWithInputAtEnd htmlFor={id} firstInput={firstInput} disabled={disabled}>
                {label && (
                    <Typography variant="h6" as="span" className="label">
                        {label}
                    </Typography>
                )}
                {disabled ? (
                    <DisabledInCodeTooltip
                        triggerComponent={
                            <ColorButton color={color || "unset"} id={id} aria-labelledby={labelId} as="span" />
                        }
                        tooltipPosition="left"
                    />
                ) : (
                    <Popover
                        toggle={false}
                        wrapperProps={{ _width: "auto" }}
                        insideRefs={[this.element]}
                        popoverTrigger={<ColorButton color={color || "unset"} id={id} aria-labelledby={labelId} />}
                        contentBodyProps={{ _height: "400px", _width: 220 }}
                        positionFunction={(element: React.RefObject<HTMLUListElement>) => {
                            const rect = element.current!.getBoundingClientRect();
                            let left;
                            if (isInPopover) {
                                left = rect.right - 217;
                            } else {
                                left = (rect.right > 300 ? 290 : rect.right) - 217;
                            }
                            return {
                                left: `${left}px`,
                                top: rect!.top + 24,
                                position: "fixed",
                            };
                        }}
                        {...popoverProps}
                    >
                        <SketchPicker
                            color={color || ""}
                            onChangeComplete={onChange}
                            presetColors={presetColors || []}
                            // terrible formatting because definitely-typed erroneously excludes the below prop
                            {...({
                                styles: { controls: { width: preventColorReset ? "100%" : "85%", display: "flex" } },
                            } as any)}
                        />
                        {!preventColorReset && (
                            <Button
                                onClick={() =>
                                    onChange({
                                        rgb: { r: 0, g: 0, b: 0, a: 100 },
                                        hex: "unset",
                                        hsl: { a: 0, h: 0, l: 0, s: 0 },
                                    })
                                }
                                buttonType="solid"
                                color="common.accent"
                                sizeVariant="small"
                                css={css`
                                    position: absolute;
                                    top: 162px;
                                    right: 10px;
                                    padding: 0;
                                    &:hover {
                                        color: black;
                                    }
                                `}
                            >
                                <ButtonIcon src={X} />
                            </Button>
                        )}
                    </Popover>
                )}
            </LabelWithInputAtEnd>
        );
    }
}

export default ColorPicker;
