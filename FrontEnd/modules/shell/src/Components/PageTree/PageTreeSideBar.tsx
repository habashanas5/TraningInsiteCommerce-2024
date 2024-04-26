import { SideBarStyle } from "@insite/shell/Components/Layout";
import ReorderPagesModal from "@insite/shell/Components/Modals/ReorderPagesModal";
import AddPage from "@insite/shell/Components/PageTree/AddPage";
import PageTree from "@insite/shell/Components/PageTree/PageTree";
import PageTreeFilters from "@insite/shell/Components/PageTree/PageTreeFilters";
import * as React from "react";

const PageTreeSideBar = () => (
    <>
        <SideBarStyle>
            <PageTreeFilters />
            <PageTree />
            <AddPage />
            <ReorderPagesModal />
        </SideBarStyle>
    </>
);

export default PageTreeSideBar;
