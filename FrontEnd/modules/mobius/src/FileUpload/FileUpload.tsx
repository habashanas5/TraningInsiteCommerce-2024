import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import FormField, {
    FormFieldClickable,
    FormFieldComponentProps,
    FormFieldIcon,
    FormFieldPresentationProps,
    FormFieldSizeVariant,
} from "@insite/mobius/FormField";
import { sizeVariantValues, VariantValues } from "@insite/mobius/FormField/formStyles";
import { BaseTheme, ThemeTransitionDuration } from "@insite/mobius/globals/baseTheme";
import { IconPresentationProps } from "@insite/mobius/Icon";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import { HasDisablerContext, withDisabler } from "@insite/mobius/utilities/DisablerContext";
import get from "@insite/mobius/utilities/get";
import getProp from "@insite/mobius/utilities/getProp";
import InjectableCss, { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import omitMultiple from "@insite/mobius/utilities/omitMultiple";
import uniqueId from "@insite/mobius/utilities/uniqueId";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import * as React from "react";
import { Transition } from "react-transition-group";
import { TransitionStatus } from "react-transition-group/Transition";
import styled, { AnyStyledComponent, css, ThemeConsumer } from "styled-components";

export interface FileUploadPresentationProps
    extends Omit<FormFieldPresentationProps<FileUploadComponentProps>, "cssOverrides"> {
    /** Props to be passed into the file upload's Button component.
     * @themable */
    buttonProps?: ButtonPresentationProps;
    /** Props to be passed into the input's Icon component.
     * @themable */
    iconProps?: IconPresentationProps;
    /** Props to be passed into the clearIcon component.
     * @themable */
    clearIconProps?: IconPresentationProps;
    /** Length of fade in and fade out transition on file name appearance.
     * @themable */
    transitionLength?: keyof ThemeTransitionDuration;
    /** CSS strings or styled-components functions to be injected into nested components. These will override the theme defaults.
     * @themable */
    cssOverrides?: FormFieldPresentationProps<FileUploadComponentProps>["cssOverrides"] & {
        appearanceTransition?: StyledProp<any>;
    };
}

type FileUploadComponentProps = MobiusStyledComponentProps<
    "input",
    {
        /** Button text to be displayed on the button */
        buttonText?: string;
        /** Disables the file input and button if present. */
        disabled?: boolean;
        /** Error message to be displayed below the input. */
        error?: React.ReactNode;
        /** Do not display a button. */
        hideButton?: boolean;
        /** Hint text to be displayed below the input. */
        hint?: React.ReactNode;
        /**
         * Unique id to be passed into the input element.
         * If not provided, a random id is assigned (an id is required for accessibility purposes).
         */
        uid?: string | number;
        /** React reference used to display and reference the file input element. */
        inputRef?: React.RefObject<HTMLInputElement> | React.MutableRefObject<HTMLInputElement>;
        /** Label text to be displayed above the input. */
        label?: React.ReactNode;
        /** Function that will be executed after the file is changed. */
        onFileChange?: React.ChangeEventHandler<AnyStyledComponent>;
        /** Placeholder text to be shown when the input is empty. */
        placeholder?: string;
        /** Adds an asterisk to the input's label (if provided). */
        required?: boolean;
        /** If handling the file external to the upload component, provide the file name here. */
        fileName?: string;
    } & Partial<FormFieldComponentProps>
>;

export type FileUploadProps = FileUploadPresentationProps & FileUploadComponentProps;

interface FileUploadState {
    fileName: string;
}

const AppearanceTransition = styled.div<{
    transitionState?: TransitionStatus;
    transitionLength?: keyof ThemeTransitionDuration;
    css?: InjectableCss;
}>`
    transition: opacity ease-in-out ${getProp("transitionLength", 200)}ms;
    ${({ transitionState }) => {
        switch (transitionState) {
            case "entering":
                return "opacity: 0;";
            case "entered":
                return "opacity: 1;";
            case "exiting":
            case "exited":
                return "opacity: 0;";
            default:
                return "";
        }
    }}
    ${injectCss}
`;

const FileUploadStyle = styled.div<{ sizeValues: VariantValues; border: "underline" | "rectangle" | "rounded" }>`
    position: relative;
    cursor: pointer;
    &:focus-within,
    &:focus {
        ${AppearanceTransition} {
            ${({ border }) => border !== "underline" && "margin-top: -1px;"}
        }
        ${FormFieldClickable} {
            ${({ border }) => border !== "underline" && "margin-top: -1px;"}
            /* stylelint-disable declaration-colon-newline-after */
            right: ${({ border, sizeValues }) => {
                return sizeValues.icon + 2 * (sizeValues.iconPadding - 2) - (border !== "underline" ? 1 : 0);
            }}px;
            /* stylelint-enable */
        }
    }
    ${injectCss}
`;

const UploadFunctionality = styled.input`
    cursor: pointer;
    position: absolute;
    opacity: 0;
    && {
        /* specificity override */
        padding: 0;
        border: none;
        background: none;
    }
`;

const UploadAppearance = styled.input`
    &&&& {
        /* specificity override */
        padding: 0 60px 0 0;
        border: none;
        background: none;
        width: 100%;
    }
`;

const UploadWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

const ButtonWrapper = styled.div``;

const uploadOmitProps = ["onFileChange", "size", "border", "label", "backgroundColor"] as (keyof Omit<
    FileUploadProps,
    | "buttonText"
    | "disabled"
    | "disable"
    | "error"
    | "hideButton"
    | "hint"
    | "iconProps"
    | "uid"
    | "label"
    | "labelPosition"
    | "placeholder"
    | "required"
>)[];
const formFieldOmitProps = ["domId", "onFileChange", "labelProps"] as (keyof Omit<
    FileUploadProps,
    | "buttonText"
    | "disabled"
    | "disable"
    | "error"
    | "hideButton"
    | "hint"
    | "iconProps"
    | "uid"
    | "label"
    | "labelPosition"
    | "placeholder"
    | "required"
>)[];

/**
 * An input that accepts a file type to upload. File upload must be handled via the onFileChange callback and/or form submission.
 */
class FileUpload extends React.Component<FileUploadProps & HasDisablerContext, FileUploadState> {
    static defaultButtonText = "Choose file";
    static defaultProps = {
        buttonText: FileUpload.defaultButtonText,
    };

    fileInput = this.props.inputRef || React.createRef();

    UNSAFE_componentWillReceiveProps(nextProps: FileUploadProps) {
        // eslint-disable-line camelcase
        if (nextProps.fileName !== this.props.fileName) {
            const nextFileName = nextProps.fileName ?? "";
            this.setState({ fileName: nextFileName });
        }
    }

    state = {
        fileName: this.props.fileName || "",
    };

    handleFiles = (event: React.ChangeEvent<any>) => {
        if (event?.target.files[0]) {
            this.setState({ fileName: event?.target.files[0]?.name });
            this.props.onFileChange && this.props.onFileChange(event);
        }
    };

    removeFile = () => {
        if (this.fileInput.current?.value) {
            this.fileInput.current.value = "";
        }
        this.props.onFileChange && this.props.onFileChange({ target: { files: [null] } } as React.ChangeEvent<any>);
        this.setState({ fileName: "" });
    };

    render() {
        return (
            <ThemeConsumer>
                {(theme?: BaseTheme) => {
                    const {
                        buttonText,
                        disable,
                        disabled,
                        error,
                        hideButton,
                        hint,
                        iconProps,
                        uid,
                        label,
                        labelPosition,
                        placeholder,
                        required,
                        ...otherProps
                    } = this.props;
                    const { applyProp, spreadProps } = applyPropBuilder(
                        { ...otherProps, theme, iconProps },
                        { component: "fileUpload", category: "formField" },
                    );

                    // Because disabled html attribute doesn't accept undefined
                    // eslint-disable-next-line no-unneeded-ternary
                    const isDisabled = disable || disabled ? true : false;
                    const { css: buttonCss, ...otherButtonProps } = spreadProps("buttonProps");
                    const labelProps = spreadProps("labelProps");
                    labelProps.forwardAs = "span";
                    const { inputSelect, formInputWrapper, appearanceTransition, ..._cssOverrides } =
                        spreadProps("cssOverrides");
                    const sizeVariant: FormFieldSizeVariant = applyProp("sizeVariant", "default");
                    const sizeValues = sizeVariantValues[sizeVariant];

                    const inputId = uid?.toString() || uniqueId();
                    const labelId = `${inputId}-label`;
                    const inputLabelObj = label === 0 || label ? { "aria-labelledby": labelId } : {};
                    const descriptionId = `${inputId}-description`;
                    const hasDescription = !!error || !!hint;
                    const transitionLength = get(otherProps.theme, "transition.duration.short") || 200;

                    const input = (
                        <>
                            <FileUploadStyle
                                className="mobiusFileUpload"
                                sizeValues={sizeValues}
                                border={applyProp("border")}
                            >
                                <UploadFunctionality
                                    id={inputId}
                                    type="file"
                                    ref={this.fileInput}
                                    aria-describedby={hasDescription ? descriptionId : undefined}
                                    aria-invalid={!!error}
                                    aria-required={!isDisabled && required}
                                    onChange={this.handleFiles}
                                    data-id="functionalInput"
                                    {...{ disabled: isDisabled, required }}
                                    {...inputLabelObj}
                                    {...omitMultiple(otherProps, uploadOmitProps)}
                                />
                                <Transition
                                    mountOnEnter
                                    unmountOnExit
                                    in={!!this.state.fileName}
                                    timeout={{
                                        enter: 200,
                                        exit: 200,
                                    }}
                                >
                                    {state => (
                                        <AppearanceTransition
                                            transitionState={state}
                                            transitionLength={transitionLength}
                                            css={appearanceTransition}
                                        >
                                            <UploadAppearance
                                                className="mobiusFileVisual"
                                                value={this.state.fileName}
                                                placeholder={this.props.placeholder}
                                                readOnly
                                                tabIndex={-1}
                                                data-id="visualInput"
                                            />
                                            <FormFieldClickable onClick={this.removeFile}>
                                                <FormFieldIcon
                                                    size={sizeValues.icon}
                                                    {...spreadProps("clearIconProps")}
                                                />
                                                <VisuallyHidden>{theme?.translate("remove file")}</VisuallyHidden>
                                            </FormFieldClickable>
                                        </AppearanceTransition>
                                    )}
                                </Transition>
                            </FileUploadStyle>
                            <FormFieldIcon
                                size={sizeValues.icon}
                                color={isDisabled ? "text.disabled" : "text.main"}
                                {...spreadProps("iconProps")}
                            />
                        </>
                    );
                    return (
                        <UploadWrapper>
                            <FormField
                                descriptionId={descriptionId}
                                formInput={input}
                                labelId={labelId}
                                inputId={inputId}
                                cssOverrides={{
                                    ..._cssOverrides,
                                    inputSelect: css`
                                        padding-right: ${sizeValues.height}px;
                                        ${inputSelect}
                                    `,
                                    formInputWrapper: css`
                                        ${FormFieldClickable as any} {
                                            top: -1px;
                                            right: ${sizeValues.icon + 2 * (sizeValues.iconPadding - 2)}px;
                                        }
                                        ${formInputWrapper}
                                    `,
                                }}
                                labelProps={labelProps}
                                {...omitMultiple(this.props, formFieldOmitProps)}
                            />
                            {hideButton ? null : (
                                <ButtonWrapper>
                                    <Button
                                        sizeVariant={sizeValues.button}
                                        htmlFor={inputId}
                                        forwardAs={isDisabled ? "button" : "label"}
                                        css={css`
                                            white-space: noWrap;
                                            display: inline-block;
                                            box-sizing: border-box;
                                            line-height: ${sizeValues.height - 3}px;
                                            margin: ${label && labelPosition !== "left" ? sizeValues.labelHeight : 0}px
                                                0 0 15px;
                                            ${buttonCss}
                                        `}
                                        disabled={isDisabled}
                                        {...otherButtonProps}
                                    >
                                        {buttonText && FileUpload.defaultButtonText === buttonText
                                            ? theme?.translate(buttonText)
                                            : buttonText}
                                    </Button>
                                </ButtonWrapper>
                            )}
                        </UploadWrapper>
                    );
                }}
            </ThemeConsumer>
        );
    }
}

/** @component */
export default withDisabler(FileUpload);
