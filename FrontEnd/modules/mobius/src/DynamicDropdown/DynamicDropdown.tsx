/* eslint-disable no-unused-expressions */
import filter from "@insite/mobius/DynamicDropdown/filter";
import FormField, {
    FormFieldComponentProps,
    FormFieldIcon,
    FormFieldPresentationProps,
    FormFieldSizeVariant,
} from "@insite/mobius/FormField";
import { sizeVariantValues } from "@insite/mobius/FormField/formStyles";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { IconPresentationProps } from "@insite/mobius/Icon";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Popover, { ContentBodyProps, OverflowWrapperProps } from "@insite/mobius/Popover";
import Typography from "@insite/mobius/Typography";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import { HasDisablerContext, withDisabler } from "@insite/mobius/utilities/DisablerContext";
import get from "@insite/mobius/utilities/get";
import getColor from "@insite/mobius/utilities/getColor";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import { MobiusStyledComponentPropsWithRef } from "@insite/mobius/utilities/MobiusStyledComponentProps";
import safeColor from "@insite/mobius/utilities/safeColor";
import uniqueId from "@insite/mobius/utilities/uniqueId";
import VisuallyHidden from "@insite/mobius/VisuallyHidden/VisuallyHidden";
import * as React from "react";
import styled, { css, ThemeProps, withTheme } from "styled-components";

export interface DynamicDropdownPresentationProps
    extends Omit<FormFieldPresentationProps<DynamicDropdownComponentProps>, "cssOverrides"> {
    /** CSS strings or styled-components functions to be injected into nested components. These will override the theme defaults.
     * @themable */
    cssOverrides?: FormFieldPresentationProps<DynamicDropdownComponentProps>["cssOverrides"] & {
        dropdownWrapper?: StyledProp<DynamicDropdownComponentProps>;
        list?: StyledProp<ContentBodyProps>;
        /** Specific style options for loading row, if not provided, falls back on 'option'. */
        loading?: StyledProp<DynamicDropdownComponentProps>;
        /** Specific style options for moreOption row, if not provided, falls back on 'option'. */
        moreOption?: StyledProp<DynamicDropdownComponentProps>;
        /** Specific style options for noOptions row, if not provided, falls back on 'option'. */
        noOptions?: StyledProp<DynamicDropdownComponentProps>;
        option?: StyledProp<DynamicDropdownComponentProps>;
        selectedText?: StyledProp<DynamicDropdownComponentProps>;
    };
    /** Props to be passed into the inner Icon component.
     * @themable */
    iconProps?: IconPresentationProps;
    /**
     * Indicates how the `css` property is combined with the variant `css` property from the theme.
     * If true, the variant css is applied first and then the component css is applied after causing
     * a merge, much like normal CSS. If false, only the component css is applied, overriding the variant css in the theme.
     */
    mergeCss?: boolean;
    /** Text for empty input field.
     * @themable */
    placeholder?: string;
    /** Props to be passed into the inner LoadingSpinner component when loading.
     * @themable */
    spinnerProps?: LoadingSpinnerProps;
    /** Background color of the form element */
    backgroundColor?: string;
}

export interface OptionObject {
    optionValue?: string;
    optionText: string;
    searchString?: string;
    rowChildren?: React.ReactNode;
    disabled?: boolean;
}

