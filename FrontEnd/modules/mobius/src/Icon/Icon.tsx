import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import InjectableCss, { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import isUrl from "@insite/mobius/utilities/isUrl";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import omitMultiple from "@insite/mobius/utilities/omitMultiple";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import * as React from "react";
import SVG from "react-inlinesvg";
import styled, { ThemeConsumer } from "styled-components";

export interface IconThemableProps {
    /** The color of the icon.
     * @themable */
    color?: string;
    /** Icon size in pixels. Sets the width and height to the same value.
     * @themable */
    size?: number;
    /** CSS string or styled-components function to be injected into this component. */
    css?: StyledProp<IconProps>;
    /**
     * Indicates how the `css` property is combined with the variant `css` property from the theme.
     * If true, the variant css is applied first and then the component css is applied after causing
     * a merge, much like normal CSS. If false, only the component css is applied, overriding the variant css in the theme.
     */
    mergeCss?: boolean;
    /** A string describing the path to the Mobius Icon, React component or a URL.
     * PLEASE NOTE: Using a string matching the filename in `Icons/*.tsx` will allow the icon source
     * to be loaded as a second module and will save on initial site load. */
}

export interface IconPresentationProps extends IconThemableProps {
    src?: React.ComponentType | string;
}

type IconComponentProps = MobiusStyledComponentProps<
    "span",
    {
        /** Icon height in pixels. Use when the height is not equal to the width */
        height?: number;
        /** Icon width in pixels. Use when the width is not equal to the height. */
        width?: number;
    }
>;

export type IconProps = IconPresentationProps & IconComponentProps;

export type IconWrapperProps = MobiusStyledComponentProps<
    "span",
    InjectableCss & {
        /** The color of the icon */
        _color?: string;
        /** Icon height in pixels. Use when the height is not equal to the width */
        _height?: number;
        /** Icon size in pixels. Sets the width and height to the same value */
        _size?: number;
        /** Icon width in pixels. Use when the width is not equal to the height. */
        _width?: number;
    }
>;

const IconWrapper = styled.span<IconWrapperProps>`
    color: ${({ _color, theme }) => resolveColor(_color, theme)};
    display: inline-flex;
    align-items: center;
    height: ${({ _height, _size }) => _height || _size}px;
    width: ${({ _width, _size }) => _width || _size}px;
    svg {
        height: ${({ _height, _size }) => _height || _size}px;
        width: ${({ _width, _size }) => _width || _size}px;
    }
    ${injectCss}
`;

/**
 * Icon is a style wrapper for the component provided in src.
 * If src is a URL, it uses [react-inlinesvg](https://github.com/gilbarbara/react-inlinesvg) to dynamically load the icon.
 */

class Icon extends React.Component<IconProps> {
    unmounted?: boolean;

    state = {
        IconSrc: undefined,
        iconState: undefined,
    };

    componentDidMount() {
        if (typeof this.props.src === "string") {
            this.loadIcon();
        }
    }

    loadIcon = () => {
        this.setState({ iconState: "loading" }, async () => {
            const Icon = await import(
                /* webpackChunkName: "icons", webpackMode: "lazy-once" */ `../Icons/${this.props.src}`
            );
            if (!this.unmounted) {
                this.setState({ IconSrc: Icon.default, iconState: "loaded" });
            }
        });
    };

    componentWillUnmount() {
        this.unmounted = true;
    }

    render() {
        return (
            <ThemeConsumer>
                {(theme?: BaseTheme) => {
                    const { src, mergeCss, ...otherProps } = this.props;
                    const { applyProp, applyStyledProp } = applyPropBuilder(
                        { theme, ...otherProps },
                        { component: "icon" },
                    );
                    const resolvedMergeCss = mergeCss ?? theme?.icon?.defaultProps?.mergeCss;
                    if (!src) {
                        return null;
                    }

                    let Component: React.ComponentType | React.ReactElement = () => (
                        <svg
                            focusable="false"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    );

                    if (typeof src !== "string") {
                        Component = src;
                    } else {
                        /* eslint-disable no-lonely-if */
                        if (this.state.iconState === "loaded" && this.state.IconSrc) {
                            Component = this.state.IconSrc!;
                        } else if (isUrl(src)) {
                            Component = function IconSVG() {
                                return <SVG src={src} />;
                            };
                        }
                        /* eslint-enable no-lonely-if */
                    }

                    return (
                        <IconWrapper
                            _color={applyProp("color")}
                            _height={applyProp("height")}
                            _size={applyProp("size")}
                            _width={applyProp("width")}
                            css={applyStyledProp("css", resolvedMergeCss)}
                            {...omitMultiple(otherProps, ["color", "size", "height", "width", "css"])}
                        >
                            <Component />
                        </IconWrapper>
                    );
                }}
            </ThemeConsumer>
        );
    }
}

/** @component */
export default Icon;

const IconMemo = React.memo(Icon);

export { IconWrapper, IconMemo };
