import { Navigation, NavigationBarIcon } from "@episerver/platform-navigation";
import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import Toaster from "@insite/mobius/Toast/Toaster";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import ErrorModal from "@insite/shell/Components/Modals/ErrorModal";
import LogoutWarningModal from "@insite/shell/Components/Modals/LogoutWarningModal";
import PageEditor from "@insite/shell/Components/PageEditor/PageEditor";
import PageTreeSideBar from "@insite/shell/Components/PageTree/PageTreeSideBar";
import CompleteVersionHistoryModal from "@insite/shell/Components/Shell/CompleteVersionHistoryModal";
import ImportExportModal from "@insite/shell/Components/Shell/ImportExportModal";
import MainHeader from "@insite/shell/Components/Shell/MainHeader";
import MainNavigation from "@insite/shell/Components/Shell/MainNavigation";
import PublishComparer from "@insite/shell/Components/Shell/PublishComparer";
import RestoreContentModal from "@insite/shell/Components/Shell/RestoreContentModal";
import StyleGuideEditor from "@insite/shell/Components/Shell/StyleGuide/StyleGuideEditor";
import StyleGuidePreview from "@insite/shell/Components/Shell/StyleGuide/StyleGuidePreview";
import { ShellThemeProps } from "@insite/shell/ShellTheme";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { useEffect } from "react";
import Icon from "react-oui-icons";
import { connect } from "react-redux";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import styled from "styled-components";

const menuItems = [{ url: "/", name: "", children: [] }];

const homePageLoader = (props: ReturnType<typeof mapStateToProps> & RouteComponentProps) => {
    useEffect(() => {
        if (props.homePageId !== emptyGuid) {
            props.history.push(`/ContentAdmin/Page/${props.homePageId}`);
        }
    });

    return null;
};

const mapStateToProps = (state: ShellState) => ({
    homePageId: state.shellContext.mobileCmsModeActive
        ? state.shellContext.mobileHomePageId
        : state.shellContext.homePageId,
});

const HomePageLoader = connect(mapStateToProps)(withRouter(homePageLoader));

const FlexWrapper = styled.div`
    display: flex;
    height: 100%;
    background-color: ${(props: ShellThemeProps) => props.theme.colors.common.background};

    .mdc-tab-scroller__scroll-area {
        overflow: hidden;
    }
`;

const SideBarArea = styled.div`
    padding-top: 40px;
    width: ${(props: ShellThemeProps) => props.theme.sideBarWidth};
    overflow: hidden;
    position: relative;
    border-right: 1px solid #dedede;
`;

const MainArea = styled.div`
    width: calc(100% - ${(props: ShellThemeProps) => props.theme.sideBarWidth});
    padding-top: 39px;
`;

const layout = (
    <FlexWrapper>
        <Toaster>
            <Navigation
                menuItems={menuItems}
                levelOne={{ url: "/", name: "", children: [] }}
                product={{ name: "B2B Commerce", url: "/" }}
                actionItems={[
                    <NavigationBarIcon
                        key={1}
                        href="https://webhelp.optimizely.com/latest/en/b2b-commerce/b2b-commerce.htm"
                        target="_blank"
                    >
                        <Icon name="help" description="Help" size="medium" fill="white" />
                    </NavigationBarIcon>,
                ]}
                onItemSelect={e => {}}
            />
            <SideBarArea>
                <MainNavigation />
                <Switch>
                    <Route exact path="/ContentAdmin/Design/StyleGuide" component={StyleGuideEditor} />
                    <Route path="/ContentAdmin/Page/" component={PageTreeSideBar} />
                </Switch>
            </SideBarArea>
            <MainArea>
                <Switch>
                    <Route path="/ContentAdmin/Page/*" component={MainHeader} />
                    <Route path={["/ContentAdmin/Design", "/ContentAdmin/"]}>
                        <MainHeader disabled />
                    </Route>
                    <MainHeader />
                </Switch>
                <Switch>
                    <Route exact path="/ContentAdmin/Page/:id" component={PageEditor} />
                    <Route exact path="/ContentAdmin/Design/StyleGuide" component={StyleGuidePreview} />
                    <Route component={HomePageLoader} />
                </Switch>
            </MainArea>
            <LogoutWarningModal />
            <ErrorModal />
            <PublishComparer />
            <ImportExportModal />
            <RestoreContentModal />
            <CompleteVersionHistoryModal />
        </Toaster>
    </FlexWrapper>
);

export default layout;

export const SideBarStyle = styled.div<InjectableCss>`
    width: ${(props: ShellThemeProps) => props.theme.sideBarWidth};
    height: calc(100vh - 40px);
    overflow: auto;
    ${injectCss}
`;
