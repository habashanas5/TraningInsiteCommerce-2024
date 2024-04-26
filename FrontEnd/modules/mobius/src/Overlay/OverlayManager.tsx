import * as ariaAppHider from "@insite/mobius/Overlay/helpers/ariaAppHider";
import * as focusManager from "@insite/mobius/Overlay/helpers/focusManager";
import scopeTab from "@insite/mobius/Overlay/helpers/scopeTab";
import { OverlayComponentProps, OverlayOwnProps } from "@insite/mobius/Overlay/Overlay";
import Scrim from "@insite/mobius/Overlay/Scrim";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import * as React from "react";
import styled from "styled-components";

const ContentContainer = styled.div`
    ${injectCss}
`;

const ContentBody = styled.div<InjectableCss>`
    ${injectCss}
`;

const TAB_KEY = 9;
const ESC_KEY = 27;

let ariaHiddenInstances = 0;

export type OverlayManagerProps = OverlayComponentProps &
    OverlayOwnProps & {
        /* Duration of exit animation. */
        exitDuration: number;
        /* Reference to . */
        ref: React.RefObject<HTMLDivElement>;
    };

interface OverlayManagerState {
    afterOpen: boolean;
    beforeClose: boolean;
    isOpen?: boolean;
    closesAt: number;
}

export default class OverlayManager extends React.Component<OverlayManagerProps, OverlayManagerState> {
    private shouldClose?: boolean;
    private closeTimer?: number;
    private node?: HTMLDivElement;

    private contentRef = React.createRef<HTMLDivElement>();
    private scrimRef = React.createRef<HTMLDivElement>();

    constructor(props: OverlayManagerProps) {
        super(props);

        this.state = {
            afterOpen: false,
            beforeClose: false,
            closesAt: 0,
        };
    }

    componentDidMount() {
        if (this.props.isOpen) {
            this.open(null);
        }
    }

    componentDidUpdate(prevProps: OverlayManagerProps) {
        if (this.props.isOpen && !prevProps.isOpen) {
            this.open(null);
        } else if (!this.props.isOpen && prevProps.isOpen) {
            this.close(null);
        }
    }

    componentWillUnmount() {
        this.afterClose(null);
        clearTimeout(this.closeTimer);
    }

    setScrimRef = () => this.props.setScrimRef && this.props.setScrimRef(this.scrimRef);

    setContentRef = () => this.props.setContentRef && this.props.setContentRef(this.contentRef);

    beforeOpen() {
        const { appElement, enableClickThrough } = this.props;
        if (!enableClickThrough) {
            ariaHiddenInstances += 1;
            ariaAppHider.hide(appElement as HTMLElement);
        }
    }

    afterClose = (event: React.SyntheticEvent | null) => {
        const { appElement, enableClickThrough } = this.props;

        // Reset aria-hidden attribute if all overlay content elements have been removed
        if (!enableClickThrough && ariaHiddenInstances > 0) {
            ariaHiddenInstances -= 1;

            if (ariaHiddenInstances === 0) {
                ariaAppHider.show(appElement as HTMLElement);
            }
        }

        focusManager.returnFocus();
        focusManager.teardownScopedFocus();

        if (this.props.onAfterClose) {
            this.props.onAfterClose(event);
        }
    };

    open = (event: React.SyntheticEvent | null) => {
        this.beforeOpen();
        event && this.props.handleOpen?.(event);
        if (this.state.afterOpen && this.state.beforeClose) {
            clearTimeout(this.closeTimer);
            this.setState({ beforeClose: false });
        } else {
            focusManager.setupScopedFocus(this.node as HTMLElement);
            focusManager.markForFocusLater();

            this.setState({ isOpen: true }, () => {
                this.setState({ afterOpen: true });

                if (this.props.isOpen && this.props.onAfterOpen) {
                    this.props.onAfterOpen(event);
                }
            });
        }
        this.focusContent();
    };

    close = (event: React.SyntheticEvent | null) => {
        if (this.props.exitDuration > 0) {
            this.closeWithTimeout(event);
        } else {
            this.closeWithoutTimeout(event);
        }
    };

    // Don't steal focus from inner elements
    focusContent = () => {
        // eslint-disable-next-line no-unused-expressions
        this.contentRef && !this.contentHasFocus() && this.contentRef.current?.focus();
    };

