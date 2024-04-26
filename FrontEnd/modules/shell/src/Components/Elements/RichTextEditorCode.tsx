// The below handles type definition for the `react-froala-wysiwyg` FroalaEditor.
// eslint-disable-next-line spaced-comment
///<reference path= "../../../../../node_modules/react-froala-wysiwyg/lib/index.d.ts" />
// eslint-disable-next-line spaced-comment
///<reference path= "../../Froalaeditor.d.ts" />
import { rawRequest } from "@insite/client-framework/Services/ApiService";
import { getTheme } from "@insite/client-framework/Services/ContentService";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import LoadingSpinner from "@insite/mobius/LoadingSpinner";
import Modal from "@insite/mobius/Modal";
import Scrim from "@insite/mobius/Overlay/Scrim";
import { themeTypographyStyleString } from "@insite/mobius/Typography/TypographyStyle";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import get from "@insite/mobius/utilities/get";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import { createMergedTheme } from "@insite/shell/Components/Shell/StyleGuide/Types";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/xml/xml.js";
import "font-awesome/css/font-awesome.css";
import Froalaeditor from "froala-editor";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/plugins/code_view.min.css";
import "froala-editor/css/themes/dark.min.css";
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/js/plugins/align.min.js";
import "froala-editor/js/plugins/code_beautifier.min.js";
import "froala-editor/js/plugins/code_view.min.js";
import "froala-editor/js/plugins/colors.min.js";
import "froala-editor/js/plugins/draggable.min.js";
import "froala-editor/js/plugins/entities.min.js";
import "froala-editor/js/plugins/file.min.js";
import "froala-editor/js/plugins/font_size.min.js";
import "froala-editor/js/plugins/help.min.js";
import "froala-editor/js/plugins/image.min.js";
import "froala-editor/js/plugins/line_breaker.min.js";
import "froala-editor/js/plugins/line_height.min.js";
import "froala-editor/js/plugins/link.min.js";
import "froala-editor/js/plugins/lists.min.js";
import "froala-editor/js/plugins/paragraph_format.min.js";
import "froala-editor/js/plugins/quote.min.js";
import "froala-editor/js/plugins/special_characters.min.js";
import "froala-editor/js/plugins/video.min.js";
import "froala-editor/js/plugins/word_paste.min.js";
import cloneDeep from "lodash/cloneDeep";
import extend from "lodash/extend";
import flatten from "lodash/flatten";
import uniq from "lodash/uniq";
import * as React from "react";
import FroalaEditor from "react-froala-wysiwyg";
import styled, { css, ThemeProps } from "styled-components";

const expandArrows = `M15 4.2C14.6 4.2 14.3 4.5 14.3 5s0.3 0.8 0.8 0.8h2.2L12.8 10.1c-0.3 0.3-0.3 0.8 0 1.1 0.1 0.1 0.3
 0.2 0.5 0.2s0.4-0.1 0.5-0.2L18.3 6.8v2.2c0 0.4 0.3 0.8 0.8 0.8s0.8-0.3 0.8-0.8V4.2H15zM11.2 12.8c-0.3-0.3-0.8-0.3-1.1
 0l-4.4 4.4v-2.2c0-0.4-0.3-0.8-0.8-0.8S4.3 14.5 4.3 14.9v4.8h4.8c0.4 0 0.8-0.3 0.8-0.8S9.5 18.2 9.1 18.2H6.9l4.4-4.4C11.5
 13.5 11.5 13 11.2 12.8z`;

const collapseArrows = `M17.5 11.4c0.4 0 0.7-0.3 0.7-0.8s-0.3-0.8-0.8-0.8h-2.2l4.5-4.3c0.3-0.3 0.3-0.8 0-1.1C19.6 4.3
 19.4 4.2 19.2 4.2s-0.4 0.1-0.5 0.2L14.2 8.8V6.6c0-0.4-0.3-0.8-0.8-0.8S12.6 6.1 12.6 6.6v4.8H17.5z M4.5 19.5c0.3 0.3
 0.8 0.3 1.1 0l4.4-4.4v2.2c0 0.4 0.3 0.8 0.8 0.8s0.6-0.3 0.6-0.7V12.6H6.6c-0.4 0-0.8 0.3-0.8 0.8s0.4 0.7 0.8
 0.7h2.2l-4.4 4.4C4.2 18.8 4.2 19.3 4.5 19.5z`;

