import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import updateWishListSchedule from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/UpdateWishListSchedule";
import translate from "@insite/client-framework/Translate";
import { WishListEmailScheduleModel, WishListModel } from "@insite/client-framework/Types/ApiModels";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Checkbox, { CheckboxPresentationProps, CheckboxProps } from "@insite/mobius/Checkbox";
import DatePicker, { DatePickerPresentationProps, DatePickerState } from "@insite/mobius/DatePicker";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps, GridOffset } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Radio, { RadioProps, RadioStyle } from "@insite/mobius/Radio";
import RadioGroup, { RadioGroupProps } from "@insite/mobius/RadioGroup";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import TextArea, { TextAreaProps } from "@insite/mobius/TextArea";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    wishList: WishListModel;
    isOpen: boolean;
    handleClose(): void;
    extendedStyles?: ScheduleReminderModalStyles;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const mapStateToProps = (state: ApplicationState) => ({});

const mapDispatchToProps = {
    updateWishListSchedule,
};

export interface ScheduleReminderModalStyles {
    modal?: ModalPresentationProps;
    headlineWraper?: InjectableCss;
    titleText?: TypographyPresentationProps;
    hintText?: TypographyPresentationProps;
    contentContainer?: GridContainerProps;
    cancelConfirmationGridItem?: GridItemProps;
    cancelConfirmationText?: TypographyPresentationProps;
    cancelButtonsGridItem?: GridItemProps;
    dismissCancelButton?: ButtonPresentationProps;
    confirmCancelButton?: ButtonPresentationProps;
    topRowGridItem?: GridItemProps;
    frequencyRadioGroup?: RadioGroupProps;
    weeklyRadio?: RadioProps;
    monthlyRadio?: RadioProps;
    middleRowGridItem?: GridItemProps;
    middleRowContainer?: GridContainerProps;
    middleRowLeftColumnGridItem?: GridItemProps;
    leftColumnContainer?: GridContainerProps;
    intervalGridItem?: GridItemProps;
    intervalTextField?: TextFieldPresentationProps;
    dayGridItem?: GridItemProps;
    daySelect?: SelectPresentationProps;
    startDateGridItem?: GridItemProps;
    startDatePicker?: DatePickerPresentationProps;
    endDateGridItem?: GridItemProps;
    endDatePicker?: DatePickerPresentationProps;
    hasEndDateCheckbox?: CheckboxPresentationProps;
    middleRowRightColumnGridItem?: GridItemProps;
    messageTextArea?: TextAreaProps;
    bottomRowGridItem?: GridItemProps;
    buttonsContainer?: GridContainerProps;
    stopButtonGridItem?: GridItemProps;
    stopButton?: ButtonPresentationProps;
    cancelButtonGridItem?: GridItemProps;
    cancelButton?: ButtonPresentationProps;
    scheduleButtonGridItem?: GridItemProps;
    scheduleButton?: ButtonPresentationProps;
}

