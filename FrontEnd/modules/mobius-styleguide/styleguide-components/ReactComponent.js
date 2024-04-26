import React, { Component } from "react";
import PropTypes from "prop-types";
import Examples from "react-styleguidist/lib/client/rsg-components/Examples";
import SectionHeading from "react-styleguidist/lib/client/rsg-components/SectionHeading";
import JsDoc from "react-styleguidist/lib/client/rsg-components/JsDoc";
import Markdown from "react-styleguidist/lib/client/rsg-components/Markdown";
import Slot from "react-styleguidist/lib/client/rsg-components/Slot";
import { DOCS_TAB_USAGE } from "react-styleguidist/lib/client/rsg-components/slots";
import { DisplayModes, UsageModes } from "react-styleguidist/lib/client/consts";

import RsgExamplePlaceholder from "react-styleguidist/lib/client/rsg-components/ExamplePlaceholder";
import ReactComponentRenderer from "./ReactComponentRenderer"; // eslint-disable-line import/no-named-as-default

const ExamplePlaceholder = props => {
    if (process.env.STYLEGUIDIST_ENV === "production") {
        return <div />;
    }
    return <RsgExamplePlaceholder {...props} />;
};

export default class ReactComponent extends Component {
    static propTypes = {
        /* eslint-disable react/forbid-prop-types */
        component: PropTypes.object.isRequired,
        depth: PropTypes.number.isRequired,
        exampleMode: PropTypes.string.isRequired,
        usageMode: PropTypes.string.isRequired,
    };

    static contextTypes = {
        displayMode: PropTypes.string,
    };

    constructor(props, context) {
        super(props, context);
        const { usageMode } = props;

        this.handleTabChange = this.handleTabChange.bind(this);

        this.state = {
            activeTab: usageMode === UsageModes.expand ? DOCS_TAB_USAGE : undefined,
            hasError: false,
        };
    }

    handleTabChange(name) {
        this.setState(state => ({
            activeTab: state.activeTab !== name ? name : undefined,
        }));
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error(errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <p>Error!</p>;
        }

        const { activeTab } = this.state;
        const { displayMode } = this.context;
        const { component, depth, usageMode, exampleMode } = this.props;
        const {
            name,
            visibleName,
            slug,
            filepath, // , pathLine
        } = component;
        const { description, examples = [], tags = {} } = component.props;
        if (!name) {
            return null;
        }
        const showUsage = usageMode !== UsageModes.hide;

        return (
            <ReactComponentRenderer
                name={name}
                slug={slug}
                filepath={filepath}
                docs={<JsDoc {...tags} />}
                description={description && <Markdown text={description} />}
                heading={
                    <SectionHeading
                        id={slug}
                        deprecated={!!tags.deprecated}
                        slotName="componentToolbar"
                        slotProps={{
                            ...component,
                            isolated: displayMode !== DisplayModes.all,
                        }}
                        depth={depth}
                    >
                        {visibleName}
                    </SectionHeading>
                }
                examples={
                    examples.length > 0 ? (
                        <Examples examples={examples} name={name} exampleMode={exampleMode} />
                    ) : (
                        <ExamplePlaceholder name={name} />
                    )
                }
                tabButtons={
                    showUsage && (
                        <Slot
                            name="docsTabButtons"
                            active={activeTab}
                            props={{ ...component, onClick: this.handleTabChange }}
                        />
                    )
                }
                tabBody={<Slot name="docsTabs" active={activeTab} onlyActive props={component} />}
            />
        );
    }
}
