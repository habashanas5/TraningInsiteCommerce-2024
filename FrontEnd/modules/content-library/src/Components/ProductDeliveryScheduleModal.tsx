import useAppSelector from "@insite/client-framework/Common/Hooks/useAppSelector";
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import setDeliveryScheduleModalIsOpen from "@insite/client-framework/Store/Components/ProductDeliverySchedule/Handlers/SetDeliveryScheduleModalIsOpen";
import translate from "@insite/client-framework/Translate";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Checkbox, { CheckboxPresentationProps, CheckboxProps } from "@insite/mobius/Checkbox";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    extendedStyles?: ProductDeliveryScheduleModalStyles;
}

export interface ProductDeliveryScheduleModalStyles {
    modal?: ModalPresentationProps;
    container?: GridContainerProps;
    deliveryPeriodGridItem?: GridItemProps;
    deliveryPeriodSelect?: SelectPresentationProps;
    periodPerCycleGridItem?: GridItemProps;
    periodPerCycleTextField?: TextFieldPresentationProps;
    totalCyclesGridItem?: GridItemProps;
    totalCyclesTextField?: TextFieldPresentationProps;
    includeAllMonthGridItem?: GridItemProps;
    includeAllMonthCheckbox?: CheckboxPresentationProps;
    leftMonthsGridItem?: GridItemProps;
    rightMonthsGridItem?: GridItemProps;
    monthCheckbox?: CheckboxPresentationProps;
    cancelGridItem?: GridItemProps;
    saveGridItem?: GridItemProps;
    cancelButton?: ButtonPresentationProps;
    saveButton?: ButtonPresentationProps;
}

export const productDeliveryScheduleModalStyles: ProductDeliveryScheduleModalStyles = {
    modal: {
        size: 400,
        cssOverrides: {
            modalTitle: css`
                align-items: flex-start;
                padding: 15px 30px;
            `,
            modalContent: css`
                padding: 15px 30px 20px 30px;
            `,
        },
    },
    container: { gap: 20 },
    deliveryPeriodGridItem: { width: 12 },
    periodPerCycleGridItem: { width: 6 },
    totalCyclesGridItem: { width: 6 },
    includeAllMonthGridItem: { width: 12 },
    leftMonthsGridItem: {
        width: 6,
        css: css`
            flex-direction: column;
        `,
    },
    rightMonthsGridItem: {
        width: 6,
        css: css`
            flex-direction: column;
        `,
    },
    cancelGridItem: { width: 6 },
    cancelButton: {
        variant: "secondary",
        css: css`
            margin-top: 10px;
            width: 100%;
        `,
    },
    saveGridItem: { width: 6 },
    saveButton: {
        css: css`
            margin-top: 10px;
            width: 100%;
        `,
    },
};

