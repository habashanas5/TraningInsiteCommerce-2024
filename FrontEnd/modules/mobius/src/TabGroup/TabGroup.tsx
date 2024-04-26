import { ButtonProps } from "@insite/mobius/Button";
import Tab, { TabProps } from "@insite/mobius/Tab";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import getColor from "@insite/mobius/utilities/getColor";
import getProp from "@insite/mobius/utilities/getProp";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import * as React from "react";
import styled, { withTheme } from "styled-components";

export interface TabGroupPresentationProps {
    /**
     * Indicates how the `css` property is combined with the default `css` property from the theme.
     * If true, the default css is applied first and then the component css is applied after causing
     * a merge, much like normal CSS. If false, only the component css is applied, overriding the default css in the theme.
     */
    mergeCss?: boolean;
    /** CSS strings or styled-components functions to be injected into nested components.
     * @themable */
    cssOverrides?: {
        tabGroup?: StyledProp<TabGroupProps>;
        tabContent?: StyledProp<TabGroupProps>;
        wrapper?: StyledProp<TabGroupProps>;
    };
}

export type TabGroupProps = MobiusStyledComponentProps<
    "div",
    {
        /** Current tab. */
        current?: string;
        /** Function to be executed when tab is changed, receives a single argument of the event. */
        onTabChange?: (event: React.MouseEvent | React.KeyboardEvent, tabKey?: string) => void;
    } & TabGroupPresentationProps
>;

export type TabGroupStyleProps = MobiusStyledComponentProps<"ul", { css?: StyledProp<TabGroupProps> }>;

export type TabGroupWrapperProps = MobiusStyledComponentProps<"div", { css?: StyledProp<TabGroupWrapperProps> }>;

const TabGroupStyle = styled.ul.attrs<unknown, { role: string; css?: any }>(() => ({
    role: "tablist",
}))`
    margin: 0;
    list-style: none;
    padding: 2px;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    flex: 1 100%;
    z-index: ${getProp("theme.zIndex.tabGroup")};
    ${injectCss}
`;

const TabGroupWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 4px;
    ${injectCss}
`;

const TabContent = styled.div.attrs<unknown, { role: string; css?: any }>(() => ({
    role: "tabPanel",
}))`
    ${({ hidden }) => hidden && "display: none;"}
    flex: 1 100%;
    margin-top: -4px;
    border-top: 2px solid ${getColor("common.border")};
    border-bottom: 2px solid ${getColor("common.border")};
    padding: 32px 16px;
    z-index: ${props => getProp("theme.zIndex.tabGroup")(props) - 1};
    ${injectCss}
`;

type AssumedChildrenType = React.ReactElement<TabProps>[];

const selectCurrent = ({ children, current = undefined }: Props) => {
    let currentTab = current;
    React.Children.forEach(children, child => {
        if (currentTab === undefined) {
            currentTab = child.props.tabKey;
        }
    });
    return currentTab;
};

type Props = TabGroupProps & {
    /** There's no compile-time enforcement that the children are Tabs, but we assume that they are. Typescript doesn't completely like this */
    children: AssumedChildrenType;
    current?: string;
    contentRef?: (content: HTMLDivElement | null) => void;
};

type State = {
    currentTab?: string;
};

const RIGHT_KEY = 39;
const LEFT_KEY = 37;
const DOWN_KEY = 40;

/**
 * Tab Group is a content presentation component that handles visibility and navigation for on-screen content rendering
 * in a tabbed interface.
 */
class TabGroup extends React.Component<Props, State> {
    tabKeys = (this.props.children as AssumedChildrenType).map(i => i.props.tabKey);

    tabRefs: { [key: string]: React.RefObject<React.Component<ButtonProps>> } = {};

    content?: HTMLDivElement | null;

    state: State = {
        currentTab: selectCurrent(this.props),
    };

    changeTab = (tabKey: string, event: React.MouseEvent | React.KeyboardEvent) => {
        this.setState({ currentTab: tabKey });
        // eslint-disable-next-line no-unused-expressions
        this.props.onTabChange && this.props.onTabChange(event, tabKey);
        (this.tabRefs[tabKey].current as unknown as HTMLButtonElement).focus();
    };

    setContentRef = (content: HTMLDivElement | null) => {
        this.content = content;
        // eslint-disable-next-line no-unused-expressions
        this.props.contentRef && this.props.contentRef(content);
    };

    focusContent = () => {
        // eslint-disable-next-line no-unused-expressions
        this.content && !this.contentHasFocus() && this.content.focus();
    };

    contentHasFocus = () => document.activeElement === this.content || this.content?.contains(document.activeElement);

    handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.keyCode === RIGHT_KEY) {
            const currentIndex = this.tabKeys.findIndex(i => i === this.state.currentTab);
            if (currentIndex !== this.tabKeys.length - 1) {
                this.changeTab(this.tabKeys[currentIndex + 1], event);
            }
        }

        if (event.keyCode === LEFT_KEY) {
            const currentIndex = this.tabKeys.findIndex(i => i === this.state.currentTab);
            if (currentIndex !== 0) {
                this.changeTab(this.tabKeys[currentIndex - 1], event);
            }
        }

        if (event.keyCode === DOWN_KEY) {
            event.preventDefault();
            this.focusContent();
        }
    };

    render() {
        const {
            children, // tabs that contain their own content objects
            onTabChange,
            mergeCss,
            ...otherProps
        } = this.props;
        const { theme } = otherProps;
        const resolvedMergeCss = mergeCss ?? theme?.tab.groupDefaultProps?.mergeCss;
        const { applyStyledProp } = applyPropBuilder(this.props as Props, {
            component: "tab",
            propKey: "groupDefaultProps",
        });

        const { currentTab } = this.state;

        const content: JSX.Element[] = [];
        const tabs: JSX.Element[] = [];

        React.Children.forEach(children as AssumedChildrenType, thisTab => {
            if (!thisTab) {
                return;
            }
            const { tabKey, headline } = thisTab.props;

            this.tabRefs[tabKey] = React.createRef();

            content.push(
                <TabContent
                    aria-labelledby={tabKey}
                    key={`content-${tabKey}`}
                    hidden={tabKey !== currentTab}
                    css={applyStyledProp(["cssOverrides", "tabContent"], resolvedMergeCss)}
                >
                    {thisTab.props.children}
                </TabContent>,
            );
            tabs.push(
                <Tab
                    onClick={event => this.changeTab(tabKey, event)}
                    key={tabKey}
                    id={tabKey}
                    selected={tabKey === currentTab}
                    headline={headline}
                    ref={this.tabRefs[tabKey]}
                    {...thisTab.props}
                />,
            );
        });

        return (
            <TabGroupWrapper {...otherProps} css={applyStyledProp(["cssOverrides", "wrapper"], resolvedMergeCss)}>
                <TabGroupStyle
                    data-id="tabGroup"
                    onKeyDown={this.handleKeyDown}
                    css={applyStyledProp(["cssOverrides", "tabGroup"], resolvedMergeCss)}
                >
                    {tabs}
                </TabGroupStyle>
                <div tabIndex={-1} style={{ outline: "none" }} ref={this.setContentRef} data-id="tabContent">
                    {content}
                </div>
            </TabGroupWrapper>
        );
    }
}

/** @component */
export default withTheme(TabGroup);

export { TabGroupStyle, TabGroupWrapper };
