import ShellState from "@insite/shell/Store/ShellState";
import { connect } from "react-redux";
import styled from "styled-components";

const mapStageModeToProps = (state: ShellState) => ({
    overflowAuto: state.shellContext.stageMode !== "Desktop",
});

const StagePositioner = connect(mapStageModeToProps)(styled.div<ReturnType<typeof mapStageModeToProps>>`
    height: calc(100% - ${({ theme }) => theme.headerHeight});
    ${({ overflowAuto }) => (overflowAuto ? "overflow: auto;" : "")}
`);

export default StagePositioner;
