import PageProps from "@insite/client-framework/Types/PageProps";
import Icon from "@insite/mobius/Icon";
import DebugMenu from "@insite/shell/Components/Icons/DebugMenu";
import BrandSelection from "@insite/shell/Components/PageEditor/BrandSelection";
import CategorySelection from "@insite/shell/Components/PageEditor/CategorySelection";
import ProductSelection from "@insite/shell/Components/PageEditor/ProductSelection";
import PublishDropDown from "@insite/shell/Components/PageEditor/PublishDropDown";
import { Spacer } from "@insite/shell/Components/Shell/HeaderBar";
import HeaderPublishStatus from "@insite/shell/Components/Shell/HeaderPublishStatus";
import { LoadedPageDefinition } from "@insite/shell/DefinitionTypes";
import { getPageState, getPageStateFromDictionaries } from "@insite/shell/Services/ContentAdminService";
import { getAutoUpdatedPageTypes } from "@insite/shell/Services/SpireService";
import shellTheme, { ShellThemeProps } from "@insite/shell/ShellTheme";
import { editPageOptions, openPageTemplateModal } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import { setContentMode } from "@insite/shell/Store/ShellContext/ShellContextActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

interface OwnProps {
    page: PageProps;
    pageDefinition: LoadedPageDefinition;
}

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

const mapStateToProps = (state: ShellState, { page }: OwnProps) => {
    const {
        pageTree: {
            treeNodesByParentId,
            headerTreeNodesByParentId,
            footerTreeNodesByParentId,
            mobileTreeNodesByParentId,
            futurePublishNodeIds,
        },
        shellContext: { contentMode, permissions },
    } = state;

    const pageState =
        getPageState(
            page.id,
            treeNodesByParentId[page.parentId],
            headerTreeNodesByParentId[page.parentId],
            footerTreeNodesByParentId[page.parentId],
            mobileTreeNodesByParentId[page.parentId],
        ) ||
        getPageStateFromDictionaries(
            page.id,
            treeNodesByParentId,
            headerTreeNodesByParentId,
            footerTreeNodesByParentId,
            mobileTreeNodesByParentId,
        );

    return {
        contentMode,
        permissions,
        futurePublishOn:
            pageState &&
            futurePublishNodeIds[pageState.isVariant ? `${pageState.nodeId}_${pageState.pageId}` : pageState.nodeId],
        isVariant: pageState?.isVariant,
    };
};

const mapDispatchToProps = {
    openPageTemplateModal,
    setContentMode,
    editPageOptions,
};

interface State {
    autoUpdatedPageTypes?: string[];
}

class Header extends React.Component<Props, State> {
    private mounted = false;

    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        this.mounted = true;
        const { autoUpdatedPageTypes } = await getAutoUpdatedPageTypes();
        if (this.mounted) {
            this.setState({
                autoUpdatedPageTypes,
            });
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    editPageOptions = () => {
        this.props.editPageOptions(this.props.page.id, this.props.isVariant);
    };

    render() {
        const { page, pageDefinition, openPageTemplateModal, contentMode, permissions, futurePublishOn } = this.props;

        const autoUpdatedPage = this.state.autoUpdatedPageTypes?.includes(page.type) ?? false;
        return (
            <PageHeaderStyle>
                <PageHeaderTitle data-test-selector="shell_title">{page.name}</PageHeaderTitle>
                <Icon src={Spacer} color="custom.borderDividerColor" />
                <Icon src="Calendar" size={20} color={shellTheme.colors.primary.main} />
                <HeaderPublishStatus />
                {contentMode === "Editing" && (
                    <>
                        <Icon src={Spacer} color="custom.borderDividerColor" />
                        {permissions?.canEditWidget && (!futurePublishOn || futurePublishOn < new Date()) && (
                            <PageHeaderButton onClick={this.editPageOptions} data-test-selector="shell_editPage">
                                <Icon src="Edit" size={20} color={shellTheme.colors.primary.main} />
                            </PageHeaderButton>
                        )}
                        <PageHeaderButton onClick={openPageTemplateModal}>
                            <DebugMenu color1={shellTheme.colors.primary.main} size={16} />
                        </PageHeaderButton>
                    </>
                )}

                {!pageDefinition && <div>There was no component found for the type '{page.type}'</div>}
                {pageDefinition?.supportsProductSelection && <ProductSelection />}
                {pageDefinition?.supportsCategorySelection && <CategorySelection />}
                {pageDefinition?.supportsBrandSelection && <BrandSelection />}
                {autoUpdatedPage && contentMode === "Editing" && (
                    <AutoUpdateWarning>
                        This page is configured to be auto updated. Any edits made may be overwritten.
                    </AutoUpdateWarning>
                )}
                {contentMode !== "Viewing" && (
                    <PublishDropDownStyle>
                        <PublishDropDown />
                    </PublishDropDownStyle>
                )}
            </PageHeaderStyle>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);

const AutoUpdateWarning = styled.span`
    color: ${(props: ShellThemeProps) => props.theme.colors.danger.main};
    font-weight: bold;
    margin-left: 8px;
`;

const PageHeaderStyle = styled.div`
    background-color: ${(props: ShellThemeProps) => props.theme.colors.common.background};
    height: 48px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #dedede;
`;

const PageHeaderTitle = styled.p`
    color: ${(props: ShellThemeProps) => props.theme.colors.primary.main};
    align-content: center;
    padding-left: 16px;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5rem;
    letter-spacing: -0.011rem;
`;

const PageHeaderButton = styled.button`
    background-color: transparent;
    border: none;
    height: 100%;
    min-width: 30px;
    display: inline-block;
    cursor: pointer;
    &:focus {
        outline: none;
    }
    position: relative;
    font-family: ${(props: ShellThemeProps) => props.theme.typography.body.fontFamily};
    &:hover {
        background-color: #f4f4f4;
        background-color: ${({ theme }) => theme.colors.custom.activeBackground};
    }
`;

const PublishDropDownStyle = styled.div`
    margin-left: auto;
    margin-right: 30px;
    display: flex;
`;
