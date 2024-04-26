import Clickable from "@insite/mobius/Clickable";
import Popover from "@insite/mobius/Popover";
import Typography from "@insite/mobius/Typography";
import uniqueId from "@insite/mobius/utilities/uniqueId";
import * as React from "react";
import styled, { css } from "styled-components";

type Props = {
    title: string;
    insideForm?: boolean;
};

const MenuHeader = styled.div`
    height: 60px;
    padding: 18px 30px;
`;

const ConfigBody = styled.div`
    padding: 20px 30px 30px;
`;

class ConfigMenu extends React.Component<Props> {
    state = { controlsId: uniqueId() };
    element = React.createRef<HTMLDivElement>();

    render() {
        return (
            <Popover
                xPosition="start"
                wrapperProps={{
                    css: css`
                        padding: 0 35px;
                        &:hover {
                            background-color: #d4e0fd;
                        }
                    `,
                }}
                contentBodyProps={{
                    css: css`
                        border-radius: 8px;
                        overflow: initial;
                    `,
                    _height: "1200px",
                    _width: 400,
                    as: "span",
                }}
                id="popupBox"
                knownHeight={40}
                popoverTrigger={
                    <Clickable
                        style={{ width: "100%" }}
                        css={css`
                            &:hover {
                                color: ${({ theme }) => theme.colors.primary.main};
                            }
                        `}
                    >
                        <Typography
                            variant="h6"
                            css={css`
                                margin: 7px 0;
                            `}
                        >
                            {this.props.title}
                        </Typography>
                    </Clickable>
                }
                zIndexKey="menu"
                insideRefs={[this.element]}
                transitionDuration="short"
            >
                <MenuHeader>
                    <Typography
                        size={20}
                        weight={500}
                        as="h2"
                        css={css`
                            margin: 0;
                        `}
                    >
                        {this.props.title} Settings
                    </Typography>
                </MenuHeader>
                <ConfigBody>{this.props.children}</ConfigBody>
            </Popover>
        );
    }
}

export default ConfigMenu;