export const scheduleReminderModalStyles: ScheduleReminderModalStyles = {
    modal: {
        cssOverrides: {
            modalTitle: css`
                align-items: flex-start;
                padding: 15px 30px;
            `,
            modalContent: css`
                padding: 20px 30px;
            `,
        },
    },
    headlineWraper: {
        css: css`
            display: flex;
            flex-direction: column;
        `,
    },
    titleText: {
        variant: "h4",
        css: css`
            margin-bottom: 0;
        `,
    },
    hintText: {
        css: css`
            margin-top: 5px;
        `,
    },
    contentContainer: { gap: 20 },
    cancelConfirmationGridItem: { width: 12 },
    cancelButtonsGridItem: {
        width: 12,
        css: css`
            justify-content: flex-end;
        `,
    },
    dismissCancelButton: {
        variant: "secondary",
        css: css`
            margin-right: 20px;
        `,
    },
    confirmCancelButton: { variant: "primary" },
    topRowGridItem: { width: 12 },
    frequencyRadioGroup: {
        css: css`
            display: block;
            & > ${RadioStyle} {
                display: inline-block;
                margin-top: 0;
            }
        `,
    },
    weeklyRadio: {
        css: css`
            & + & {
                margin-top: 0;
                margin-left: 20px;
            }
            input {
                margin-left: 0;
            }
        `,
    },
    monthlyRadio: {
        css: css`
            & + & {
                margin-top: 0;
                margin-left: 20px;
            }
        `,
    },
    middleRowGridItem: { width: 12 },
    middleRowContainer: { gap: 20 },
    middleRowLeftColumnGridItem: { width: [12, 12, 6, 6, 6] },
    middleRowRightColumnGridItem: { width: [12, 12, 6, 6, 6] },
    messageTextArea: {
        cssOverrides: {
            inputSelect: css`
                height: 130px;
                resize: none;
            `,
        },
    },
    leftColumnContainer: { gap: 20 },
    intervalGridItem: { width: [12, 6, 6, 6, 6] },
    dayGridItem: { width: [12, 6, 6, 6, 6] },
    startDateGridItem: {
        width: [12, 6, 6, 6, 6],
        css: css`
            flex-direction: column;
            align-items: initial;
        `,
    },
    endDateGridItem: {
        width: [12, 6, 6, 6, 6],
        css: css`
            flex-direction: column;
            align-items: initial;
        `,
    },
    hasEndDateCheckbox: {
        css: css`
            margin-top: 15px;
        `,
    },
    bottomRowGridItem: {
        width: 12,
        css: css`
            justify-content: flex-end;
        `,
    },
    buttonsContainer: {
        gap: 20,
        css: css`
            & ${GridOffset} {
                justify-content: flex-end;
            }
        `,
    },
    stopButtonGridItem: { width: [12, 6, 8, 8, 8] },
    stopButton: {
        variant: "secondary",
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            width: 100%;
                        `,
                    ],
                    "max",
                )}
        `,
    },
    cancelButtonGridItem: {
        width: [12, 3, 2, 2, 2],
        css: css`
            justify-content: flex-end;
        `,
    },
    cancelButton: {
        variant: "secondary",
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            width: 100%;
                        `,
                    ],
                    "max",
                )}
        `,
    },
    scheduleButtonGridItem: {
        width: [12, 3, 2, 2, 2],
        css: css`
            justify-content: flex-end;
        `,
    },
    scheduleButton: {
        variant: "primary",
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            width: 100%;
                        `,
                    ],
                    "max",
                )}
        `,
    },
    startDatePicker: {
        calendarIconProps: {
            css: css`
                width: 28px !important;
                padding: 8px 4px !important;
            `,
        },
        clearIconProps: {
            css: css`
                width: 28px !important;
                padding: 8px 4px !important;
            `,
        },
    },
    endDatePicker: {
        calendarIconProps: {
            css: css`
                width: 28px !important;
                padding: 8px 4px !important;
            `,
        },
        clearIconProps: {
            css: css`
                width: 28px !important;
                padding: 8px 4px !important;
            `,
        },
    },
};

const styles = scheduleReminderModalStyles;

