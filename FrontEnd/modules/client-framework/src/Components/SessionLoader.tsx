import { getCookie } from "@insite/client-framework/Common/Cookies";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import { Location } from "@insite/client-framework/Components/SpireRouter";
import { setErrorHandler } from "@insite/client-framework/HandlerCreator";
import { createSession } from "@insite/client-framework/Services/SessionService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import handleError from "@insite/client-framework/Store/Context/Handlers/HandleError";
import loadCurrentWebsite from "@insite/client-framework/Store/Context/Handlers/LoadCurrentWebsite";
import loadSession from "@insite/client-framework/Store/Context/Handlers/LoadSession";
import loadSettings from "@insite/client-framework/Store/Context/Handlers/LoadSettings";
import setPunchOutSessionId from "@insite/client-framework/Store/Context/Handlers/SetPunchOutSessionId";
import { AnyAction } from "@insite/client-framework/Store/Reducers";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

interface OwnProps {
    location: Location;
}

const mapStateToProps = (state: ApplicationState) => ({
    isWebsiteLoaded: state.context.isWebsiteLoaded,
    isWebsiteLoading: state.context.isWebsiteLoading,
    isSessionLoaded: state.context.isSessionLoaded,
    isSessionLoading: state.context.isSessionLoading,
    areSettingsLoaded: state.context.areSettingsLoaded,
    areSettingsLoading: state.context.areSettingsLoading,
});

const setLocation = (location: Location): AnyAction => ({
    type: "Data/Pages/SetLocation",
    location,
});

const mapDispatchToProps = {
    loadCurrentWebsite,
    loadSession,
    loadSettings,
    setLocation,
    setPunchOutSessionId,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

class SessionLoader extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        setErrorHandler(handleError);

        const props = this.props;

        const parsedQuery = parseQueryString<{
            setcontextlanguagecode: string;
            setcontextcurrencycode: string;
            access_token: string;
        }>(props.location.search);

        props.setLocation(props.location);

        const punchOutSessionId = getCookie("PunchOutSessionId");
        if (punchOutSessionId) {
            props.setPunchOutSessionId({ punchOutSessionId });
        }

        if (!props.isWebsiteLoaded && !props.isWebsiteLoading) {
            props.loadCurrentWebsite();
        }

        if (!props.isSessionLoaded && !props.isSessionLoading) {
            props.loadSession({
                setContextLanguageCode: parsedQuery.setcontextlanguagecode,
                setContextCurrencyCode: parsedQuery.setcontextcurrencycode,
                onComplete: ({ apiResult }) => {
                    if (apiResult && parsedQuery.access_token) {
                        createSession({
                            userName: apiResult.userName,
                            accessToken: parsedQuery.access_token,
                        });
                    }
                },
            });
        }

        if (!props.areSettingsLoaded && !props.areSettingsLoading) {
            props.loadSettings();
        }
    }

    render() {
        const { isSessionLoaded, isWebsiteLoaded, areSettingsLoaded } = this.props;
        if (!isSessionLoaded || !isWebsiteLoaded || !areSettingsLoaded) {
            return null;
        }

        return this.props.children;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SessionLoader);
