import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import applyPriceBreakDiscount from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/ApplyPriceBreakDiscount";
import removePriceBreak from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/RemovePriceBreak";
import updatePriceBreakMaxQty from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/UpdatePriceBreakMaxQty";
import updatePriceBreakPrice from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/UpdatePriceBreakPrice";
import updatePriceBreakStartQty from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/UpdatePriceBreakStartQty";
import translate from "@insite/client-framework/Translate";
import { BreakPriceRfqModel, QuoteLineModel, QuoteModel } from "@insite/client-framework/Types/ApiModels";
import DataTableCell, { DataTableCellProps } from "@insite/mobius/DataTable/DataTableCell";
import DataTableRow, { DataTableRowProps } from "@insite/mobius/DataTable/DataTableRow";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import Check from "@insite/mobius/Icons/Check";
import Percent from "@insite/mobius/Icons/Percent";
import XCircle from "@insite/mobius/Icons/XCircle";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Select, { SelectProps } from "@insite/mobius/Select";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React, { ChangeEvent, useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    quote: QuoteModel;
    quoteLine: QuoteLineModel;
    priceBreak: BreakPriceRfqModel;
    index: number;
    calculatorIsOpen: boolean;
    openCalculator: (index: number) => void;
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => ({
    validation: state.pages.rfqQuoteDetails.priceBreakValidations.find(o => o.index === ownProps.index),
});

const mapDispatchToProps = {
    updatePriceBreakStartQty,
    updatePriceBreakMaxQty,
    updatePriceBreakPrice,
    applyPriceBreakDiscount,
    removePriceBreak,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RfqQuoteDetailsQuoteLineCalculatorStyles {
    priceBreakRow?: DataTableRowProps;
    priceBreakWithCalculatorRow?: DataTableRowProps;
    qtyCell?: DataTableCellProps;
    qtyOrderedTextField?: TextFieldPresentationProps;
    startQtyTextField?: TextFieldPresentationProps;
    toLabelText?: TypographyPresentationProps;
    endQtyTextField?: TextFieldPresentationProps;
    priceCell?: DataTableCellProps;
    priceTextField?: TextFieldPresentationProps;
    buttonsCell?: DataTableCellProps;
    removePriceBreakLink?: LinkPresentationProps;
    removePriceBreakIcon?: IconPresentationProps;
    calculatorCell?: DataTableCellProps;
    calculatorContainer?: GridContainerProps;
    methodGridItem?: GridItemProps;
    methodSelect?: SelectProps;
    percentGridItem?: GridItemProps;
    percentTextField?: TextFieldPresentationProps;
    percentIcon?: IconPresentationProps;
    buttonsGridItem?: GridItemProps;
    applyDiscountLink?: LinkPresentationProps;
    applyDiscountIcon?: IconPresentationProps;
}

export const rfqQuoteDetailsQuoteLineCalculatorStyles: RfqQuoteDetailsQuoteLineCalculatorStyles = {
    priceBreakRow: {
        css: css`
            height: 60px;
            vertical-align: top;
        `,
        evenRowCss: css`
            background: transparent;
        `,
    },
    priceBreakWithCalculatorRow: {
        css: css`
            height: 140px;
            vertical-align: top;
        `,
        evenRowCss: css`
            background: transparent;
        `,
    },
    qtyCell: {
        css: css`
            height: 60px;
            border-bottom: none;
            padding-top: 10px;
        `,
    },
    startQtyTextField: {
        cssOverrides: {
            formField: css`
                width: 70px;
            `,
        },
    },
    toLabelText: {
        css: css`
            margin: 0 10px;
        `,
    },
    endQtyTextField: {
        cssOverrides: {
            formField: css`
                width: 70px;
            `,
        },
    },
    priceCell: {
        css: css`
            height: 60px;
            border-bottom: none;
            text-align: right;
            padding-top: 10px;
        `,
    },
    priceTextField: {
        cssOverrides: {
            formField: css`
                width: 100px;
            `,
            inputSelect: css`
                text-align: right;
            `,
        },
    },
    buttonsCell: {
        css: css`
            height: 60px;
            border-bottom: none;
            text-align: right;
            padding-top: 20px;
        `,
    },
    removePriceBreakIcon: { src: XCircle },
    calculatorCell: {
        css: css`
            display: block;
            position: absolute;
            width: 100%;
            height: 60px;
            padding-top: 10px;
            border-bottom: none;
            left: 0;
        `,
    },
    calculatorContainer: { gap: 20 },
    methodGridItem: { width: [5, 7, 6, 6, 6] },
    percentGridItem: {
        width: [5, 3, 4, 4, 4],
        align: "bottom",
    },
    percentIcon: {
        src: Percent,
        css: css`
            margin: 8px 4px;
        `,
    },
    percentTextField: {
        cssOverrides: {
            formField: css`
                width: 60px;
            `,
        },
    },
    buttonsGridItem: {
        width: 2,
        align: "bottom",
        css: css`
            justify-content: flex-end;
        `,
    },
    applyDiscountIcon: { src: Check },
};

const styles = rfqQuoteDetailsQuoteLineCalculatorStyles;

const RfqQuoteDetailsQuoteLineCalculatorRow = ({
    quote,
    quoteLine,
    priceBreak,
    index,
    calculatorIsOpen,
    openCalculator,
    validation,
    updatePriceBreakStartQty,
    updatePriceBreakMaxQty,
    updatePriceBreakPrice,
    applyPriceBreakDiscount,
    removePriceBreak,
}: Props) => {
    const [startQty, setStartQty] = useState(priceBreak.startQty);
    const [endQty, setEndQty] = useState(priceBreak.endQty ? "Max" : `${priceBreak.endQty}`);
    const [price, setPrice] = useState(priceBreak.price);
    const [calculationMethod, setCalculationMethod] = useState(quoteLine?.pricingRfq?.calculationMethods?.[0]);
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        setStartQty(priceBreak.startQty);
        setEndQty(!priceBreak.endQty ? "Max" : `${priceBreak.endQty}`);
        setPrice(priceBreak.price);
    }, [priceBreak]);

    const startQtyChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setStartQty(parseInt(event.currentTarget.value, 10));
    };

    const startQtyBlurHandler = () => {
        updatePriceBreakStartQty({ index, startQty: startQty || 0 });
    };

    const endQtyChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setEndQty(event.currentTarget.value);
    };

    const endQtyBlurHandler = () => {
        updatePriceBreakMaxQty({ index, maxQty: endQty });
    };

    const priceChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setPrice(parseFloat(event.currentTarget.value));
    };

    const priceFocusHandler = () => {
        openCalculator(index);
    };

    const priceBlurHandler = () => {
        updatePriceBreakPrice({ index, price: price || 0 });
    };

    const calculationMethodChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        setCalculationMethod(
            quoteLine?.pricingRfq?.calculationMethods?.find(o => o.name === event.currentTarget.value),
        );
    };

    const percentChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setPercent(parseFloat(event.currentTarget.value));
    };

    const percentBlurHandler = () => {
        setPercent(percent || 0);
    };

    const applyDiscountClickHandler = () => {
        if (!calculationMethod) {
            return;
        }

        applyPriceBreakDiscount({ index, calculationMethod: calculationMethod.value, percent });
    };

    const removePriceBreakClickHandler = () => {
        removePriceBreak({ index });
    };

    return (
        <DataTableRow {...(calculatorIsOpen ? styles.priceBreakWithCalculatorRow : styles.priceBreakRow)}>
            <DataTableCell {...styles.qtyCell}>
                {quote.isJobQuote ? (
                    <>
                        <VisuallyHidden>{translate("Quantity Ordered")}</VisuallyHidden>
                        <TextField {...styles.qtyOrderedTextField} value={quoteLine.qtyOrdered || 1} disabled />
                    </>
                ) : (
                    <>
                        <VisuallyHidden>{translate("From")}</VisuallyHidden>
                        <TextField
                            {...styles.startQtyTextField}
                            value={startQty}
                            type="number"
                            error={validation?.invalidQty}
                            onChange={startQtyChangeHandler}
                            onBlur={startQtyBlurHandler}
                        />
                        <Typography {...styles.toLabelText}>{translate("To")}</Typography>
                        <TextField
                            {...styles.endQtyTextField}
                            disabled={index !== quoteLine.pricingRfq!.priceBreaks!.length - 1}
                            value={endQty}
                            error={validation?.invalidQty}
                            onChange={endQtyChangeHandler}
                            onBlur={endQtyBlurHandler}
                        />
                    </>
                )}
            </DataTableCell>
            <DataTableCell {...styles.priceCell}>
                <VisuallyHidden>{translate("Price")}</VisuallyHidden>
                <TextField
                    {...styles.priceTextField}
                    value={price}
                    type="number"
                    error={validation?.priceRequired || validation?.invalidPrice}
                    onChange={priceChangeHandler}
                    onFocus={priceFocusHandler}
                    onBlur={priceBlurHandler}
                />
            </DataTableCell>
            <DataTableCell {...styles.buttonsCell}>
                {quoteLine.pricingRfq?.priceBreaks && quoteLine.pricingRfq.priceBreaks.length > 1 && !quote.isJobQuote && (
                    <Link {...styles.removePriceBreakLink} onClick={removePriceBreakClickHandler}>
                        <VisuallyHidden>{translate("Remove price break")}</VisuallyHidden>
                        <Icon {...styles.removePriceBreakIcon} />
                    </Link>
                )}
            </DataTableCell>
            {calculatorIsOpen && calculationMethod && (
                <CalculatorCell {...styles.calculatorCell} top={60 * (index + 2) - 20}>
                    <GridContainer {...styles.calculatorContainer}>
                        <GridItem {...styles.methodGridItem}>
                            <Select
                                {...styles.methodSelect}
                                label={translate("Discount By")}
                                value={calculationMethod?.name}
                                onChange={calculationMethodChangeHandler}
                            >
                                {quoteLine.pricingRfq?.calculationMethods?.map(cm => (
                                    <option key={cm.name} value={cm.name}>
                                        {cm.displayName}
                                    </option>
                                ))}
                            </Select>
                        </GridItem>
                        <GridItem {...styles.percentGridItem}>
                            <VisuallyHidden>{translate("Percent")}</VisuallyHidden>
                            <TextField
                                {...styles.percentTextField}
                                type="number"
                                min={calculationMethod?.minimumMargin}
                                max={
                                    calculationMethod && parseFloat(calculationMethod.maximumDiscount) > 0
                                        ? parseFloat(calculationMethod.maximumDiscount)
                                        : undefined
                                }
                                value={percent}
                                onChange={percentChangeHandler}
                                onBlur={percentBlurHandler}
                            />
                            <Icon {...styles.percentIcon} />
                        </GridItem>
                        <GridItem {...styles.buttonsGridItem}>
                            <Link {...styles.applyDiscountLink} onClick={applyDiscountClickHandler}>
                                <VisuallyHidden>{translate("Apply discount")}</VisuallyHidden>
                                <Icon {...styles.applyDiscountIcon} />
                            </Link>
                        </GridItem>
                    </GridContainer>
                </CalculatorCell>
            )}
        </DataTableRow>
    );
};

const CalculatorCell = ({ css: cellCss, top, children, ...otherProps }: DataTableCellProps & { top: number }) => {
    return (
        <DataTableCell
            css={css`
                ${cellCss}
                top: ${top}px;
            `}
            {...otherProps}
        >
            {children}
        </DataTableCell>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(RfqQuoteDetailsQuoteLineCalculatorRow);