interface DynamicDropdownComponentProps extends Partial<FormFieldComponentProps> {
    /** Flag to indicate whether data is loading on the component. */
    isLoading?: boolean;
    /** Error message to be displayed below the dropdown box. */
    error?: React.ReactNode;
    /** Hint text to be displayed below the dropdown box. */
    hint?: React.ReactNode;
    /** Function in the following format to be used to filter the options in the dropdown.
     * @param {object} option An object describing the option.
     * @param {string} option.value The value of the menu item.
     * @param {string} [option.data] Any additional string data to be searched by the dynamic dropdown.
     * @param {string} rawInput The string being searched for within the option.
     * @return {boolean} Whether the option includes the rawInput.
     */
    filterOption?: typeof filter;
    /**
     * Unique id to be passed into the `<input>` element.
     * If not provided, a random id is assigned (an id is required for accessibility purposes).
     */
    uid?: string;
    /** Label to be displayed above the input. */
    label?: React.ReactNode;
    /** Adds an asterisk to the input's label (if provided). Additionally, governs whether an error if a disabled option is selected */
    required?: boolean;
    /** An optional final list item for the dynamic dropdown. If only a subset of options is displayed on load, this component
     * can be used to indicate 'search for more options' or can contain a link, etcetera, to provide further functionality. */
    moreOption?: React.ReactNode;
    /** Function that will be called after the dropdown is closed. */
    onClose?: (event?: React.MouseEvent | React.KeyboardEvent | Event) => void;
    /** A callback function that will be called when the typed input is changed */
    onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    /** Function that will be called after the dropdown is opened. */
    onOpen?: (event?: React.MouseEvent | React.KeyboardEvent | Event) => void;
    /** Function that will be called when the selected item is changed. */
    onSelectionChange?: (value?: string) => void;
    /** An array of objects describing the options available in the dropdown. */
    options: OptionObject[];
    /** Value of the selected option */
    selected?: string;
    /** A callback function that will be called when any key is pressed */
    onKeyPress?: (event: React.KeyboardEvent) => void;
    /** If the user has not typed anything into the field to search, and there are no options, this lets you hide the "no options" item */
    hideNoOptionsIfEmptySearch?: boolean;
}

interface DynamicDropdownState {
    isOpen: boolean;
    focusable: OptionObject[];
    renderOptions?: JSX.Element[];
    focusedOption?: OptionObject;
    uid: string;
    selected?: string;
    typedInput: string;
}

type OptionProps = MobiusStyledComponentPropsWithRef<
    "div",
    { ref?: React.RefObject<HTMLDivElement> },
    {
        _sizeVariant: FormFieldSizeVariant;
        focused?: boolean;
        disabled?: boolean;
        selected?: boolean;
        noHover?: boolean;
        css?: StyledProp<any>;
        key: string;
        value: string;
        uid?: string;
        onClick?: (value: string) => void;
        "aria-selected"?: boolean;
    }
>;

export type DynamicDropdownProps = DynamicDropdownPresentationProps &
    DynamicDropdownComponentProps &
    ThemeProps<BaseTheme>;

const ESC_KEY = 27;
const DOWN_KEY = 40;
const UP_KEY = 38;
const TAB_KEY = 9;
const ENTER_KEY = 13;

const scrollTo = (el: HTMLElement, top: number) => {
    // eslint-disable-next-line no-param-reassign
    el.scrollTop = top;
};

const Option = styled.div<OptionProps>`
    padding: ${({ _sizeVariant }) => (_sizeVariant === "small" ? "5px 0 5px 11px" : "9px 0 9px 11px")};
    font-size: ${({ _sizeVariant }) => sizeVariantValues[_sizeVariant].fontSize}px;
    ${({ focused, disabled, selected, theme, noHover }) => {
        let background = get(theme, "colors.common.background");
        let text = get(theme, "colors.common.backgroundContrast");
        const primary = get(theme, "colors.primary.main");
        const hover = safeColor(primary).rgb().fade(0.8).string();
        if (disabled) {
            background = get(theme, "colors.common.accent");
            text = get(theme, "colors.text.disabled");
        } else if (selected) {
            background = primary;
            text = get(theme, "colors.primary.contrast");
        } else if (focused) {
            background = hover;
        }
        return css`
            background: ${background};
            color: ${text};
            ${!disabled &&
            !noHover &&
            css`
                &:hover {
                    background: ${hover};
                    color: ${get(theme, "colors.common.backgroundContrast")};
                }
            `}
            ${disabled ? "cursor: not-allowed;" : "cursor: pointer;"}
        `;
    }}
    transition: all 0.3s ease-in-out;
    ${injectCss}
`;

type SizeVariant = { _sizeVariant: "small" | "default" };

