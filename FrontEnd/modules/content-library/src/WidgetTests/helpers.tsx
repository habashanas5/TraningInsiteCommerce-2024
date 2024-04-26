import { DeepWriteable } from "@insite/client-framework/Common/Types";
import ApplicationState, { WriteableState } from "@insite/client-framework/Store/ApplicationState";
import { configureStore } from "@insite/client-framework/Store/ConfigureStore";
import WidgetGroups from "@insite/client-framework/Types/WidgetGroups";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { Styles, StylesContext, StylesProvider } from "@insite/content-library/additionalStyles";
import baseTheme from "@insite/mobius/globals/baseTheme";
import ThemeProvider from "@insite/mobius/ThemeProvider";
import RecursivePartial from "@insite/mobius/utilities/RecursivePartial";
import { mount, ReactWrapper, ShallowWrapper } from "enzyme";
import "jest-styled-components";
import React, { ComponentType, FC, ReactNode } from "react";
import { Provider } from "react-redux";

export function elementHasStyle<P, S, C>(component: ReactWrapper<P, S, C>, styleRule: any) {
    // For some reason, the toHaveStylesRule method is not working on expect
    // I had to use toMatch so that I could use regex because space characters were
    // throwing off the match

    const props = component.props() as { css?: any };

    expect(props.css?.join("")).toMatch(styleRule);
}

export function elementIsRendering<P, S, C>(component: ReactWrapper<P, S, C>) {
    expect(component).toHaveLength(1);
}

export function setupWidgetRendering<T extends WidgetProps>(
    component: ComponentType<T>,
    ItemListWidgetModule: WidgetModule,
): {
    renderWidget: () => ReactWrapper;
    useFields: () => RecursivePartial<T["fields"]>;
    useProps: () => RecursivePartial<T>;
    useApplicationState: () => WriteableState;
    useStyles: () => Styles;
} {
    let fields: Partial<T["fields"]> = {};
    let props: RecursivePartial<T> = {};

    // can we somehow figure this out from the reducers?
    const initialState = () => {
        return {
            context: {
                settings: {
                    settingsCollection: {
                        searchSettings: {},
                    },
                },
            },
        };
    };

    // this should really be a builder, or we can have helper functions to pass it to
    let state: DeepWriteable<RecursivePartial<ApplicationState>> = initialState();
    let styles: Styles = {};

    const renderWidget = () => {
        try {
            const widgetProps = getWidgetProps(component, ItemListWidgetModule, {
                ...props,
                fields: {
                    ...fields,
                },
            });
            const app = mountApp(component, widgetProps, styles, state);

            return app;
        } finally {
            fields = {};
            state = initialState();
            styles = {};
            props = {};
        }
    };

    return {
        renderWidget,
        useFields: () => fields,
        useApplicationState: () => state,
        useStyles: () => styles,
        useProps: () => props,
    };
}

function getWidgetProps<T extends WidgetProps>(
    Component: ComponentType<T>,
    widgetModule: WidgetModule,
    additionalProps: RecursivePartial<T>,
) {
    const fields = widgetModule.definition.fieldDefinitions?.reduce((fields: T["fields"], field) => {
        (fields as any)[field.name] = field.defaultValue;
        return fields;
    }, {} as T["fields"]);

    const props = {
        id: "1",
        parentId: "1",
        isLayout: false,
        type: "general",
        zone: "top",
        generalFields: {},
        translatableFields: {},
        contextualFields: {},
        ...additionalProps,
    } as any;

    props.fields = {
        ...fields,
        ...props.fields,
    };

    return props as T;
}

const mountApp = <T extends object>(
    Component: ComponentType<T>,
    props: T,
    styles: Styles = {},
    initialState: DeepWriteable<RecursivePartial<ApplicationState>> | undefined = undefined,
) => {
    const store = configureStore(initialState as any as ApplicationState);

    return mount(
        <Provider store={store}>
            <ThemeProvider translate={text => text} theme={baseTheme}>
                <StylesProvider styles={styles}>
                    <Component {...props} />
                </StylesProvider>
            </ThemeProvider>
        </Provider>,
    );
};