const modalScreenSize = css`
    max-height: 100%;
    max-width: 100%;
    margin: 0;
`;

interface OwnProps {
    extendedConfig?: object;
    collapsedToolbarButtons?: object;
    expandedToolbarButtons?: object;
    value?: string;
    placeholder?: string;
    onChange?: (model: string) => void;
    isCodeViewMode?: boolean;
    name?: string;
}

export type Props = OwnProps;

interface State {
    modalIsOpen: boolean;
    initControls?: any;
    imagePickerIsOpen?: true;
    editedImage?: string;
    theme?: BaseTheme;
}

class RichTextEditor extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { modalIsOpen: false };
        Froalaeditor.DefineIcon("expand", {
            PATH: expandArrows,
        });
        Froalaeditor.DefineIcon("compress", {
            PATH: collapseArrows,
        });
        Froalaeditor.RegisterCommand(`popout${this.props.name}`, {
            title: "Expand",
            icon: "expand",
            focus: false,
            undo: false,
            refreshAfterCallback: false,
            callback: this.openFullscreen,
        });
        Froalaeditor.RegisterCommand(`popin${this.props.name}`, {
            title: "Contract",
            icon: "compress",
            focus: false,
            undo: false,
            refreshAfterCallback: false,
            callback: this.closeFullscreen,
        });

        const editorThis = this; // Needed because Froala replaces `this` with itself in the callback function.
        Froalaeditor.RegisterCommand("insertImage", {
            title: "Insert Image",
            focus: false,
            undo: false,
            refreshAfterCallback: false,
            // eslint-disable-next-line object-shorthand
            callback: function () {
                // Shorthand format doesn't work because Froala provides its own `this` parameter.
                editorThis.setState({ imagePickerIsOpen: true });
                const hideOverlay = () => {
                    if (editorThis.state.editedImage) {
                        const text = this.html.get();
                        this.html.set(text);
                        editorThis.setState({ imagePickerIsOpen: undefined, editedImage: undefined });
                    } else {
                        editorThis.setState({ imagePickerIsOpen: undefined });
                    }
                };
                this.undo.saveStep();
                (window as any).CKFinder.modal({
                    chooseFiles: true,
                    chooseFilesClosePopup: true,
                    onInit: (finder: any) => {
                        document.getElementById("ckf-modal-close")?.addEventListener("click", hideOverlay);
                        finder.on("files:choose", (evt: any) => {
                            this.html.insert(`<img src="${evt.data.files.first().getUrl()}" />`);
                            hideOverlay();
                            this.undo.saveStep();
                        });
                        finder.on("file:choose:resizedImage", (evt: any) => {
                            this.html.insert(`<img src="${evt.data.resizedUrl}" />`);
                            hideOverlay();
                            this.undo.saveStep();
                        });
                        finder.on("command:after:SaveImage", (evt: any) => {
                            if (evt.data.response.currentFolder.url && editorThis.state.editedImage) {
                                rawRequest(
                                    `${evt.data.response.currentFolder.url}${editorThis.state.editedImage}`,
                                    "GET",
                                    {
                                        "Cache-Control": "no-cache",
                                        Pragma: "no-cache",
                                    },
                                );
                            }
                        });
                        finder.on("command:before:SaveImage", (evt: any) => {
                            if (evt.data.params.fileName) {
                                editorThis.setState({ editedImage: evt.data.params.fileName });
                            }
                        });
                    },
                });
            },
        });

        Froalaeditor.RegisterCommand("insertFile", {
            title: "Insert File",
            focus: false,
            undo: false,
            refreshAfterCallback: false,
            // eslint-disable-next-line object-shorthand
            callback: function () {
                // Shorthand format doesn't work because Froala provides its own `this` parameter.
                editorThis.setState({ imagePickerIsOpen: true });
                const hideOverlay = () => {
                    if (editorThis.state.editedImage) {
                        const text = this.html.get();
                        this.html.set(text);
                        editorThis.setState({ imagePickerIsOpen: undefined, editedImage: undefined });
                    } else {
                        editorThis.setState({ imagePickerIsOpen: undefined });
                    }
                };
                this.undo.saveStep();
                (window as any).CKFinder.modal({
                    chooseFiles: true,
                    chooseFilesClosePopup: true,
                    onInit: (finder: any) => {
                        document.getElementById("ckf-modal-close")?.addEventListener("click", hideOverlay);
                        finder.on("files:choose", (evt: any) => {
                            const file = evt.data.files.first();
                            this.html.insert(`<a target="_blank" href="${file.getUrl()}">${file.attributes.name}</a>`);
                            hideOverlay();
                            this.undo.saveStep();
                        });
                        finder.on("file:choose:resizedImage", (evt: any) => {
                            this.html.insert(
                                `<a target="_blank" href="${evt.data.resizedUrl}">${evt.data.file.attributes.name}</a>`,
                            );
                            hideOverlay();
                            this.undo.saveStep();
                        });
                        finder.on("command:after:SaveImage", (evt: any) => {
                            if (evt.data.response.currentFolder.url && editorThis.state.editedImage) {
                                rawRequest(
                                    `${evt.data.response.currentFolder.url}${editorThis.state.editedImage}`,
                                    "GET",
                                    {
                                        "Cache-Control": "no-cache",
                                        Pragma: "no-cache",
                                    },
                                );
                            }
                        });
                        finder.on("command:before:SaveImage", (evt: any) => {
                            if (evt.data.params.fileName) {
                                editorThis.setState({ editedImage: evt.data.params.fileName });
                            }
                        });
                    },
                });
            },
        });
    }

    componentDidMount() {
        getTheme().then(theme => {
            this.setState({
                theme: createMergedTheme(theme),
            });
        });
    }

    openFullscreen = () => {
        this.onChangeInCodeViewMode();
        this.setState({ modalIsOpen: true });
    };

    closeFullscreen = () => {
        this.setState({ modalIsOpen: false });
    };

    onChangeInCodeViewMode = () => {
        const editor = this.state.initControls.getEditor();
        if (editor?.codeView?.isActive() && this.props.onChange) {
            const value = editor.codeView.get();
            if (this.props.value !== value) {
                this.props.onChange(value);
            }
        }
    };

    handleManualController = (initControls: any) => {
        this.setState({ initControls });
        initControls.initialize();
        if (this.props.isCodeViewMode) {
            setTimeout(() => {
                const editor = initControls.getEditor();
                if (!editor.codeView.isActive()) {
                    editor.codeView.toggle();
                }
            });
        }
    };

    extendConfig = (baseConfig: object, extensionConfig: object) => {
        const baseConfigClone = cloneDeep(baseConfig);
        return extend(baseConfigClone || {}, extensionConfig);
    };

    render() {
        if (!this.state.theme) {
            return <LoadingSpinner />;
        }

        const themeColors = uniq(
            flatten(Object.values(this.state.theme.colors).map(colorObj => Object.values(colorObj))),
        );
        themeColors.push("REMOVE");

        const baseCollapsedToolbarButtons = {
            moreText: { buttons: ["paragraphFormat", "bold", "italic"] },
            expand: { buttons: [`popout${this.props.name}`], align: "right" },
        };
        const baseExpandedToolbarButtons = {
            moreParagraph: {
                buttons: [
                    "paragraphFormat",
                    "alignLeft",
                    "alignCenter",
                    "alignRight",
                    "formatOLSimple",
                    "formatULSimple",
                    "formatUL",
                    "lineHeight",
                    "paragraphStyle",
                    "outdent",
                    "indent",
                    "quote",
                ],
                buttonsVisible: 12,
            },
            moreText: {
                buttons: [
                    "bold",
                    "italic",
                    "underline",
                    "strikeThrough",
                    "subscript",
                    "superscript",
                    "clearFormatting",
                    "fontSize",
                    "textColor",
                    "backgroundColor",
                ],
                buttonsVisible: 7,
            },
            moreMisc: {
                buttons: ["insertLink", "insertImage", "insertHR", "specialCharacters", "insertVideo", "insertFile"],
                buttonsVisible: 3,
            },
            code: {
                buttons: ["selectAll", "html", "help"],
                buttonsVisible: 3,
            },
            unredo: { buttons: ["undo", "redo"] },
            popin: { buttons: [`popin${this.props.name}`], align: "right" },
        };
        const collapsedToolbarButtons = this.props.collapsedToolbarButtons
            ? this.extendConfig(baseCollapsedToolbarButtons, this.props.collapsedToolbarButtons)
            : baseCollapsedToolbarButtons;
        const expandedToolbarButtons = this.props.expandedToolbarButtons
            ? this.extendConfig(baseExpandedToolbarButtons, this.props.expandedToolbarButtons)
            : baseExpandedToolbarButtons;

        const editor = (sidebar: boolean) => {
            if (!this.state.theme) {
                return;
            }
            const baseConfig = {
                key: "vYA6mB5B4E3E4C3C7dNSWXf1h1MDb1CF1PLPFf1C1EESFKVlA3C11A8B6D2B4F3G2C3F3",
                theme: "dark",
                attribution: false,
                paragraphFormat: {
                    N: "Normal",
                    H1: "Heading 1",
                    H2: "Heading 2",
                    H3: "Heading 3",
                    H4: "Heading 4",
                    H5: "Heading 5",
                    H6: "Heading 6",
                    PRE: "Code",
                },
                paragraphFormatSelection: !sidebar,
                paragraphMultipleStyles: false,
                pastePlain: true,
                codeViewKeepActiveButtons: [`popin${this.props.name}`],
                codeMirror: CodeMirror,
                placeholderText: this.props.placeholder,
                colorsBackground: themeColors,
                colorsText: themeColors,
                height: 400,
                colorsStep: 5,
                videoInsertButtons: ["videoBack", "|", "videoByURL", "videoEmbed"],
                htmlRemoveTags: ["script"],
                htmlExecuteScripts: false,
                htmlUntouched: true,
            };
            const config = this.props.extendedConfig
                ? this.extendConfig(baseConfig, this.props.extendedConfig)
                : baseConfig;

            return (
                <>
                    {this.state.imagePickerIsOpen && <Scrim zIndexLevel="modal" />}
                    <EditorStyles sidebar={sidebar} siteTheme={this.state.theme}>
                        <FroalaEditor
                            config={{
                                ...config,
                                toolbarButtons: sidebar ? collapsedToolbarButtons : expandedToolbarButtons,
                                events: {
                                    // Needed it because onModelChange event is not fired in the codeView mode
                                    blur: () => {
                                        this.onChangeInCodeViewMode();
                                    },
                                },
                            }}
                            onManualControllerReady={this.handleManualController}
                            model={this.props.value}
                            onModelChange={this.props.onChange}
                        />
                    </EditorStyles>
                </>
            );
        };
        return (
            <>
                {editor(true)}
                <Modal
                    isOpen={this.state.modalIsOpen}
                    cssOverrides={{
                        modalBody: css`
                            overflow: hidden;
                            ${({ theme }: ThemeProps<BaseTheme>) =>
                                breakpointMediaQueries(theme, [null, null, null, modalScreenSize, null], "min")}
                        `,
                        modalContent: css`
                            padding: 0;
                            max-height: unset;
                            overflow: auto;
                        `,
                        modalTitle: css`
                            display: none;
                        `,
                    }}
                    handleClose={this.closeFullscreen}
                    data-test-selector="richTextFullScreen"
                >
                    {editor(false)}
                </Modal>
            </>
        );
    }
}

