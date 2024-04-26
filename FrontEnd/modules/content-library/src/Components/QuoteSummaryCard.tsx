import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";
import { Session } from "@insite/client-framework/Services/SessionService";
import translate from "@insite/client-framework/Translate";
import { QuoteModel, QuoteSettingsModel } from "@insite/client-framework/Types/ApiModels";
import RfqQuoteDetailsPageTypeLink from "@insite/content-library/Components/RfqQuoteDetailsPageTypeLink";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import React, { FC } from "react";
import { css } from "styled-components";

interface OwnProps {
    quote: QuoteModel;
    session: Session;
    quoteSettings: QuoteSettingsModel;
    extendedStyles?: QuoteSummaryCardStyles;
}

type Props = OwnProps;

export interface QuoteSummaryCardStyles {
    quoteSummaryCardGridItem?: GridItemProps;
    container?: GridContainerProps;
    quoteDetailsLinkGridItem?: GridItemProps;
    typeGridItem?: GridItemProps;
    typeHeadingAndText?: SmallHeadingAndTextStyles;
    statusGridItem?: GridItemProps;
    statusHeadingAndText?: SmallHeadingAndTextStyles;
    orderDateGridItem?: GridItemProps;
    orderDateHeadingAndText?: SmallHeadingAndTextStyles;
    expirationDateGridItem?: GridItemProps;
    expirationDateHeadingAndText?: SmallHeadingAndTextStyles;
    salesRepGridItem?: GridItemProps;
    salesRepHeadingAndText?: SmallHeadingAndTextStyles;
    userNameGridItem?: GridItemProps;
    userNameHeadingAndText?: SmallHeadingAndTextStyles;
    customerGridItem?: GridItemProps;
    customerHeadingAndText?: SmallHeadingAndTextStyles;
    shipToAddressGridItem?: GridItemProps;
    shipToAddressHeadingAndText?: SmallHeadingAndTextStyles;
}

export const quoteSummaryCardStyles: QuoteSummaryCardStyles = {
    quoteSummaryCardGridItem: {
        width: 12,
        css: css`
            padding: 0 20px;
            max-width: 500px;
        `,
    },
    container: {
        gap: 5,
    },
    quoteDetailsLinkGridItem: { width: 12 },
    typeGridItem: { width: 6 },
    statusGridItem: { width: 6 },
    orderDateGridItem: { width: 6 },
    expirationDateGridItem: { width: 6 },
    salesRepGridItem: { width: 6 },
    userNameGridItem: { width: 6 },
    customerGridItem: { width: 6 },
    shipToAddressGridItem: { width: 6 },
};

const QuoteSummaryCard: FC<Props> = ({ quote, session, quoteSettings, extendedStyles }) => {
    const [styles] = React.useState(() => mergeToNew(quoteSummaryCardStyles, extendedStyles));

    const orderDateDisplay = getLocalizedDateTime({
        dateTime: quote.orderDate!,
        language: session.language,
        options: {
            year: "numeric",
            month: "numeric",
            day: "numeric",
        },
    });

    let expirationDateDisplay = "";
    if (quote.expirationDate) {
        expirationDateDisplay = getLocalizedDateTime({
            dateTime: quote.expirationDate,
            language: session.language,
            options: {
                year: "numeric",
                month: "numeric",
                day: "numeric",
            },
        });
    }
    const customerDisplay = `${quote.customerNumber} - ${quote.customerName}`;

    return (
        <GridItem {...styles.quoteSummaryCardGridItem} data-test-selector="recentQuotes">
            <GridContainer {...styles.container}>
                <GridItem {...styles.quoteDetailsLinkGridItem}>
                    <RfqQuoteDetailsPageTypeLink title={quote.quoteNumber} quoteId={quote.id} />
                </GridItem>
                {quoteSettings.jobQuoteEnabled && (
                    <GridItem {...styles.typeGridItem}>
                        <SmallHeadingAndText
                            heading={translate("Type")}
                            text={quote.typeDisplay}
                            extendedStyles={styles.typeHeadingAndText}
                        />
                    </GridItem>
                )}
                <GridItem {...styles.statusGridItem}>
                    <SmallHeadingAndText
                        heading={translate("Status")}
                        text={quote.statusDisplay}
                        extendedStyles={styles.statusHeadingAndText}
                    />
                </GridItem>
                <GridItem {...styles.orderDateGridItem}>
                    <SmallHeadingAndText
                        heading={translate("Requested")}
                        text={orderDateDisplay}
                        extendedStyles={styles.orderDateHeadingAndText}
                    />
                </GridItem>
                <GridItem {...styles.expirationDateGridItem}>
                    {expirationDateDisplay && (
                        <SmallHeadingAndText
                            heading={translate("Expires")}
                            text={expirationDateDisplay}
                            extendedStyles={styles.expirationDateHeadingAndText}
                        />
                    )}
                </GridItem>
                {session.isSalesPerson && (
                    <>
                        <GridItem {...styles.salesRepGridItem}>
                            <SmallHeadingAndText
                                heading={translate("Sales Rep")}
                                text={quote.salespersonName}
                                extendedStyles={styles.salesRepHeadingAndText}
                            />
                        </GridItem>
                        <GridItem {...styles.userNameGridItem}>
                            <SmallHeadingAndText
                                heading={translate("User")}
                                text={quote.userName}
                                extendedStyles={styles.userNameHeadingAndText}
                            />
                        </GridItem>
                    </>
                )}
                <GridItem {...styles.customerGridItem}>
                    <SmallHeadingAndText
                        heading={translate("Customer")}
                        text={customerDisplay}
                        extendedStyles={styles.customerHeadingAndText}
                    />
                </GridItem>
                {!session.isSalesPerson && (
                    <GridItem {...styles.shipToAddressGridItem}>
                        <SmallHeadingAndText
                            heading={translate("Ship To / Pick Up")}
                            text={quote.shipToFullAddress}
                            extendedStyles={styles.shipToAddressHeadingAndText}
                        />
                    </GridItem>
                )}
            </GridContainer>
        </GridItem>
    );
};

export default QuoteSummaryCard;
