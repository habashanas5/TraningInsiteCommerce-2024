import AccordionContext from "@insite/mobius/Accordion/AccordionContext";
import AccordionSectionHeader, {
    AccordionSectionHeaderProps,
} from "@insite/mobius/AccordionSection/AccordionSectionHeader";
import AccordionSectionPanel, {
    AccordionSectionPanelProps,
} from "@insite/mobius/AccordionSection/AccordionSectionPanel";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { IconMemo, IconPresentationProps, IconProps, IconWrapperProps } from "@insite/mobius/Icon";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import uniqueId from "@insite/mobius/utilities/uniqueId";
import * as React from "react";
import { Transition } from "react-transition-group";
import { TransitionStatus } from "react-transition-group/Transition";
import styled, { ThemeProps, withTheme } from "styled-components";

export interface AccordionSectionPresentationProps {
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp<AccordionSectionProps>;
    /** Props to be passed to the inner AccordionSectionHeader component.
     * @themable */
    headerProps?: AccordionSectionHeaderProps;
    /** Props to be passed to the inner AccordionSectionPanel component.
     * @themable */
    panelProps?: AccordionSectionPanelProps;
    /** Props that will be passed to the typography title component if the Title is a string.
     * @themable */
    titleTypographyProps?: TypographyPresentationProps;
    /** Props that will be passed to the toggle icon. Used for icon size, and other props to be used for both icons.
     * Source used if `collapseIconProps` or `expandIconProps` is not provided.
     * @themable */
    toggleIconProps?: IconPresentationProps;
    /**
     * Indicates how the `css` property is combined with the variant `css` property from the theme.
     * If true, the variant css is applied first and then the component css is applied after causing
     * a merge, much like normal CSS. If false, only the component css is applied, overriding the variant css in the theme.
     */
    mergeCss?: boolean;
    /** Props that will be passed to the toggle icon when the accordion is open.
     * @themable */
    collapseIconProps?: IconPresentationProps;
    /** Props that will be passed to the toggle icon when the accordion is closed.
     * @themable */
    expandIconProps?: IconPresentationProps;
    /** Attributes of the toggle transition.
     * @themable */
    toggleTransition?: {
        positionerCss?: StyledProp<IconWrapperProps>;
        transitionCss?: StyledProp<{ transitionState: TransitionStatus }>;
        timeout?: TimeoutProp;
    };
}

interface TimeoutProp {
    enter: number;
    exit: number;
}

export interface AccordionSectionComponentProps {
    /** Props to be passed to the inner AccordionSectionHeader component. */
    headerProps?: AccordionSectionHeaderProps;
    /** Controls expanded state of the section. */
    expanded?: boolean;
    /** Aria attributes used internally require an `id`. If not provided, a random id is generated. */
    uid?: string;
    /** The content to be displayed as the title of the section. */
    title: React.ReactNode;
    /** Function that will be called when the component is toggled. */
    onTogglePanel?: (expanded: boolean) => void;
}

const IconPositioner = styled.span<IconWrapperProps>`
    padding-left: 15px;
    height: ${({ _height, _size }) => _height || _size}px;
    width: ${({ _width, _size }) => _width || _size}px;
    max-height: ${({ _height, _size }) => _height || _size}px;
    max-width: ${({ _width, _size }) => _width || _size}px;
    position: relative;
    ${injectCss}
`;

export interface AccordionSectionProps
    extends AccordionSectionComponentProps,
        Omit<AccordionSectionPresentationProps, "headerProps"> {}

type State = Pick<AccordionSectionProps, "expanded" | "uid">;
type Props = AccordionSectionProps & ThemeProps<BaseTheme>;

