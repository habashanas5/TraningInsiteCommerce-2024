import { Navigation } from "@episerver/platform-navigation";
import "@episerver/platform-navigation/dist/main.css";
import HeaderBar from "@insite/shell/Components/Shell/HeaderBar";
import Switcher from "@insite/shell/Components/Shell/Switcher";
import * as React from "react";
import { match } from "react-router-dom";
import styled from "styled-components";

const MainHeader: React.FunctionComponent<{ disabled?: boolean }> = ({ disabled }) => {
    return (
        <>
            <MainHeaderStyle>
                <HeaderBarStyle>
                    <HeaderBar disabled={disabled} />
                </HeaderBarStyle>
                <Switcher disabled={disabled} />
            </MainHeaderStyle>
        </>
    );
};

export default MainHeader;

const MainHeaderStyle = styled.div`
    height: ${({ theme }) => theme.headerHeight};
    background-color: #fff;
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid #dedede;
    min-width: 748px;
`;

const HeaderBarStyle = styled.div`
    height: ${({ theme }) => theme.headerHeight};
    display: flex;
`;