const SelectedText = styled(Typography as any)<SizeVariant>`
    pointer-events: none;
    position: absolute;
    padding: ${({ _sizeVariant }) => (_sizeVariant === "small" ? "5px 0 5px 11px" : "9px 0 9px 11px")};
    top: 0;
    left: 0;
    white-space: nowrap;
    overflow: hidden;
    width: calc(100% - 32px);
    text-overflow: ellipsis;
    ${injectCss}
`;

const PopoverTriggerInput = styled.input`
    &&&& {
        padding-right: 30px;
    }
    ${injectCss}
`;

const listCssBuilder = (
    additionalCss: StyledProp<ContentBodyProps>,
    sizeVariant: FormFieldSizeVariant,
) => css<ContentBodyProps>`
    background: ${getColor("common.background")};
    border: 1px solid ${getColor("common.border")};
    padding-left: 0;
    top: ${sizeVariantValues[sizeVariant].height - 1}px;
    width: calc(100% - 2px);
    margin-bottom: 15px;
    ${additionalCss as any}
`;

/**
 * A searchable dropdown.
 */
class DynamicDropdown extends React.Component<DynamicDropdownProps & HasDisablerContext, DynamicDropdownState> {
    private spreadProps: Function;
    private applyStyledProp: Function;
    private sizeVariant: FormFieldSizeVariant;

    static defaultPlaceholder = "Type to search";
    static defaultProps: Partial<DynamicDropdownProps> = {
        isLoading: false,
        filterOption: filter,
        placeholder: DynamicDropdown.defaultPlaceholder,
    };

    constructor(props: DynamicDropdownProps & HasDisablerContext) {
        super(props);
        const { applyProp, spreadProps, applyStyledProp } = applyPropBuilder(props, {
            component: "dynamicDropdown",
            category: "formField",
        });
        this.applyStyledProp = applyStyledProp;
        this.spreadProps = spreadProps;
        this.sizeVariant = applyProp("sizeVariant", "default");
        this.state = {
            isOpen: false,
            focusable: props.isLoading ? [] : props.options,
            focusedOption: undefined,
            uid: props.uid || uniqueId(),
            selected: props.selected || undefined,
            typedInput: "",
        };
    }

    input = React.createRef<HTMLElement>();

    list = React.createRef<HTMLUListElement>();

    focused = React.createRef<HTMLDivElement>();

    popover = React.createRef<typeof Popover>();

    UNSAFE_componentWillReceiveProps(nextProps: DynamicDropdownProps) {
        // eslint-disable-line camelcase
        if (nextProps.selected !== this.props.selected) {
            this.setState({ selected: nextProps.selected });
        }
        if (nextProps.options !== this.props.options) {
            this.setState({ focusable: nextProps.options }, this.buildMenuOptions);
        }
    }

    componentDidMount() {
        this.buildMenuOptions();
    }

    componentDidUpdate() {
        this.scrollItemIntoView();
    }

    buildMenuOptions = () => {
        if (!this.props.isLoading) {
            this.setState(prevState =>
                this.props.options.reduce<{ focusable: OptionObject[]; renderOptions: JSX.Element[] }>(
                    (menuState, option) => {
                        const { disabled, optionText } = option;
                        const optionValue = option.optionValue || optionText;
                        const searchString = option.searchString || optionText;
                        const resolvedMergeCss =
                            this.props.mergeCss ?? this.props?.theme?.dynamicDropdown?.defaultProps?.mergeCss;

                        if (
                            this.props.filterOption &&
                            !this.props.filterOption({ searchString, optionText }, prevState.typedInput)
                        ) {
                            return menuState;
                        }

                        const isFocused = prevState.focusedOption === option;
                        const selected = prevState.selected === optionValue;
                        const newProps: OptionProps = {
                            key: optionValue,
                            uid: `${prevState.uid}-${optionText}`,
                            disabled,
                            focused: isFocused,
                            selected,
                            value: optionValue,
                            _sizeVariant: this.sizeVariant,
                            css: this.applyStyledProp(["cssOverrides", "option"], resolvedMergeCss),
                            onClick: disabled ? undefined : () => this.clickToSelect(optionValue),
                        };
                        if (isFocused) {
                            newProps.ref = this.focused;
                        }
                        if (selected) {
                            newProps["aria-selected"] = true;
                        }

                        menuState.focusable.push(option);
                        menuState.renderOptions.push(<Option {...newProps}>{option.rowChildren || optionText}</Option>);

                        return menuState;
                    },
                    { focusable: [], renderOptions: [] },
                ),
            );
        }
    };

    controlInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        !this.state.isOpen && this.openDropdown(undefined, true);
        this.props.onInputChange && this.props.onInputChange(event);
        this.setState({ typedInput: event.target.value }, this.buildMenuOptions);
    };

    clickToSelect = (value?: string) => {
        this.setState({ selected: value, typedInput: "" }, () => {
            this.closeDropdown(undefined, true);
            this.props.onSelectionChange && this.props.onSelectionChange(value);
            this.buildMenuOptions();
        });
    };

    closeDropdown = (event?: Event, callParentClose = false) => {
        callParentClose && this.popover.current && (this.popover.current! as any).closePopover();
        this.setState({ isOpen: false }, () => {
            this.props.onClose && this.props.onClose(event);
        });
    };

    handleKeyDown = (event: KeyboardEvent) => {
        if (!this.input.current?.contains(event.target as Node)) {
            this.closeDropdown(event);
            return;
        }
        event.stopPropagation();
        switch (event.keyCode) {
            case DOWN_KEY:
                this.moveFocus("next");
                break;
            case UP_KEY:
                this.moveFocus("prior");
                break;
            case TAB_KEY:
                this.handleImplicitSelection("tab");
                break;
            case ENTER_KEY:
                this.handleImplicitSelection("enter");
                break;
            case ESC_KEY:
                // being handled in the popover;
                break;
            default:
                break;
        }
    };

    handleImplicitSelection = (eventType: "tab" | "enter") => {
        this.setState(
            ({ focusable, focusedOption, typedInput, selected }) => {
                const newState = { selected, typedInput: "" };
                let exactMatch = null;
                if (focusable.length > 1 && typedInput !== "") {
                    exactMatch = focusable.find(option => option.optionText === typedInput);
                }

                if (focusedOption && eventType === "enter") {
                    newState.selected = focusedOption.optionValue || focusedOption.optionText;
                } else if (!selected && focusable.length === 1 && !focusable[0].disabled) {
                    // eslint-disable-next-line prefer-destructuring
                    newState.selected = focusable[0].optionValue || focusable[0].optionText;
                } else if (exactMatch && !exactMatch.disabled) {
                    newState.selected = exactMatch.optionValue || exactMatch.optionText;
                }

                if (this.props.onSelectionChange && newState.selected !== selected) {
                    this.props.onSelectionChange(newState.selected);
                }
                return newState;
            },
            () => {
                this.closeDropdown(undefined, true);
                this.buildMenuOptions();
            },
        );
    };

    moveFocus = (direction: "prior" | "next") => {
        !this.state.isOpen && this.openDropdown(undefined, true);
        this.setState(({ focusedOption, focusable }) => {
            const focusableQueue = direction === "prior" ? focusable.reverse() : focusable;
            const focusedIndex = focusableQueue.indexOf(focusedOption as OptionObject);
            const newFocusedOption =
                focusableQueue.find((option, index) => index > focusedIndex && !option.disabled) || focusableQueue[0];
            return { focusedOption: newFocusedOption };
        }, this.buildMenuOptions);
    };

    openDropdown = (event?: Event, callParentOpen = false) => {
        callParentOpen && this.popover.current && (this.popover.current! as any).openPopover();
        this.setState(
            ({ focusable, selected }) => {
                const newState: Pick<DynamicDropdownState, "isOpen" | "focusedOption"> = { isOpen: true };
                // eslint-disable-next-line arrow-body-style
                selected &&
                    (newState.focusedOption = focusable.find(({ optionText, optionValue }) => {
                        return optionValue ? optionValue === selected : optionText === selected;
                    }));
                return newState;
            },
            () => {
                this.props.onOpen && this.props.onOpen(event);
                this.buildMenuOptions();
                this.scrollListIntoView();
            },
        );
    };

    scrollItemIntoView = () => {
        // Scroll logic cribbed primarily from https://github.com/JedWatson/react-select/blob/master/packages/react-select/src/utils.js#L190;
        const menuEl: HTMLElement | null = this.list.current;
        const itemEl: HTMLElement | null = this.focused.current;
        if (menuEl && itemEl) {
            const menuRect = menuEl.getBoundingClientRect();
            const focusedRect = itemEl.getBoundingClientRect();
            const overScroll = itemEl.offsetHeight / 3;

            if (focusedRect.bottom + overScroll > menuRect.bottom) {
                // going down
                scrollTo(
                    menuEl,
                    Math.min(
                        itemEl.offsetTop + itemEl.clientHeight - menuEl.offsetHeight + overScroll,
                        menuEl.scrollHeight,
                    ),
                );
            } else if (menuEl && focusedRect.top - overScroll < menuRect.top) {
                // going up
                scrollTo(menuEl, Math.max(itemEl.offsetTop - overScroll, 0));
            }
        }
    };

    scrollListIntoView = () => {
        const bottomOfInput = this.input.current?.getBoundingClientRect().bottom || 0;
        const windowHeight = window.innerHeight;
        if (bottomOfInput + 250 > windowHeight) {
            const rowHeight = sizeVariantValues[this.sizeVariant].height;
            const heightOfRows = (this.state.focusable.length + 0.5 + (this.props.moreOption ? 1 : 0)) * rowHeight;
            const listHeight = heightOfRows > 250 ? 250 : heightOfRows;
            window.scrollTo({
                top: bottomOfInput + listHeight + 10 - windowHeight + window.pageYOffset,
                behavior: "smooth",
            });
        }
    };

    render = () => {
        const {
            disable,
            disabled,
            error,
            filterOption,
            hint,
            isLoading,
            moreOption,
            onKeyPress,
            options,
            placeholder,
            sizeVariant,
            theme,
            hideNoOptionsIfEmptySearch,
            backgroundColor,
            ...otherProps
        } = this.props;
        const { isOpen, focusedOption, uid, typedInput, renderOptions, selected } = this.state;

        const _cssOverrides = this.spreadProps("cssOverrides");

        // Because disabled html attribute doesn't accept undefined
        // eslint-disable-next-line no-unneeded-ternary
        const isDisabled = disable || disabled ? true : false;
        const listboxId = `${uid}-listbox`;
        const descriptionId = `${uid}-description`;
        const labelId = `${uid}-label`;
        const inputLabelObj = otherProps.label === 0 || otherProps.label ? { "aria-labelledby": labelId } : {};
        const hasDescription = error || hint;
        const resolvedMergeCss = this.props.mergeCss ?? this.props?.theme?.dynamicDropdown?.defaultProps?.mergeCss;

        let renderList: JSX.Element[] = [
            <Option
                css={
                    this.applyStyledProp(["cssOverrides", "noOptions"], resolvedMergeCss) ||
                    this.applyStyledProp(["cssOverrides", "option"], resolvedMergeCss)
                }
                noHover
                _sizeVariant={this.sizeVariant}
                data-id="no-options"
                key="no-options"
                value="no-options"
            >
                {theme.translate("No Options")}
            </Option>,
        ];
        if (isLoading) {
            renderList = [
                <Option
                    css={
                        this.applyStyledProp(["cssOverrides", "loading"], resolvedMergeCss) ||
                        this.applyStyledProp(["cssOverrides", "option"], resolvedMergeCss)
                    }
                    noHover
                    _sizeVariant={this.sizeVariant}
                    key="loading"
                    value="loading"
                >
                    <LoadingSpinner
                        size={sizeVariantValues[this.sizeVariant].icon}
                        color="text.disabled"
                        {...this.spreadProps("spinnerProps")}
                    />
                </Option>,
            ];
        } else if (renderOptions && renderOptions.length > 0) {
            renderList = renderOptions;
        } else if (!typedInput && hideNoOptionsIfEmptySearch) {
            renderList = [];
        }

        let selectedString;
        if (!typedInput && selected) {
            /* eslint-disable */
            selectedString = options.find((option: OptionObject) => {
                return option.optionValue ? option.optionValue === selected : option.optionText === selected;
            })?.optionText;
            /* eslint-enable */
        }

        const popoverTrigger = (
            <PopoverTriggerInput
                id={uid}
                type="text"
                role="searchbox"
                aria-autocomplete="list"
                autoComplete="no"
                aria-activedescendant={focusedOption && `${uid}-${focusedOption.optionText}`}
                aria-describedby={hasDescription ? descriptionId : undefined}
                aria-labelledby={labelId}
                onChange={this.controlInput}
                onKeyPress={onKeyPress}
                value={typedInput}
                placeholder={
                    selected
                        ? ""
                        : placeholder && DynamicDropdown.defaultPlaceholder === placeholder
                        ? theme.translate(placeholder)
                        : placeholder
                }
                disabled={isDisabled}
                data-test-selector={`${(otherProps as any)["data-test-selector"]}-input`}
                {...inputLabelObj}
            />
        );

        const triggerSiblings = (
            <>
                {typedInput ? null : (
                    <SelectedText
                        _sizeVariant={this.sizeVariant}
                        css={this.applyStyledProp(["cssOverrides", "selectedText"], resolvedMergeCss)}
                        data-test-selector={`${(otherProps as any)["data-test-selector"]}-selectedText`}
                    >
                        {selectedString}
                    </SelectedText>
                )}
                <VisuallyHidden>
                    {isOpen ? theme.translate("hide options") : theme.translate("show options")}
                </VisuallyHidden>
                <FormFieldIcon {...this.spreadProps("iconProps")} />
            </>
        );

        const comboBox = (
            <Popover
                ref={this.popover as any}
                controlsId={listboxId}
                onOpen={this.openDropdown}
                onClose={this.closeDropdown}
                handleKeyDown={this.handleKeyDown}
                popoverTrigger={popoverTrigger}
                triggerSiblings={triggerSiblings}
                transitionDuration="short"
                xPosition="start"
                zIndexKey="dynamicDropdown"
                shadowDepth={1}
                insideRefs={[this.list, this.input]}
                wrapperProps={
                    {
                        as: "div",
                        role: "combobox",
                        "aria-owns": uid,
                        "aria-haspopup": "listbox",
                        "aria-expanded": isOpen,
                        css: this.applyStyledProp(["cssOverrides", "dropdownWrapper"], resolvedMergeCss),
                        ref: this.input,
                        _width: "unset",
                        _height: "unset",
                    } as OverflowWrapperProps
                }
                contentBodyProps={
                    {
                        ref: this.list,
                        id: listboxId,
                        role: "listbox",
                        "aria-labelledby": labelId,
                        css: listCssBuilder(
                            this.applyStyledProp(["cssOverrides", "list"], resolvedMergeCss),
                            this.sizeVariant,
                        ) as any,
                        width: 400,
                    } as ContentBodyProps
                }
                data-test-selector={`${(otherProps as any)["data-test-selector"]}-listbox`}
            >
                {renderList}
                {!isLoading && moreOption ? (
                    <Option
                        key="more"
                        css={
                            this.applyStyledProp(["cssOverrides", "moreOption"], resolvedMergeCss) ||
                            this.applyStyledProp(["cssOverrides", "option"], resolvedMergeCss)
                        }
                        noHover
                        _sizeVariant={this.sizeVariant}
                        value="more options"
                    >
                        {moreOption}
                    </Option>
                ) : null}
            </Popover>
        );
        return (
            <FormField
                formInput={comboBox}
                inputId={uid}
                labelId={labelId}
                descriptionId={descriptionId}
                cssOverrides={_cssOverrides}
                sizeVariant={this.sizeVariant}
                error={error}
                backgroundColor={backgroundColor}
                {...otherProps}
            />
        );
    };
}

/** @component */
export default withDisabler(withTheme(DynamicDropdown));

export { Option };
