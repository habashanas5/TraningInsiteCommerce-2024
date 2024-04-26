import * as React from "react";

export default function withDynamicGoogleMaps(Component: React.ComponentType<any>) {
    return function passPropsOn(props: any) {
        return <ImportGoogleMaps {...props} component={Component} />;
    };
}

class ImportGoogleMaps extends React.Component {
    state = {
        useLoadScript: false,
        GoogleMap: null,
        InfoWindow: null,
        Marker: null,
    };

    componentDidMount() {
        import(/* webpackChunkName: "googleMapsApi" */ "@react-google-maps/api").then(
            ({ useLoadScript, GoogleMap, InfoWindow, Marker }) => {
                this.setState({
                    useLoadScript,
                    GoogleMap,
                    InfoWindow,
                    Marker,
                });
            },
        );
    }

    render() {
        const { component: Component } = this.props as any;
        if (!this.state.useLoadScript || !this.state.GoogleMap || !this.state.InfoWindow || !this.state.Marker) {
            return null;
        }

        return <Component {...this.props} {...this.state} />;
    }
}
