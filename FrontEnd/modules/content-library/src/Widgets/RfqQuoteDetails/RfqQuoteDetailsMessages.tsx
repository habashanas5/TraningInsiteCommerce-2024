import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getQuoteState } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import sendMessage from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/SendMessage";
import translate from "@insite/client-framework/Translate";
import { MessageModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import { RfqQuoteDetailsPageContext } from "@insite/content-library/Pages/RfqQuoteDetailsPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps, GridOffset } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps, GridItemStyle } from "@insite/mobius/GridItem";
import TextArea, { TextAreaProps } from "@insite/mobius/TextArea";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import sortBy from "lodash/sortBy";
import React, { ChangeEvent, useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    quoteState: getQuoteState(state, state.pages.rfqQuoteDetails.quoteId),
});

const mapDispatchToProps = {
    sendMessage,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RfqQuoteDetailsMessagesStyles {
    mainWrapper?: InjectableCss;
    titleText?: TypographyPresentationProps;
    messageTextArea?: TextAreaProps;
    sendButton?: ButtonPresentationProps;
    messagesContainer?: GridContainerProps;
    messageGridItem?: GridItemProps;
    userNameText?: TypographyPresentationProps;
    messageDateText?: TypographyPresentationProps;
    messageBodyText?: TypographyPresentationProps;
}

export const rfqQuoteDetailsMessagesStyles: RfqQuoteDetailsMessagesStyles = {
    mainWrapper: {
        css: css`
            display: flex;
            flex-direction: column;
            background-color: ${getColor("common.accent")};
            padding: 10px 20px;
        `,
    },
    titleText: {
        variant: "h3",
    },
    messageTextArea: {
        css: css`
            min-width: 100%;
            max-width: 100%;
            min-height: 50px;
        `,
        cssOverrides: {
            formField: css`
                margin-bottom: 20px;
            `,
        },
    },
    messagesContainer: {
        gap: 20,
        css: css`
            ${GridOffset} {
                margin-top: 20px;
            }
            ${GridItemStyle} {
                margin: 0 10px;
                padding: 10px 0;
                border-top: 1px solid ${getColor("common.border")};
            }
        `,
    },
    messageGridItem: {
        width: 12,
        css: css`
            flex-direction: column;
        `,
    },
    userNameText: {
        weight: "bold",
    },
    messageBodyText: {
        css: css`
            margin-top: 10px;
        `,
    },
};

const styles = rfqQuoteDetailsMessagesStyles;

const RfqQuoteDetailsMessages = ({ quoteState, sendMessage }: Props) => {
    const quote = quoteState.value;
    const [message, setMessage] = useState("");
    const messageChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.currentTarget.value);
    };

    const [sortedMessages, setSortedMessages] = useState<MessageModel[]>([]);
    useEffect(() => {
        if (!quote) {
            return;
        }

        setSortedMessages(sortBy(quote.messageCollection || [], ["createdDate"]).reverse());
    }, [quote?.messageCollection]);

    const sendClickHandler = () => {
        if (!quote) {
            return;
        }

        sendMessage({ quote, message });
        setMessage("");
    };

    if (!quote) {
        return null;
    }

    return (
        <StyledWrapper {...styles.mainWrapper}>
            <Typography {...styles.titleText}>{translate("Messages")}</Typography>
            <TextArea
                {...styles.messageTextArea}
                label={translate("Write a Message")}
                placeholder={siteMessage("Rfq_GhostMessage") as string}
                value={message}
                onChange={messageChangeHandler}
            />
            <Button {...styles.sendButton} disabled={!message.trim()} onClick={sendClickHandler}>
                {translate("Send Message")}
            </Button>
            <GridContainer {...styles.messagesContainer}>
                {sortedMessages.map(message => (
                    <GridItem key={message.createdDate.toString()} {...styles.messageGridItem}>
                        <Typography {...styles.userNameText}>{message.displayName}</Typography>
                        <Typography {...styles.messageDateText}>
                            <LocalizedDateTime
                                dateTime={message.createdDate}
                                options={{
                                    year: "numeric",
                                    month: "numeric",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                }}
                            />
                        </Typography>
                        <Typography {...styles.messageBodyText}>{message.body}</Typography>
                    </GridItem>
                ))}
            </GridContainer>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RfqQuoteDetailsMessages),
    definition: {
        displayName: "Messages",
        allowedContexts: [RfqQuoteDetailsPageContext],
        fieldDefinitions: [],
        group: "RFQ Quote Details",
    },
};

export default widgetModule;
