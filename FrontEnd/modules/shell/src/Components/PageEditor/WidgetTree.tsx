import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

interface OwnProps {
    readonly id: string;
}

const mapStateToProps = (state: ShellState) => {
    const {
        data: {
            pages: { widgetsById, widgetIdsByPageIdParentIdAndZone },
        },
    } = state;

    const page = getCurrentPage(state);

    return {
        pageContent: widgetIdsByPageIdParentIdAndZone[page.id],
        widgetsById,
    };
};

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

const WidgetTree: React.FC<Props> = ({ pageContent, id, widgetsById }) => {
    const zones = pageContent[id];

    if (!zones) {
        return null;
    }

    return (
        <ul>
            {Object.keys(zones).map(zoneName => (
                <li key={zoneName}>
                    <ZoneNameStyle>{zoneName}</ZoneNameStyle>
                    <ChildrenStyle>
                        {zones[zoneName].map(id => (
                            <li key={id}>
                                {widgetsById[id].type}
                                <WidgetTree id={id} widgetsById={widgetsById} pageContent={pageContent} />
                            </li>
                        ))}
                    </ChildrenStyle>
                </li>
            ))}
        </ul>
    );
};

export default connect(mapStateToProps)(WidgetTree);

const ZoneNameStyle = styled.span`
    font-style: italic;
`;

const ChildrenStyle = styled.ul`
    li {
        padding-left: 10px;
    }
`;