    closeWithTimeout = (event: React.SyntheticEvent | null) => {
        const closesAt = Date.now() + this.props.exitDuration;
        this.setState({ beforeClose: true, closesAt }, () => {
            this.closeTimer = setTimeout(this.closeWithoutTimeout, this.state.closesAt - Date.now());
        });
    };

    closeWithoutTimeout = (event: React.SyntheticEvent | null) => {
        this.setState(
            {
                beforeClose: false,
                isOpen: false,
                afterOpen: false,
                closesAt: 0,
            },
            () => this.afterClose(event),
        );
    };

    isPersistentAndVisible = () => this.props.persisted && this.contentRef.current?.style.transform !== "";

    handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (this.isPersistentAndVisible()) {
            if (event.keyCode === TAB_KEY) {
                scopeTab(this.contentRef.current as HTMLElement, event);
            }

            if (this.props.closeOnEsc && event.keyCode === ESC_KEY) {
                event.stopPropagation();
                this.props.handleClose?.(event);
            }
        }

        if (event.keyCode === TAB_KEY) {
            scopeTab(this.contentRef.current as HTMLElement, event);
        }

        if (this.props.closeOnEsc && event.keyCode === ESC_KEY) {
            event.stopPropagation();
            this.requestClose(event);
        }
    };

    handleScrimOnClick = (event: React.SyntheticEvent) => {
        if ((event.target as any) === this.scrimRef && this.isPersistentAndVisible()) {
            this.props.handleClose?.(event);
            return;
        }
        if (this.shouldClose === undefined) {
            this.shouldClose = true;
        }
        if (this.shouldClose && this.props.closeOnScrimClick) {
            if (this.props.handleClose) {
                this.requestClose(event);
            } else {
                this.focusContent();
            }
        }
        this.shouldClose = undefined;
    };

    handleContentOnMouseUp = () => {
        this.shouldClose = false;
    };

    handleScrimOnMouseDown = (event: React.SyntheticEvent) => {
        if (!this.props.closeOnScrimClick && event.target === this.scrimRef.current) {
            event.preventDefault();
        }
    };

    handleContentOnClick = () => {
        this.shouldClose = false;
    };

    handleContentOnMouseDown = () => {
        this.shouldClose = false;
    };

    requestClose = (event: React.SyntheticEvent) => {
        this.props.handleClose?.(event);
    };

    shouldBeClosed = () => !this.props.isOpen && !this.state.beforeClose;

    contentHasFocus = () =>
        document.activeElement === this.contentRef.current || this.contentRef.current?.contains(document.activeElement);

    render() {
        const {
            children,
            contentLabel,
            cssOverrides,
            role,
            setScrimRef,
            setContentRef,
            titleId,
            transition,
            zIndexLevel,
            ...otherProps
        } = this.props;

        setScrimRef && setScrimRef(this.scrimRef);
        setContentRef && setContentRef(this.contentRef);

        const renderComponent = (
            <Scrim
                persisted={this.props.persisted}
                persistentClosed={!this.props.isOpen || !this.isPersistentAndVisible()}
                ref={this.scrimRef}
                onClick={this.handleScrimOnClick}
                onMouseDown={this.handleScrimOnMouseDown}
                onKeyDown={this.handleKeyDown}
                isClosing={this.state.beforeClose && this.state.afterOpen}
                transition={transition}
                zIndexLevel={zIndexLevel}
                css={cssOverrides && cssOverrides.scrim}
            >
                <ContentContainer
                    css={cssOverrides?.contentContainer}
                    isClosing={this.state.beforeClose && this.state.afterOpen}
                    onKeyDown={this.handleKeyDown}
                    transition={transition}
                    {...otherProps}
                >
                    <ContentBody
                        css={cssOverrides?.contentBody}
                        ref={this.contentRef}
                        tabIndex={-1}
                        onKeyDown={this.handleKeyDown}
                        onMouseDown={this.handleContentOnMouseDown}
                        onMouseUp={this.handleContentOnMouseUp}
                        onClick={this.handleContentOnClick}
                        role={role}
                        aria-label={contentLabel}
                        aria-labelledby={titleId as string}
                    >
                        {children}
                    </ContentBody>
                </ContentContainer>
            </Scrim>
        );
        if (!this.props.persisted) {
            return this.shouldBeClosed() ? null : renderComponent;
        }
        return renderComponent;
    }
}
