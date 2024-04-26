import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import setReturnNotes from "@insite/client-framework/Store/Pages/RequestRma/Handlers/SetReturnNotes";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RequestRmaPageContext } from "@insite/content-library/Pages/RequestRmaPage";
import TextArea, { TextAreaProps } from "@insite/mobius/TextArea";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC, useContext } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    returnNotes: state.pages.requestRma.returnNotes,
});

const mapDispatchToProps = {
    setReturnNotes,
};

export interface RequestRmaNotesStyles {
    wrapper?: InjectableCss;
    notesTextArea?: TextAreaProps;
}

export const notesStyles: RequestRmaNotesStyles = {
    wrapper: {
        css: css`
            padding-bottom: 20px;
        `,
    },
};

const styles = notesStyles;

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const RequestRmaNotes: FC<Props> = ({ returnNotes, setReturnNotes }) => {
    const { value: order } = useContext(OrderStateContext);
    if (!order) {
        return null;
    }

    const changeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReturnNotes({ returnNotes: event.currentTarget.value });
    };

    return (
        <StyledWrapper {...styles.wrapper}>
            <TextArea
                label={translate("Return Notes")}
                value={returnNotes}
                rows={5}
                placeholder={translate("Enter your notes here")}
                onChange={changeHandler}
                {...styles.notesTextArea}
            />
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RequestRmaNotes),
    definition: {
        allowedContexts: [RequestRmaPageContext],
        group: "Return Request (RMA)",
        displayName: "Notes",
        fieldDefinitions: [],
    },
};

export default widgetModule;