class AccordionSection extends React.Component<Props, State> {
    state: State = {};

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        let expanded: boolean | undefined = prevState.expanded || false;
        if ("expanded" in nextProps && prevState.expanded !== nextProps.expanded) {
            expanded = nextProps.expanded; // eslint-disable-line prefer-destructuring
        }
        return {
            expanded,
            uid: nextProps.uid || (prevState && prevState.uid) || uniqueId(),
        };
    }

    togglePanel = () => {
        this.setState(
            ({ expanded }) => {
                return { expanded: !expanded };
            },
            () => {
                if (this.props.onTogglePanel) {
                    this.props.onTogglePanel(this.state.expanded ?? false);
                }
            },
        );
    };

    render() {
        const { children, title, mergeCss } = this.props;
        const { spreadProps, applyStyledProp } = applyPropBuilder(this.props, {
            component: "accordion",
            propKey: "sectionDefaultProps",
        });
        const toggleIconProps = spreadProps("toggleIconProps");
        const collapseIconProps = spreadProps("collapseIconProps");
        const expandIconProps = spreadProps("expandIconProps");
        const toggleTransition = spreadProps("toggleTransition");
        const usesSingleIcon = !collapseIconProps.src && !expandIconProps.src;
        const { expanded, uid } = this.state;
        const triggerId = `${uid}-trigger`;
        const panelId = `${uid}-panel`;
        const resolvedMergeCss = mergeCss ?? this.props?.theme?.accordion?.sectionDefaultProps?.mergeCss;

        let titleElement: React.ReactNode = title;
        if (typeof title === "string") {
            titleElement = <Typography {...spreadProps("titleTypographyProps")}>{title}</Typography>;
        }

        return (
            <AccordionContext.Consumer>
                {({ headingLevel = 0 }) => (
                    <>
                        <AccordionSectionHeader
                            {...spreadProps("headerProps")}
                            headingLevel={headingLevel}
                            expanded={expanded}
                            data-test-selector="sectionHeader"
                            data-test-key={typeof title === "string" ? title : ""}
                            css={applyStyledProp(["headerProps", "css"], resolvedMergeCss)}
                        >
                            <button
                                aria-expanded={expanded}
                                aria-controls={panelId}
                                id={triggerId}
                                onClick={this.togglePanel}
                            >
                                {titleElement}
                                {usesSingleIcon ? (
                                    <IconMemo role="presentation" className="toggle" {...toggleIconProps} />
                                ) : (
                                    <IconPositioner
                                        _size={toggleIconProps.size || 24}
                                        _height={toggleIconProps.height}
                                        _width={toggleIconProps.width}
                                        css={toggleTransition.positionerCss}
                                    >
                                        <TransitionIcon
                                            isIn={!!expanded}
                                            css={toggleTransition.transitionCss}
                                            timeout={toggleTransition.timeout}
                                            iconProps={{
                                                role: "presentation",
                                                ...toggleIconProps,
                                                ...collapseIconProps,
                                            }}
                                        />
                                        <TransitionIcon
                                            isIn={!expanded}
                                            css={toggleTransition.transitionCss}
                                            timeout={toggleTransition.timeout}
                                            iconProps={{
                                                role: "presentation",
                                                ...toggleIconProps,
                                                ...expandIconProps,
                                            }}
                                        />
                                    </IconPositioner>
                                )}
                            </button>
                        </AccordionSectionHeader>
                        <AccordionSectionPanel
                            {...spreadProps("panelProps")}
                            id={panelId}
                            aria-labelledby={triggerId}
                            hidden={!expanded}
                            data-test-selector="sectionPanel"
                            css={applyStyledProp(["panelProps", "css"], resolvedMergeCss)}
                        >
                            {children}
                        </AccordionSectionPanel>
                    </>
                )}
            </AccordionContext.Consumer>
        );
    }
}

interface TransitionManagerProps {
    transitionState: TransitionStatus;
    css?: StyledProp<{ transitionState: TransitionStatus }>;
}

const TransitionManager = styled.span<TransitionManagerProps>`
    position: absolute;
    bottom: -3px;
    right: 0;
    transition: all ease-in-out 250ms;
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

const TransitionIcon = ({
    isIn,
    iconProps,
    css,
    timeout,
}: {
    isIn: boolean;
    iconProps: IconProps;
    timeout: TimeoutProp;
    css: StyledProp<{ transitionState: TransitionStatus }>;
}) => {
    return (
        <Transition
            mountOnEnter
            unmountOnExit
            in={isIn}
            timeout={
                timeout ?? {
                    enter: 75,
                    exit: 250,
                }
            }
        >
            {state => (
                <TransitionManager transitionState={state} css={css}>
                    <IconMemo {...iconProps} />
                </TransitionManager>
            )}
        </Transition>
    );
};

// withTheme is currently incompatible with getDerivedStateFromProps, as unknown as FunctionComponent to get typescript to understand that this can have children
/** @component */
export default withTheme(AccordionSection as unknown as React.FunctionComponent<Props>);