const ScheduleReminderModal: React.FC<Props> = ({
    wishList,
    isOpen,
    handleClose,
    updateWishListSchedule,
    extendedStyles,
}) => {
    const toasterContext = React.useContext(ToasterContext);
    const [styles] = React.useState(() => mergeToNew(scheduleReminderModalStyles, extendedStyles));

    const { schedule, sendDayOfMonthPossibleValues, sendDayOfWeekPossibleValues } = wishList;

    const [repeatPeriod, setRepeatPeriod] = React.useState(schedule?.repeatPeriod || "Weekly");
    const repeatPeriodChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRepeatPeriod(event.currentTarget.value);
    };

    const [repeatInterval, setRepeatInterval] = React.useState<number | undefined>(schedule?.repeatInterval || 1);
    const repeatIntervalChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.value) {
            setRepeatInterval(parseInt(event.currentTarget.value, 10));
        } else {
            setRepeatInterval(undefined);
        }
    };
    const repeatIntervalBlurHandler = () => {
        if (!repeatInterval || repeatInterval < 0) {
            setRepeatInterval(1);
        }
    };

    const [sendDayOfWeek, setSendDayOfWeek] = React.useState(
        sendDayOfWeekPossibleValues?.find(o => o.key === schedule?.sendDayOfWeek) || sendDayOfWeekPossibleValues?.[0],
    );
    const [sendDayOfMonth, setsendDayOfMonth] = React.useState(
        sendDayOfMonthPossibleValues?.find(o => o.key === schedule?.sendDayOfMonth) ||
            sendDayOfMonthPossibleValues?.[0],
    );
    const sendDayChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (repeatPeriod === "Weekly") {
            setSendDayOfWeek(
                sendDayOfWeekPossibleValues?.find(o => o.key === event.currentTarget.value) ||
                    sendDayOfWeekPossibleValues?.[0],
            );
        } else {
            setsendDayOfMonth(
                sendDayOfMonthPossibleValues?.find(o => o.key.toString() === event.currentTarget.value) ||
                    sendDayOfMonthPossibleValues?.[0],
            );
        }
    };

    const [startDate, setStartDate] = React.useState<Date | undefined>(
        schedule?.startDate ? new Date(schedule.startDate.toString().split("T")[0]) : new Date(),
    );
    const startDateChangeHandler = ({ selectedDay }: DatePickerState) => {
        setStartDate(selectedDay || new Date());
        if (selectedDay && endDate && selectedDay > endDate) {
            setEndDate(undefined);
            setHasEndDate(false);
        }
    };

    const [hasEndDate, setHasEndDate] = React.useState(!!schedule?.endDate);
    const hasEndDateChangeHandler: CheckboxProps["onChange"] = (_, value) => {
        if (hasEndDate) {
            setEndDate(undefined);
            setHasEndDate(false);
        }
    };

    const [endDate, setEndDate] = React.useState(
        schedule?.endDate ? new Date(schedule.endDate.toString().split("T")[0]) : undefined,
    );
    const endDateChangeHandler = ({ selectedDay }: DatePickerState) => {
        setEndDate(selectedDay);
        setHasEndDate(!!selectedDay);
    };

    const [message, setMessage] = React.useState(schedule?.message || "");
    const messageChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value.length > 300 ? event.target.value.slice(0, 300) : event.target.value);
    };

    const [inProgress, setInProgress] = React.useState(false);

    const scheduleClickHandler = () => {
        setInProgress(true);

        const scheduleToUpdate = wishList.schedule ? { ...wishList.schedule } : ({} as WishListEmailScheduleModel);
        scheduleToUpdate.repeatPeriod = repeatPeriod;
        scheduleToUpdate.repeatInterval = repeatInterval || 1;
        if (sendDayOfWeek) {
            scheduleToUpdate.sendDayOfWeek = sendDayOfWeek.key;
        }
        if (sendDayOfMonth) {
            scheduleToUpdate.sendDayOfMonth = sendDayOfMonth.key;
        }
        scheduleToUpdate.startDate = startDate as any;
        if (endDate) {
            scheduleToUpdate.endDate = endDate as any;
        } else {
            scheduleToUpdate.endDate = null;
        }
        scheduleToUpdate.message = message;

        updateWishListSchedule({
            wishListId: wishList.id,
            schedule: scheduleToUpdate,
            onSuccess: () => {
                handleClose();
                toasterContext.addToast({ body: siteMessage("Lists_Schedule_Saved"), messageType: "success" });
            },
            onComplete(resultProps) {
                if (resultProps.result?.wishList) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.();
                }
            },
        });
    };

    const [cancelingReminder, setCancelingReminder] = React.useState(false);
    const stopClickHandler = () => {
        setCancelingReminder(true);
    };

    const dismissCancelClickHandler = () => {
        setCancelingReminder(false);
    };

    const confirmCancelClickHandler = () => {
        setInProgress(true);

        updateWishListSchedule({
            wishListId: wishList.id,
            schedule: null,
            onSuccess: () => {
                handleClose();
                toasterContext.addToast({ body: siteMessage("Lists_Schedule_Canceled"), messageType: "success" });
            },
            onComplete(resultProps) {
                if (resultProps.result?.wishList) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.();
                }
            },
        });
    };

    const resetFields = () => {
        setRepeatPeriod(schedule?.repeatPeriod || "Weekly");
        setRepeatInterval(schedule?.repeatInterval || 1);
        setSendDayOfWeek(
            sendDayOfWeekPossibleValues?.find(o => o.key === schedule?.sendDayOfWeek) ||
                sendDayOfWeekPossibleValues?.[0],
        );
        setsendDayOfMonth(
            sendDayOfMonthPossibleValues?.find(o => o.key === schedule?.sendDayOfMonth) ||
                sendDayOfMonthPossibleValues?.[0],
        );
        setStartDate(schedule?.startDate ? new Date(schedule.startDate.toString().split("T")[0]) : new Date());
        setEndDate(schedule?.endDate ? new Date(schedule.endDate.toString().split("T")[0]) : undefined);
        setHasEndDate(!!schedule?.endDate);
        setMessage(schedule?.message || "");
    };

    const afterCloseHandler = () => {
        setInProgress(false);
        setCancelingReminder(false);
        resetFields();
    };

    React.useEffect(() => {
        resetFields();
    }, [wishList.schedule]);

    const headline = (
        <StyledWrapper {...styles.headlineWraper}>
            <Typography {...styles.titleText}>
                {cancelingReminder ? "Stop Email Reminder" : "Schedule Email Reminder"}
            </Typography>
            {!cancelingReminder && (
                <Typography {...styles.hintText}>
                    {siteMessage(schedule ? "Lists_Schedule_Edit_Or_Cancel" : "Lists_Send_Reminders")}
                </Typography>
            )}
        </StyledWrapper>
    );

    const options =
        repeatPeriod === "Weekly"
            ? sendDayOfWeekPossibleValues?.map((pv: { key: string; value: string }) => (
                  <option key={pv.key}>{pv.value}</option>
              ))
            : sendDayOfMonthPossibleValues?.map((pv: { key: number; value: string }) => (
                  <option key={pv.key}>{pv.value}</option>
              ));

    return (
        <Modal
            {...styles.modal}
            headline={headline}
            isOpen={isOpen}
            handleClose={handleClose}
            onAfterClose={afterCloseHandler}
        >
            {cancelingReminder ? (
                <GridContainer {...styles.contentContainer}>
                    <GridItem {...styles.cancelConfirmationGridItem}>
                        <Typography {...styles.cancelConfirmationText}>
                            {siteMessage("Lists_Schedule_Cancel_Confirmation")}
                        </Typography>
                    </GridItem>
                    <GridItem {...styles.cancelButtonsGridItem}>
                        <Button {...styles.dismissCancelButton} onClick={dismissCancelClickHandler}>
                            {translate("Cancel")}
                        </Button>
                        <Button
                            {...styles.confirmCancelButton}
                            onClick={confirmCancelClickHandler}
                            disabled={inProgress}
                        >
                            {translate("Confirm")}
                        </Button>
                    </GridItem>
                </GridContainer>
            ) : (
                <GridContainer {...styles.contentContainer}>
                    <GridItem {...styles.topRowGridItem}>
                        <RadioGroup
                            {...styles.frequencyRadioGroup}
                            label={translate("Frequency")}
                            value={repeatPeriod}
                            onChangeHandler={repeatPeriodChangeHandler}
                        >
                            <Radio {...styles.weeklyRadio} value="Weekly">
                                {translate("Weekly")}
                            </Radio>
                            <Radio {...styles.monthlyRadio} value="Monthly">
                                {translate("Monthly")}
                            </Radio>
                        </RadioGroup>
                    </GridItem>
                    <GridItem {...styles.middleRowGridItem}>
                        <GridContainer {...styles.middleRowContainer}>
                            <GridItem {...styles.middleRowLeftColumnGridItem}>
                                <GridContainer {...styles.leftColumnContainer}>
                                    <GridItem {...styles.intervalGridItem}>
                                        <TextField
                                            {...styles.intervalTextField}
                                            label={translate("Interval")}
                                            type="number"
                                            min="1"
                                            value={repeatInterval}
                                            onChange={repeatIntervalChangeHandler}
                                            onBlur={repeatIntervalBlurHandler}
                                        />
                                    </GridItem>
                                    <GridItem {...styles.dayGridItem}>
                                        <Select
                                            {...styles.daySelect}
                                            label={translate("Day")}
                                            value={(repeatPeriod === "Weekly" ? sendDayOfWeek : sendDayOfMonth)?.key}
                                            onChange={sendDayChangeHandler}
                                        >
                                            {options}
                                        </Select>
                                    </GridItem>
                                    <GridItem {...styles.startDateGridItem}>
                                        <DatePicker
                                            {...styles.startDatePicker}
                                            label={translate("Start Date")}
                                            selectedDay={startDate}
                                            onDayChange={startDateChangeHandler}
                                        />
                                    </GridItem>
                                    <GridItem {...styles.endDateGridItem}>
                                        <DatePicker
                                            {...styles.endDatePicker}
                                            label={translate("End Date")}
                                            selectedDay={endDate}
                                            dateTimePickerProps={{ minDate: startDate }}
                                            onDayChange={endDateChangeHandler}
                                        />
                                        <Checkbox
                                            {...styles.hasEndDateCheckbox}
                                            checked={!hasEndDate}
                                            onChange={hasEndDateChangeHandler}
                                        >
                                            {translate("No end date")}
                                        </Checkbox>
                                    </GridItem>
                                </GridContainer>
                            </GridItem>
                            <GridItem {...styles.middleRowRightColumnGridItem}>
                                <TextArea
                                    {...styles.messageTextArea}
                                    label={translate("Message / Notes")}
                                    value={message}
                                    onChange={messageChangeHandler}
                                    hint={`${300 - message.length} ${translate("characters left")}`}
                                />
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    <GridItem {...styles.bottomRowGridItem}>
                        <GridContainer {...styles.buttonsContainer}>
                            {schedule && (
                                <GridItem {...styles.stopButtonGridItem}>
                                    <Button {...styles.stopButton} onClick={stopClickHandler}>
                                        {translate("Stop Reminder")}
                                    </Button>
                                </GridItem>
                            )}
                            <GridItem {...styles.cancelButtonGridItem}>
                                <Button {...styles.cancelButton} onClick={handleClose}>
                                    {translate("Cancel")}
                                </Button>
                            </GridItem>
                            <GridItem {...styles.scheduleButtonGridItem}>
                                <Button {...styles.scheduleButton} onClick={scheduleClickHandler} disabled={inProgress}>
                                    {translate("Schedule")}
                                </Button>
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                </GridContainer>
            )}
        </Modal>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleReminderModal);