const ProductDeliveryScheduleModal = ({ extendedStyles }: OwnProps) => {
    const modalIsOpen = useAppSelector(state => state.components.productDeliverySchedule.modalIsOpen);
    const subscription = useAppSelector(state => state.components.productDeliverySchedule.subscription);
    const onSave = useAppSelector(state => state.components.productDeliverySchedule.onSave);
    const dispatch = useDispatch();

    const [styles] = useState(() => mergeToNew(productDeliveryScheduleModalStyles, extendedStyles));

    const [cyclePeriod, setCyclePeriod] = useState(subscription?.subscriptionCyclePeriod || "Month");
    const [periodsPerCycle, setPeriodsPerCycle] = useState(subscription?.subscriptionPeriodsPerCycle);
    const [totalCycles, setTotalCycles] = useState(subscription?.subscriptionTotalCycles);
    const [allMonths, setAllMonths] = useState(subscription?.subscriptionAllMonths || false);
    const [january, setJanuary] = useState(subscription?.subscriptionJanuary || false);
    const [february, setFebruary] = useState(subscription?.subscriptionFebruary || false);
    const [march, setMarch] = useState(subscription?.subscriptionMarch || false);
    const [april, setApril] = useState(subscription?.subscriptionApril || false);
    const [may, setMay] = useState(subscription?.subscriptionMay || false);
    const [june, setJune] = useState(subscription?.subscriptionJune || false);
    const [july, setJuly] = useState(subscription?.subscriptionJuly || false);
    const [august, setAugust] = useState(subscription?.subscriptionAugust || false);
    const [september, setSeptember] = useState(subscription?.subscriptionSeptember || false);
    const [october, setOctober] = useState(subscription?.subscriptionOctober || false);
    const [november, setNovember] = useState(subscription?.subscriptionNovember || false);
    const [december, setDecember] = useState(subscription?.subscriptionDecember || false);

    useEffect(() => {
        if (!subscription) {
            return;
        }

        setCyclePeriod(subscription.subscriptionCyclePeriod || "Month");
        setPeriodsPerCycle(subscription.subscriptionPeriodsPerCycle);
        setTotalCycles(subscription.subscriptionTotalCycles);
        setAllMonths(subscription.subscriptionAllMonths);
        setJanuary(subscription.subscriptionJanuary);
        setFebruary(subscription.subscriptionFebruary);
        setMarch(subscription.subscriptionMarch);
        setApril(subscription.subscriptionApril);
        setMay(subscription.subscriptionMay);
        setJune(subscription.subscriptionJune);
        setJuly(subscription.subscriptionJuly);
        setAugust(subscription.subscriptionAugust);
        setSeptember(subscription.subscriptionSeptember);
        setOctober(subscription.subscriptionOctober);
        setNovember(subscription.subscriptionNovember);
        setDecember(subscription.subscriptionDecember);
    }, [subscription]);

    const closeModalHandler = () => {
        dispatch(setDeliveryScheduleModalIsOpen({ isOpen: false }));
    };

    const saveButtonClickHandler = () => {
        if (!subscription) {
            return;
        }

        onSave?.({
            subscriptionCyclePeriod: cyclePeriod,
            subscriptionPeriodsPerCycle: periodsPerCycle || 0,
            subscriptionTotalCycles: totalCycles || 0,
            subscriptionAllMonths: allMonths,
            subscriptionJanuary: january,
            subscriptionFebruary: february,
            subscriptionMarch: march,
            subscriptionApril: april,
            subscriptionMay: may,
            subscriptionJune: june,
            subscriptionJuly: july,
            subscriptionAugust: august,
            subscriptionSeptember: september,
            subscriptionOctober: october,
            subscriptionNovember: november,
            subscriptionDecember: december,
            subscriptionAddToInitialOrder: subscription.subscriptionAddToInitialOrder,
            subscriptionFixedPrice: subscription.subscriptionFixedPrice,
            subscriptionShipViaId: subscription.subscriptionShipViaId,
        });

        dispatch(setDeliveryScheduleModalIsOpen({ isOpen: false }));
    };

    const allMonthsChangeHandler: CheckboxProps["onChange"] = (_, value) => setAllMonths(value);
    const januaryChangeHandler: CheckboxProps["onChange"] = (_, value) => setJanuary(value);
    const februaryChangeHandler: CheckboxProps["onChange"] = (_, value) => setFebruary(value);
    const marchChangeHandler: CheckboxProps["onChange"] = (_, value) => setMarch(value);
    const aprilChangeHandler: CheckboxProps["onChange"] = (_, value) => setApril(value);
    const mayChangeHandler: CheckboxProps["onChange"] = (_, value) => setMay(value);
    const juneChangeHandler: CheckboxProps["onChange"] = (_, value) => setJune(value);
    const julyChangeHandler: CheckboxProps["onChange"] = (_, value) => setJuly(value);
    const augustChangeHandler: CheckboxProps["onChange"] = (_, value) => setAugust(value);
    const septemberChangeHandler: CheckboxProps["onChange"] = (_, value) => setSeptember(value);
    const octoberChangeHandler: CheckboxProps["onChange"] = (_, value) => setOctober(value);
    const novemberChangeHandler: CheckboxProps["onChange"] = (_, value) => setNovember(value);
    const decemberChangeHandler: CheckboxProps["onChange"] = (_, value) => setDecember(value);

    const periodsPerCycleChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.value) {
            const newValue = parseInt(event.currentTarget.value, 10);
            setPeriodsPerCycle(Number.isNaN(newValue) ? 0 : newValue);
        } else {
            setPeriodsPerCycle(undefined);
        }
    };
    const periodsPerCycleBlurHandler = () => {
        if (!periodsPerCycle || periodsPerCycle < 0) {
            setPeriodsPerCycle(0);
        }
    };

    const totalCyclesChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.value) {
            const newValue = parseInt(event.currentTarget.value, 10);
            setTotalCycles(Number.isNaN(newValue) ? 0 : newValue);
        } else {
            setTotalCycles(undefined);
        }
    };
    const totalCyclesBlurHandler = () => {
        if (!totalCycles || totalCycles < 0) {
            setTotalCycles(0);
        }
    };

    const cyclePeriodChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCyclePeriod(event.currentTarget.value);
    };

    return (
        <Modal
            {...styles.modal}
            headline={translate("Delivery Schedule")}
            isOpen={modalIsOpen}
            handleClose={closeModalHandler}
        >
            <GridContainer {...styles.container} data-test-selector="deliveryScheduleModal">
                <GridItem {...styles.deliveryPeriodGridItem}>
                    <Select
                        {...styles.deliveryPeriodSelect}
                        label={translate("Delivery Period")}
                        value={cyclePeriod}
                        onChange={cyclePeriodChangeHandler}
                    >
                        <option value="Day">{translate("Day")}</option>
                        <option value="Month">{translate("Month")}</option>
                    </Select>
                </GridItem>
                <GridItem {...styles.periodPerCycleGridItem}>
                    <TextField
                        {...styles.periodPerCycleTextField}
                        label={translate("Periods Per Cycle")}
                        value={periodsPerCycle}
                        onChange={periodsPerCycleChangeHandler}
                        onBlur={periodsPerCycleBlurHandler}
                        data-test-selector="deliverySchedule_periodsPerCycle"
                    />
                </GridItem>
                <GridItem {...styles.totalCyclesGridItem}>
                    <TextField
                        {...styles.totalCyclesTextField}
                        label={translate("Total # of Cycles")}
                        value={totalCycles}
                        onChange={totalCyclesChangeHandler}
                        onBlur={totalCyclesBlurHandler}
                        data-test-selector="deliverySchedule_totalCycles"
                    />
                </GridItem>
                <GridItem {...styles.includeAllMonthGridItem}>
                    <Checkbox {...styles.includeAllMonthCheckbox} checked={allMonths} onChange={allMonthsChangeHandler}>
                        {translate("Include All Months")}
                    </Checkbox>
                </GridItem>
                {!allMonths && (
                    <>
                        <GridItem {...styles.leftMonthsGridItem}>
                            <Checkbox {...styles.monthCheckbox} checked={january} onChange={januaryChangeHandler}>
                                {translate("January")}
                            </Checkbox>
                            <Checkbox {...styles.monthCheckbox} checked={february} onChange={februaryChangeHandler}>
                                {translate("February")}
                            </Checkbox>
                            <Checkbox {...styles.monthCheckbox} checked={march} onChange={marchChangeHandler}>
                                {translate("March")}
                            </Checkbox>
                            <Checkbox {...styles.monthCheckbox} checked={april} onChange={aprilChangeHandler}>
                                {translate("April")}
                            </Checkbox>
                            <Checkbox {...styles.monthCheckbox} checked={may} onChange={mayChangeHandler}>
                                {translate("May")}
                            </Checkbox>
                            <Checkbox {...styles.monthCheckbox} checked={june} onChange={juneChangeHandler}>
                                {translate("June")}
                            </Checkbox>
                        </GridItem>
                        <GridItem {...styles.rightMonthsGridItem}>
                            <Checkbox {...styles.monthCheckbox} checked={july} onChange={julyChangeHandler}>
                                {translate("July")}
                            </Checkbox>
                            <Checkbox {...styles.monthCheckbox} checked={august} onChange={augustChangeHandler}>
                                {translate("August")}
                            </Checkbox>
                            <Checkbox {...styles.monthCheckbox} checked={september} onChange={septemberChangeHandler}>
                                {translate("September")}
                            </Checkbox>
                            <Checkbox {...styles.monthCheckbox} checked={october} onChange={octoberChangeHandler}>
                                {translate("October")}
                            </Checkbox>
                            <Checkbox {...styles.monthCheckbox} checked={november} onChange={novemberChangeHandler}>
                                {translate("November")}
                            </Checkbox>
                            <Checkbox {...styles.monthCheckbox} checked={december} onChange={decemberChangeHandler}>
                                {translate("December")}
                            </Checkbox>
                        </GridItem>
                    </>
                )}
                <GridItem {...styles.cancelGridItem}>
                    <Button
                        {...styles.cancelButton}
                        onClick={closeModalHandler}
                        data-test-selector="deliverySchedule_cancel"
                    >
                        {translate("Cancel")}
                    </Button>
                </GridItem>
                <GridItem {...styles.saveGridItem}>
                    <Button
                        {...styles.saveButton}
                        onClick={saveButtonClickHandler}
                        data-test-selector="deliverySchedule_save"
                    >
                        {translate("Save")}
                    </Button>
                </GridItem>
            </GridContainer>
        </Modal>
    );
};

export default ProductDeliveryScheduleModal;
