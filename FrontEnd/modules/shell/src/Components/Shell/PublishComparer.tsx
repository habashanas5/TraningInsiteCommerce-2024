import { getById } from "@insite/client-framework/Store/Data/DataState";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import Button from "@insite/mobius/Button";
import Modal from "@insite/mobius/Modal";
import Typography from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import ContextHeader from "@insite/shell/Components/CompareModal/ContextHeader";
import ArrowDown from "@insite/shell/Components/Icons/ArrowDown";
import Stage, { DeviceContent } from "@insite/shell/Components/Shell/Stage";
import { PageVersionInfoModel } from "@insite/shell/Services/ContentAdminService";
import {
    closeComparison,
    loadPublishedPageVersions,
    restoreVersion,
    setLeftVersion,
    setRightVersion,
    showCompleteVersionHistoryModal,
} from "@insite/shell/Store/CompareModal/CompareModalActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

const mapStateToProps = (state: ShellState) => {
    const {
        publishModal: { pagePublishInfosState },
        compareModal: { compareVersions, publishedPageVersions, isSideBySide, isShowingLeftSide },
        shellContext: { mobileCmsModeActive },
    } = state;

    const pageId = compareVersions?.pageId || getCurrentPage(state).id;
    const pageType = getById(state.data.pages, pageId).value?.type;

    return {
        pageType,
        compareVersions,
        pagePublishInfo: pagePublishInfosState.value?.find(
            ({ pageId: publishPageId, languageId, personaId, deviceType }) =>
                publishPageId === pageId &&
                (!languageId || languageId === compareVersions?.languageId) &&
                (!personaId || personaId === compareVersions?.personaId) &&
                (!deviceType || deviceType === compareVersions?.deviceType),
        ),
        publishedPageVersions,
        isSideBySide,
        isShowingLeftSide,
        mobileCmsModeActive,
    };
};

