import { FoundModule, registerWidgetModule } from "@insite/client-framework/Components/ContentItemStore";
import DelayedSpinner from "@insite/client-framework/Components/DelayedSpinner";
import importWidgetChunk from "@insite/client-framework/Components/importWidgetChunk";
import MissingComponent from "@insite/client-framework/Components/MissingComponent";
import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import React from "react";

class AsyncComponent extends React.Component<
    { isWidget: boolean; type: string } & HasFields,
    { ComponentToBe: null | any }
> {
    state = {
        ComponentToBe: null,
    };

    async componentDidMount() {
        const module: FoundModule<WidgetModule> | null = await importWidgetChunk(this.props.type);

        if (!module?.default) {
            return this.setState({ ComponentToBe: MissingComponent });
        }

        registerWidgetModule(module, this.props.type);
        this.setState({ ComponentToBe: module.default.component });
    }

    render() {
        const ComponentToBe: any = this.state.ComponentToBe;

        if (!ComponentToBe) {
            return <DelayedSpinner />;
        }

        return <ComponentToBe {...this.props} />;
    }
}

export default AsyncComponent;
