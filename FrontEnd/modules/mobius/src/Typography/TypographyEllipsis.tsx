import { TypographyComponentProps } from "@insite/mobius/Typography/Typography";
import TypographyStyle from "@insite/mobius/Typography/TypographyStyle";
import injectCss from "@insite/mobius/utilities/injectCss";
import * as React from "react";
import styled from "styled-components";

export const TypographyEllipsisStyle = styled(TypographyStyle)`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    ${injectCss}
`;

interface TypographyEllipsisProps extends TypographyComponentProps {
    title?: string;
}

class TypographyEllipsis extends React.Component<any> {
    element = React.createRef<HTMLSpanElement>();

    componentDidMount() {
        this.setTitleOnEllipsis();
    }

    componentDidUpdate() {
        this.setTitleOnEllipsis();
    }

    setTitleOnEllipsis = () => {
        if (!this.props.title && this.element && this.element.current) {
            const element = this.element.current;
            if (element.offsetWidth < element.scrollWidth) {
                element.setAttribute("title", element.innerText);
            }
        }
    };

    render() {
        return <TypographyEllipsisStyle ref={this.element} {...this.props} />;
    }
}

export default TypographyEllipsis;
