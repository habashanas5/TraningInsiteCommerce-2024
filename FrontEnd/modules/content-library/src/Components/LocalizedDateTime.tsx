/* eslint-disable spire/export-styles */
import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import isDate from "lodash/isDate";
import React, { FC } from "react";
import { connect } from "react-redux";

interface OwnProps {
    dateTime?: Date | null;
    options?: Intl.DateTimeFormatOptions;
}

const mapStateToProps = (state: ApplicationState) => ({
    language: state.context.session.language,
});

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

/**
 * This component will return a dateTime localized to the language of the session.
 * This component should only be used in cases where the dateTime cannot be generated server side.
 */
const LocalizedDateTime: FC<Props> = ({ dateTime, language, options }) => {
    if (!dateTime) {
        return null;
    }

    let dt = dateTime;
    if (!isDate(dt)) {
        dt = new Date(dt);
    }

    return (
        <>
            {getLocalizedDateTime({
                dateTime: dt,
                language,
                options,
            })}
        </>
    );
};

export default connect(mapStateToProps)(LocalizedDateTime);