const EditorStyles = styled.div<{ sidebar: boolean; siteTheme: BaseTheme; theme: BaseTheme }>`
    ${({ sidebar }) => (sidebar ? "margin-top: 10px;" : "")}
    ${({ siteTheme }) => siteTheme && themeTypographyStyleString({ theme: siteTheme })}
    ul, ol {
        padding: 0 0 0 40px;
        margin: 1rem 0;
    }
    ul {
        list-style: disc;
        ${({ siteTheme }) => siteTheme?.lists?.defaultProps?.css}
        ${({ siteTheme }) => siteTheme?.lists?.unorderedListProps?.css}
    }
    ol {
        ${({ siteTheme }) => siteTheme?.lists?.defaultProps?.css}
        ${({ siteTheme }) => siteTheme?.lists?.orderedListProps?.css}
    }
    li {
        ${({ siteTheme }) => siteTheme?.lists?.defaultProps?.css}
        ${({ siteTheme }) => siteTheme?.lists?.listItemProps?.css}
    }
    a {
        color: ${({ siteTheme }) => {
            const linkColor = get(siteTheme, "link.defaultProps.color");
            return linkColor && resolveColor(linkColor, siteTheme);
        }};
    }
    .fr-toolbar.dark-theme.fr-toolbar.fr-top {
        color: #fff;
        background: #4a4a4a;
        border-radius: ${({ sidebar }) => (sidebar ? "4px 4px 0 0" : "0")};
        border: none;
    }
    .dark-theme.fr-basic.fr-top {
        .fr-btn {
            font-size: 17px;
        }
        .fr-toolbar {
            .fr-btn-grp {
                margin: 0 20px 0 5px;
            }
            .fr-float-right {
                margin: 0 5px 0 20px;
            }
        }
        .fr-toolbar,
        .fr-popup,
        .fr-modal {
            .fr-command.fr-btn svg path {
                fill: #fff;
            }
            .fr-command.fr-btn.fr-dropdown {
                padding-right: 8px;

                ::after {
                    border-top-color: #fff;
                    top: 10px;
                }
            }
            .fr-command.fr-btn {
                color: #fff;
                height: 24px;
            }
            .fr-command.fr-btn i,
            .fr-command.fr-btn svg {
                margin: 0;
            }
            .fr-command.fr-btn.fr-dropdown.fr-active {
                background: rgba(255, 255, 255, 0.3);
                fill: #fff;
            }
        }
        .fr-desktop .fr-command:hover:not(.fr-table-cell),
        .fr-desktop .fr-command:focus:not(.fr-table-cell),
        .fr-desktop .fr-command.fr-btn-hover:not(.fr-table-cell),
        .fr-desktop .fr-command.fr-expanded:not(.fr-table-cell) {
            background: rgba(255, 255, 255, 0.3);
            fill: #fff;
        }
        .fr-wrapper {
            background: ${({ siteTheme }) => siteTheme.colors.common.background};
            border: 1px solid ${({ theme }) => theme.colors.common.border};
            border-width: 0 1px 1px 1px;
            border-radius: 0 0 4px 4px;
            overflow: hidden;
            ${({ sidebar }) => {
                return sidebar ? "" : "height: calc(100vh - 33px) !important;";
            }}
        }
        .fr-element.fr-view {
            border-top: none;
            border-radius: 0 0 4px 4px;
            ${({ sidebar }) => {
                return sidebar ? "" : "height: calc(100vh - 33px) !important;";
            }}
        }
        .second-toolbar {
            border: 0;
        }
        .dark-theme.fr-toolbar .fr-more-toolbar.fr-expanded {
            height: 33px;
        }
        .dark-theme.fr-toolbar.fr-toolbar-open {
            padding-bottom: 33px;
        }
        .dark-theme.fr-toolbar .fr-command.fr-btn.fr-open:not(:active) {
            height: 27px;
        }
        .dark-theme.fr-toolbar .fr-btn-grp .fr-command.fr-btn.fr-active:not(.fr-dropdown) svg path {
            fill: ${({ theme }) => theme.colors.primary.main};
        }
        .fr-command.fr-btn + .fr-dropdown-menu {
            .fr-dropdown-wrapper {
                max-height: 150px;
            }
        }
    }
    .dark-theme .fr-view blockquote {
        border-left: none;
        color: inherit;
        margin-inline-start: 40px;
        padding-left: 0;
    }
    u {
        color: inherit;
    }
    .fr-box {
        z-index: 1;
    }
    .fr-box.fr-code-view .CodeMirror {
        height: 100% !important;
    }
    .dark-theme.fr-popup .fr-buttons.fr-tabs .fr-special-character-category {
        padding: 2px 14px;
    }
    .fr-selected-color {
        text-shadow: 0 0 8px #6a6a6a;
    }
`;

export default RichTextEditor;
