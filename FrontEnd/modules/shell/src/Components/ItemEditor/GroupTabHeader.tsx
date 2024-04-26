import * as React from "react";
import styled from "styled-components";

interface Props {
    index: number;
    tabName: string;
    isActive: boolean;
    switchToTab: (index: number) => void;
}

class GroupTabHeader extends React.Component<Props> {
    handleClick = () => {
        this.props.switchToTab(this.props.index);
    };

    render() {
        return (
            <TabStyle data-active={this.props.isActive} onClick={this.handleClick}>
                {this.props.tabName}
            </TabStyle>
        );
    }
}

export default GroupTabHeader;

const TabStyle = styled.li`
    cursor: pointer;
    &[data-active="true"] {
        cursor: default;
        background: linear-gradient(0deg, #fff 0%, #eaeaea 100%);
    }
`;