const mapDispatchToProps = {
    loadPublishedPageVersions,
    showCompleteVersionHistoryModal,
    restoreVersion,
    closeComparison,
    setLeftVersion,
    setRightVersion,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

type CombinedVersionType = Omit<PageVersionInfoModel, "publishOn"> & { publishOn?: string };

interface State {
    leftSelectionOpened: boolean;
    rightSelectionOpened: boolean;
    versionsLoaded: boolean;
    versionToRestore?: PageVersionInfoModel;
    isRestoreModalOpen: boolean;
}

class PublishComparer extends React.Component<Props, State> {
    private readonly leftPageVersionOptionsElement = React.createRef<HTMLDivElement>();
    private readonly rightPageVersionOptionsElement = React.createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);

        this.state = {
            leftSelectionOpened: false,
            rightSelectionOpened: false,
            versionsLoaded: false,
            isRestoreModalOpen: false,
        };
    }

    toggleLeftSelectionClickHandler = () => {
        this.setState({ leftSelectionOpened: !this.state.leftSelectionOpened });
    };

    toggleRightSelectionClickHandler = () => {
        this.setState({ rightSelectionOpened: !this.state.rightSelectionOpened });
    };

    showCompleteHistoryForHandler = (side: "left" | "right") => {
        this.setState({ leftSelectionOpened: false, rightSelectionOpened: false });
        this.props.showCompleteVersionHistoryModal(side);
    };

    closeModalHandler = () => {
        this.props.closeComparison();
        this.setState({
            leftSelectionOpened: false,
            rightSelectionOpened: false,
            versionsLoaded: false,
            isRestoreModalOpen: false,
        });
    };

    restorePageVersionHandler = (pageVersion: PageVersionInfoModel) => {
        this.setState({
            leftSelectionOpened: false,
            rightSelectionOpened: false,
            isRestoreModalOpen: true,
            versionToRestore: pageVersion,
        });
    };

    closeRestoreModalHandler = () => {
        this.setState({ isRestoreModalOpen: false, versionToRestore: undefined });
    };

    confirmRestoreHandler = () => {
        if (this.state.versionToRestore && this.props.compareVersions) {
            this.closeModalHandler();
            this.props.restoreVersion(this.state.versionToRestore, this.props.compareVersions.pageId);
        }
    };

    componentDidMount() {
        this.loadPageVersionsIfNeeded();
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside = (event: MouseEvent) => {
        if (
            this.state.leftSelectionOpened &&
            this.leftPageVersionOptionsElement.current &&
            !this.leftPageVersionOptionsElement.current.contains(event.target as Node)
        ) {
            this.setState({ leftSelectionOpened: false });
        }

        if (
            this.state.rightSelectionOpened &&
            this.rightPageVersionOptionsElement.current &&
            !this.rightPageVersionOptionsElement.current.contains(event.target as Node)
        ) {
            this.setState({ rightSelectionOpened: false });
        }
    };

    componentDidUpdate() {
        this.loadPageVersionsIfNeeded();
    }

    loadPageVersionsIfNeeded() {
        if (!this.state.versionsLoaded && this.props.compareVersions?.pageId) {
            this.setState({ versionsLoaded: true });
            this.props.loadPublishedPageVersions(this.props.compareVersions.pageId, 1, 5);
        }
    }

    renderPageVersionOption = (pageVersion: CombinedVersionType, onClickHandler: () => void) => {
        return (
            <PageVersionOption key={pageVersion.versionId}>
                <PageVersionPublishInfo>
                    <div>
                        {"publishOn" in pageVersion && pageVersion.publishOn ? (
                            <>
                                <span>Published On:</span>
                                {new Date(pageVersion.publishOn).toLocaleString()}
                            </>
                        ) : (
                            <>
                                <span>Modified On:</span>
                                {new Date(pageVersion.modifiedOn).toLocaleString()}
                            </>
                        )}
                    </div>
                    <div>
                        {"publishedBy" in pageVersion && pageVersion.publishedBy ? (
                            <>
                                <span>Published By:</span>
                                {pageVersion.publishedBy}
                            </>
                        ) : (
                            <>
                                <span>Modified By:</span>
                                {pageVersion.modifiedBy}
                            </>
                        )}
                    </div>
                </PageVersionPublishInfo>
                <div>
                    <ViewButton
                        size={22}
                        sizeVariant="small"
                        data-test-selector={`publishCompareModal_view_${pageVersion.versionId}`}
                        onClick={onClickHandler}
                    >
                        View
                    </ViewButton>
                </div>
            </PageVersionOption>
        );
    };

    render() {
        const {
            pageType,
            compareVersions,
            pagePublishInfo,
            publishedPageVersions,
            isSideBySide,
            isShowingLeftSide,
            mobileCmsModeActive,
        } = this.props;

        if (!compareVersions || !publishedPageVersions) {
            return null;
        }

        const { languageId, deviceType, personaId, stageMode, canSelectVersion } = compareVersions;
        const { pageVersions } = publishedPageVersions;
        const unpublished = pagePublishInfo?.unpublished;
        const published = !pagePublishInfo?.futurePublishOn ? pagePublishInfo?.published : undefined;
        const futurePublished = pagePublishInfo?.futurePublishOn ? pagePublishInfo?.published : undefined;
        const currentPublished = pageVersions[0];
        const leftVersion = compareVersions.leftVersion || published || currentPublished;
        const rightVersion: CombinedVersionType | undefined =
            compareVersions.rightVersion || futurePublished || unpublished;

        if (!leftVersion) {
            return (
                <Modal size={350} isOpen={true} handleClose={this.closeModalHandler} headline="Compare Versions">
                    <Typography color="danger" data-test-selector="publishCompareModal_message">
                        There is nothing to compare.
                    </Typography>
                    <ButtonsContainer>
                        <CancelButton variant="tertiary" onClick={this.closeModalHandler}>
                            Cancel
                        </CancelButton>
                    </ButtonsContainer>
                </Modal>
            );
        }

        const canRestoreLeftVersion =
            !futurePublished && (!!unpublished || leftVersion.versionId !== currentPublished.versionId);
        const canRestoreRightVersion =
            !futurePublished &&
            !!rightVersion &&
            ((unpublished && rightVersion.versionId !== unpublished.versionId) ||
                (!unpublished && rightVersion.versionId !== currentPublished.versionId));

        const forcedContext = `&languageId=${languageId}&deviceType=${deviceType}&personaId=${personaId}`;
        const skipHeaderFooter =
            pageType === "Header" || pageType === "Footer" || mobileCmsModeActive ? "&skipHeaderFooter=true" : "";

        return (
            <FullScreenModal data-test-selector="publishCompareModal">
                <ContextHeader closeModal={this.closeModalHandler} />
                <VersionsHeader isSideBySide={isSideBySide}>
                    {(isSideBySide || isShowingLeftSide) && (
                        <LeftPaneHeader>
                            {!canSelectVersion ? (
                                <div>
                                    <span>Published: </span>
                                    <span>{new Date(leftVersion.modifiedOn).toLocaleString()}</span>
                                </div>
                            ) : (
                                <VersionSelectionWrapper ref={this.leftPageVersionOptionsElement}>
                                    <VersionSelector
                                        title="Version Selection"
                                        data-test-selector="publishCompareModal_toggleSelection"
                                        onClick={this.toggleLeftSelectionClickHandler}
                                    >
                                        <span>Page Version: </span>
                                        <span>
                                            {new Date(leftVersion.publishOn).toLocaleString()}
                                            {leftVersion.versionId === currentPublished.versionId ? " (Published)" : ""}
                                        </span>
                                        <ArrowDownWrapper>
                                            <ArrowDown color1="white" height={7} />
                                        </ArrowDownWrapper>
                                    </VersionSelector>
                                    <PageVersionOptions isActive={this.state.leftSelectionOpened}>
                                        {pageVersions?.map(o =>
                                            this.renderPageVersionOption(o, () => {
                                                this.setState({ leftSelectionOpened: false });
                                                this.props.setLeftVersion(o);
                                            }),
                                        )}
                                        {publishedPageVersions.totalItemCount > 5 && (
                                            <ShowCompleteHistoryButton
                                                onClick={() => this.showCompleteHistoryForHandler("left")}
                                            >
                                                Show Complete History
                                            </ShowCompleteHistoryButton>
                                        )}
                                    </PageVersionOptions>
                                </VersionSelectionWrapper>
                            )}
                            <RestoreButton
                                sizeVariant="small"
                                disabled={!canRestoreLeftVersion}
                                onClick={() => this.restorePageVersionHandler(leftVersion)}
                            >
                                Restore
                            </RestoreButton>
                        </LeftPaneHeader>
                    )}
                    {(isSideBySide || !isShowingLeftSide) && (
                        <RightPaneHeader>
                            {!canSelectVersion ? (
                                <>
                                    {rightVersion && (
                                        <div>
                                            {rightVersion.versionId === futurePublished?.versionId ? (
                                                <>
                                                    <span>Futured: </span>
                                                    <span>{new Date(futurePublished.modifiedOn).toLocaleString()}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Draft: </span>
                                                    <span>{new Date(rightVersion.modifiedOn).toLocaleString()}</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <VersionSelectionWrapper ref={this.rightPageVersionOptionsElement}>
                                    <VersionSelector
                                        title="Version Selection"
                                        data-test-selector="publishCompareModal_toggleRightSelection"
                                        onClick={this.toggleRightSelectionClickHandler}
                                    >
                                        {rightVersion ? (
                                            <>
                                                <span>Page Version: </span>
                                                {rightVersion.versionId === futurePublished?.versionId ? (
                                                    <>
                                                        {new Date(futurePublished.publishOn).toLocaleString()} (Futured)
                                                    </>
                                                ) : (
                                                    <>
                                                        {rightVersion.publishOn ? (
                                                            <>
                                                                {new Date(rightVersion.publishOn).toLocaleString()}
                                                                {rightVersion.versionId === currentPublished.versionId
                                                                    ? " (Published)"
                                                                    : ""}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {new Date(rightVersion.modifiedOn).toLocaleString()}{" "}
                                                                (Draft)
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <span>No drafts available</span>
                                        )}
                                        <ArrowDownWrapper>
                                            <ArrowDown height={7} />
                                        </ArrowDownWrapper>
                                    </VersionSelector>
                                    <PageVersionOptions isActive={this.state.rightSelectionOpened}>
                                        {futurePublished &&
                                            this.renderPageVersionOption(futurePublished, () => {
                                                this.setState({ rightSelectionOpened: false });
                                                this.props.setRightVersion(futurePublished);
                                            })}
                                        {unpublished &&
                                            this.renderPageVersionOption(unpublished, () => {
                                                this.setState({ rightSelectionOpened: false });
                                                this.props.setRightVersion(undefined);
                                            })}
                                        {pageVersions?.map(o =>
                                            this.renderPageVersionOption(o, () => {
                                                this.setState({ rightSelectionOpened: false });
                                                this.props.setRightVersion(o);
                                            }),
                                        )}
                                        {publishedPageVersions.totalItemCount > 5 && (
                                            <ShowCompleteHistoryButton
                                                onClick={() => this.showCompleteHistoryForHandler("right")}
                                            >
                                                Show Complete History
                                            </ShowCompleteHistoryButton>
                                        )}
                                    </PageVersionOptions>
                                </VersionSelectionWrapper>
                            )}
                            {rightVersion && (
                                <RestoreButton
                                    sizeVariant="small"
                                    disabled={!canRestoreRightVersion}
                                    onClick={() => this.restorePageVersionHandler(rightVersion as any)}
                                >
                                    Restore
                                </RestoreButton>
                            )}
                        </RightPaneHeader>
                    )}
                </VersionsHeader>
                <PreviewRow isSideBySide={isSideBySide}>
                    <StageWrapper isVisible={isSideBySide || isShowingLeftSide}>
                        <Stage stageMode={stageMode}>
                            <PreviewFrame
                                id="leftSiteIFrame"
                                stageMode={stageMode}
                                src={`/.spire/GetContentByVersion?pageVersionId=${leftVersion.versionId}${forcedContext}${skipHeaderFooter}`}
                            />
                        </Stage>
                    </StageWrapper>
                    <StageWrapper isVisible={isSideBySide || !isShowingLeftSide}>
                        <Stage stageMode={stageMode}>
                            {rightVersion && (
                                <PreviewFrame
                                    id="rightSiteIFrame"
                                    stageMode={stageMode}
                                    src={`/.spire/GetContentByVersion?pageVersionId=${rightVersion.versionId}${forcedContext}${skipHeaderFooter}`}
                                />
                            )}
                        </Stage>
                    </StageWrapper>
                </PreviewRow>
                <Modal
                    size={430}
                    headline="Restore Version"
                    isOpen={this.state.isRestoreModalOpen}
                    handleClose={this.closeRestoreModalHandler}
                >
                    <Typography>Unpublished changes to the current draft will be lost.</Typography>
                    <ButtonsContainer>
                        <CancelButton variant="tertiary" onClick={this.closeRestoreModalHandler}>
                            Cancel
                        </CancelButton>
                        <ConfirmRestoreButton variant="primary" onClick={this.confirmRestoreHandler}>
                            Restore
                        </ConfirmRestoreButton>
                    </ButtonsContainer>
                </Modal>
            </FullScreenModal>
        );
    }
}

const FullScreenModal = styled.div`
    padding-top: 40px;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #f4f4f4;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    z-index: 3;
`;

const VersionsHeader = styled.div<{ isSideBySide: boolean }>`
    display: flex;
    height: 60px;
    > div {
        width: ${props => (props.isSideBySide ? "50%" : "100%")};
    }
`;

const PreviewRow = styled.div<{ isSideBySide: boolean }>`
    display: flex;
    flex-direction: row;
    height: 100%;
    background-color: white;

    > div {
        width: ${props => (props.isSideBySide ? "50%" : "100%")};
        overflow: auto;
    }
`;

const StageWrapper = styled.div<{ isVisible: boolean }>`
    display: ${props => (props.isVisible ? "block" : "none")};
    padding: 5px;
    iframe {
        margin: 0;
    }
    ${DeviceContent} {
        text-align: center;
    }
`;

const PreviewFrame = styled.iframe<{ stageMode: DeviceType }>`
    border: 0 none;

    ${({ stageMode, theme }) => {
        if (stageMode === "Desktop") {
            return `
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
                min-width: calc(20px + ${theme.breakpoints.values[3]}px);
                margin: 10px;
                width: calc(100% - 20px);
                height: calc(100% - 30px);`;
        }

        return `
            width: 100%;
            height: 100%;
        `;
    }}
`;

const PaneHeader = styled.div`
    color: white;
    font-size: 18px;
    display: flex;

    > *:first-child {
        margin-top: 7px;
        padding-top: 5px;

        > *:first-child {
            margin-left: 10px;
            font-weight: 700;
        }
    }
`;

const LeftPaneHeader = styled(PaneHeader)`
    background: ${getColor("common.backgroundContrast")};
    justify-content: space-between;
`;

const RightPaneHeader = styled(PaneHeader)`
    background: #f5a623;
    justify-content: space-between;
    > *:first-child {
        color: ${getColor("common.accentContrast")};
    }
`;

const VersionSelectionWrapper = styled.div`
    width: auto;
    position: relative;
`;

const VersionSelector = styled.div`
    cursor: pointer;
    &:hover {
        opacity: 0.9;
    }
`;

const ArrowDownWrapper = styled.span`
    margin-left: 10px;
    position: relative;
    top: -2px;
`;

const PageVersionOptions = styled.div<{ isActive: boolean }>`
    position: absolute;
    z-index: 1;
    top: 35px;
    ${props => (props.isActive ? "display: block;" : "display: none;")}
    color: ${getColor("common.accentContrast")};
    font-size: 0.8em;
    background: ${getColor("common.background")};
    border: 1px solid #cacaca;
    overflow-y: auto;
    overflow-x: hidden;
`;

const PageVersionOption = styled.div`
    display: flex;
    border-bottom: 1px solid #cacaca;
    padding: 5px 0 5px 10px;
    white-space: nowrap;
    span {
        font-weight: 600;
        margin-right: 3px;
    }
`;

const ViewButton = styled(Button)`
    background: ${getColor("common.background")};
    color: ${getColor("common.accentContrast")};
    border-color: ${getColor("common.backgroundContrast")};
    &:hover {
        opacity: 0.9;
        background: ${getColor("common.background")};
    }
    &:disabled {
        background: ${getColor("common.backgroundContrast")};
    }
    height: 22px;
    margin: 10px 20px;
`;

const PageVersionPublishInfo = styled.div`
    width: 270px;
    > div {
        text-overflow: ellipsis;
        overflow: hidden;
    }
`;

const ShowCompleteHistoryButton = styled(Button)`
    width: 100%;
`;

const ButtonsContainer = styled.div`
    text-align: right;
`;

const CancelButton = styled(Button)`
    margin-top: 20px;
    margin-right: 10px;
`;

const RestoreButton = styled(Button)`
    margin-top: 9px;
    margin-right: 10px;
`;

const ConfirmRestoreButton = styled(Button)`
    margin-top: 20px;
    margin-right: 10px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(PublishComparer);
