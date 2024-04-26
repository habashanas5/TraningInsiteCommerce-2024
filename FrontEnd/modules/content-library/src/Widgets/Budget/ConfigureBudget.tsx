import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import { getBudgetCalendarsDataView } from "@insite/client-framework/Store/Data/BudgetCalendars/BudgetCalendarsSelectors";
import {
    BudgetEnforcementLevel,
    BudgetPeriodType,
} from "@insite/client-framework/Store/Pages/BudgetManagement/BudgetManagementReducer";
import saveBudgetConfiguration from "@insite/client-framework/Store/Pages/BudgetManagement/Handlers/SaveBudgetConfiguration";
import setBudgetCalendar from "@insite/client-framework/Store/Pages/BudgetManagement/Handlers/SetBudgetCalendar";
import setBudgetPeriodType from "@insite/client-framework/Store/Pages/BudgetManagement/Handlers/SetBudgetPeriodType";
import setCustomBudgetPeriodNumber from "@insite/client-framework/Store/Pages/BudgetManagement/Handlers/SetCustomBudgetPeriodNumber";
import setDisplayedWidgetName from "@insite/client-framework/Store/Pages/BudgetManagement/Handlers/SetDisplayedWidgetName";
import translate from "@insite/client-framework/Translate";
import { BillToModel, BudgetCalendarModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import TwoButtonModal, { TwoButtonModalStyles } from "@insite/content-library/Components/TwoButtonModal";
import { BudgetManagementPageContext } from "@insite/content-library/Pages/BudgetManagementPage";
import BudgetYearSelector, {
    BudgetYearSelectorStyles,
} from "@insite/content-library/Widgets/Budget/BudgetYearSelector";
import Button, { ButtonProps } from "@insite/mobius/Button";
import DataTable, { DataTableProps } from "@insite/mobius/DataTable";
import DataTableBody from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell from "@insite/mobius/DataTable/DataTableCell";
import { DataTableCellBaseProps } from "@insite/mobius/DataTable/DataTableCellBase";
import DataTableHead from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow from "@insite/mobius/DataTable/DataTableRow";
import DatePicker, { DatePickerPresentationProps, DatePickerState } from "@insite/mobius/DatePicker";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden from "@insite/mobius/Hidden";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import XCircle from "@insite/mobius/Icons/XCircle";
import Radio, { RadioComponentProps, RadioStyle } from "@insite/mobius/Radio";
import RadioGroup, { RadioGroupComponentProps } from "@insite/mobius/RadioGroup";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Tooltip from "@insite/mobius/Tooltip";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import FieldSetPresentationProps, { FieldSetGroupPresentationProps } from "@insite/mobius/utilities/fieldSetProps";
import immer from "immer";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    billToState: getCurrentBillToState(state),
    budgetCalendarsDataView: getBudgetCalendarsDataView(state),
    budgetCalendar: state.pages.budgetManagement.budgetCalendar,
    budgetEndPeriods: state.pages.budgetManagement.budgetEndPeriods,
    budgetYear: state.pages.budgetManagement.budgetCalendar
        ? state.pages.budgetManagement.budgetCalendar.fiscalYear
        : new Date().getFullYear(),
    fiscalYearEndDate: state.pages.budgetManagement.budgetCalendar
        ? state.pages.budgetManagement.budgetCalendar.fiscalYearEndDate
        : undefined,
    displayedWidgetName: state.pages.budgetManagement.displayedWidgetName,
    budgetPeriodType: state.pages.budgetManagement.budgetPeriodType,
    customBudgetPeriodNumber: state.pages.budgetManagement.customBudgetPeriodNumber,
});

const mapDispatchToProps = {
    setBudgetCalendar,
    setDisplayedWidgetName,
    setBudgetPeriodType,
    setCustomBudgetPeriodNumber,
    saveBudgetConfiguration,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface ConfigureBudgetStyles {
    gridContainer?: GridContainerProps;
    titleText?: TypographyPresentationProps;
    titleGridItems?: GridItemProps;
    buttonsGridItem?: GridItemProps;
    enforcementLevelGridItems?: GridItemProps;
    gridItems?: GridItemProps;
    cancelButton?: ButtonProps;
    saveButton?: ButtonProps;
    enforcementLevelLabel?: TypographyPresentationProps;
    enforcementLevelRadioGroup?: FieldSetGroupPresentationProps<RadioGroupComponentProps>;
    enforcementLevelRadio?: FieldSetPresentationProps<RadioComponentProps>;
    budgetPeriodTitle?: TypographyPresentationProps;
    budgetYearSelectorStyles?: BudgetYearSelectorStyles;
    budgetYearGridItem?: GridItemProps;
    budgetYearEndGridItem?: GridItemProps;
    budgetYearEndDatePicker?: DatePickerPresentationProps;
    startDatePicker?: DatePickerPresentationProps;
    budgetPeriodTypeRadioGroup?: FieldSetGroupPresentationProps<RadioGroupComponentProps>;
    budgetPeriodTypeRadio?: FieldSetPresentationProps<RadioComponentProps>;
    customBudgetPeriodTypeRadio?: FieldSetPresentationProps<RadioComponentProps>;
    customBudgetPeriodInput?: TextFieldProps;
    dataTable?: DataTableProps;
    periodHeader?: DataTableHeaderProps;
    startDateHeader?: DataTableHeaderProps;
    endDateHeader?: DataTableHeaderProps;
    removeHeader?: DataTableHeaderProps;
    periodCells?: DataTableCellBaseProps;
    startDateCells?: DataTableCellBaseProps;
    endDateCells?: DataTableCellBaseProps;
    removeCells?: DataTableCellBaseProps;
    removeIcon?: IconPresentationProps;
    twoButtonModalStyles?: TwoButtonModalStyles;
}

export const configureBudgetStyles: ConfigureBudgetStyles = {
    titleText: {
        variant: "h4",
        css: css`
            margin: 0;
        `,
    },
    titleGridItems: {
        width: [12, 12, 8, 8, 8],
    },
    buttonsGridItem: {
        width: [12, 12, 4, 4, 4],
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        justify-content: flex-start;
                    `,
                    css`
                        justify-content: flex-start;
                    `,
                    css`
                        justify-content: flex-end;
                    `,
                    css`
                        justify-content: flex-end;
                    `,
                    css`
                        justify-content: flex-end;
                    `,
                ])}
        `,
    },
    enforcementLevelGridItems: {
        width: 12,
        css: css`
            display: block;
        `,
    },
    cancelButton: {
        variant: "tertiary",
    },
    saveButton: {
        css: css`
            margin-left: 10px;
        `,
    },
    enforcementLevelLabel: {
        variant: "h5",
        css: css`
            display: inline-block;
            margin-right: 6px;
        `,
    },
    enforcementLevelRadioGroup: {
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        display: inline-block;
                        & > ${RadioStyle} {
                            display: block;
                            margin-top: 10px;
                        }
                    `,
                    css`
                        display: inline-block;
                        & > ${RadioStyle} {
                            display: block;
                            margin-top: 10px;
                        }
                    `,
                    css`
                        display: inline-block;
                        & > ${RadioStyle} {
                            display: inline-block;
                            margin-right: 20px;
                        }
                    `,
                    css`
                        display: inline-block;
                        & > ${RadioStyle} {
                            display: inline-block;
                            margin-right: 20px;
                        }
                    `,
                    css`
                        display: inline-block;
                        & > ${RadioStyle} {
                            display: inline-block;
                            margin-right: 20px;
                        }
                    `,
                ])}
        `,
    },
    budgetPeriodTitle: {
        variant: "h5",
        css: css`
            display: inline-block;
            margin-right: 6px;
        `,
    },
    budgetYearGridItem: {
        width: 12,
        css: css`
            padding-bottom: 0;
        `,
    },
    budgetYearEndGridItem: {
        width: 12,
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        display: block;
                    `,
                    css`
                        display: block;
                    `,
                    css`
                        display: flex;
                    `,
                    css`
                        display: flex;
                    `,
                    css`
                        display: flex;
                    `,
                ])}
        `,
    },
    budgetYearEndDatePicker: {
        cssOverrides: {
            formField: css`
                ${({ theme }: { theme: BaseTheme }) =>
                    breakpointMediaQueries(theme, [
                        css`
                            width: auto;
                            margin-right: 35px;
                            margin-top: 15px;
                        `,
                        css`
                            width: auto;
                            margin-right: 35px;
                            margin-top: 15px;
                        `,
                        css`
                            width: auto;
                            margin-right: 35px;
                        `,
                        css`
                            width: auto;
                            margin-right: 35px;
                        `,
                        css`
                            width: auto;
                            margin-right: 35px;
                        `,
                    ])}
            `,
        },
        labelProps: {
            css: css`
                margin-bottom: 3px;
            `,
        },
    },
    budgetPeriodTypeRadioGroup: {
        css: css`
            ${({ theme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        display: block;
                        & > ${RadioStyle} {
                            display: block;
                        }
                        & > ${RadioStyle}:nth-last-child(2) {
                            display: inline-block;
                            margin-right: 20px;
                        }
                    `,
                    css`
                        display: block;
                        & > ${RadioStyle} {
                            display: block;
                        }
                        & > ${RadioStyle}:nth-last-child(2) {
                            display: inline-block;
                            margin-right: 20px;
                        }
                    `,
                    css`
                        display: inline-block;
                        & > ${RadioStyle} {
                            display: inline-block;
                            margin-right: 20px;
                        }
                    `,
                    css`
                        display: inline-block;
                        & > ${RadioStyle} {
                            display: inline-block;
                            margin-right: 20px;
                        }
                    `,
                    css`
                        display: inline-block;
                        & > ${RadioStyle} {
                            display: inline-block;
                            margin-right: 20px;
                        }
                    `,
                ])}
        `,
    },
    customBudgetPeriodInput: {
        type: "number",
        min: 1,
        max: 13,
        cssOverrides: {
            formField: css`
                width: 55px;
                display: inline-block !important;
                margin-right: 20px;
            `,
            inputSelect: css`
                padding-right: 5px;
                &:focus {
                    padding-right: 5px;
                }
            `,
        },
    },
    removeIcon: {
        src: XCircle,
        css: css`
            display: block;
            cursor: pointer;
            margin: auto;
        `,
    },
    twoButtonModalStyles: {
        submitButton: {
            color: "primary",
        },
    },
};

const styles = configureBudgetStyles;
const tzOffset = new Date().getTimezoneOffset() * 60000;
const ConfigureBudget: React.FC<Props> = ({
    billToState,
    budgetCalendarsDataView,
    budgetCalendar,
    budgetEndPeriods,
    budgetYear,
    budgetPeriodType,
    customBudgetPeriodNumber,
    fiscalYearEndDate,
    displayedWidgetName,
    setDisplayedWidgetName,
    setBudgetCalendar,
    setBudgetPeriodType,
    setCustomBudgetPeriodNumber,
    saveBudgetConfiguration,
}) => {
    if (displayedWidgetName !== "ConfigureBudget" || billToState.isLoading || !billToState.value) {
        return null;
    }

    const toasterContext = React.useContext(ToasterContext);
    const [saveConfigurationModalIsOpen, setSaveConfigurationModalIsOpen] = React.useState(false);
    const [enforcementLevel, setEnforcementLevel] = React.useState(billToState.value?.budgetEnforcementLevel);

    const getCalendarPeriodFromDate = (index: number) => {
        if (!budgetCalendar) {
            return new Date();
        }

        let date: Date;
        if (index === 0) {
            date = new Date(budgetCalendar.fiscalYear - 1, 11, 31);
        } else {
            date = new Date(budgetCalendar.budgetPeriods![index - 1]!.toString());
        }

        date.setDate(date.getDate() + 1);
        return date;
    };

    const getCalendarPeriodToDate = (index: number) => {
        if (!budgetCalendar) {
            return new Date();
        }

        let date: Date;
        if (index === budgetCalendar.budgetPeriods!.length - 1 || !budgetCalendar.budgetPeriods![index + 1]) {
            date = budgetCalendar.fiscalYearEndDate
                ? new Date(budgetCalendar.fiscalYearEndDate.toString())
                : new Date(budgetCalendar.fiscalYear + 1, 0, 1);
        } else {
            date = new Date(budgetCalendar.budgetPeriods![index + 1]!.toString());
        }

        date.setDate(date.getDate() - 1);
        return date;
    };

    const handleCancelButtonClick = () => {
        setDisplayedWidgetName({ value: "ReviewBudget" });
    };

    const handleSaveButtonClick = () => {
        setSaveConfigurationModalIsOpen(true);
    };

    const handleCancelModalButtonClick = () => {
        setSaveConfigurationModalIsOpen(false);
    };

    const handleSaveModalButtonClick = () => {
        setSaveConfigurationModalIsOpen(false);
        if (budgetCalendar) {
            const dates =
                budgetCalendar.budgetPeriods?.map(date =>
                    date ? new Date(new Date(date).getTime() - tzOffset) : null,
                ) || null;
            setDisplayedWidgetName({ value: "ReviewBudget" });
            saveBudgetConfiguration({
                updateEnforcementLevelApiParameter: {
                    billTo: { budgetEnforcementLevel: enforcementLevel, uri: billToState.value?.uri } as BillToModel,
                },
                updateBudgetCalendarApiParameter: { budgetCalendar: { ...budgetCalendar, budgetPeriods: dates } },
                onSuccess: onSaveSuccess,
                onComplete(resultProps) {
                    if (!resultProps.hadError) {
                        // "this" is targeting the object being created, not the parent SFC
                        // eslint-disable-next-line react/no-this-in-sfc
                        this.onSuccess?.();
                    }
                },
            });
        }
    };

    const onSaveSuccess = () => {
        toasterContext.addToast({ body: translate("Your changes were saved successfully."), messageType: "success" });
    };

    const handleEnforcementLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEnforcementLevel(event.currentTarget.value);
    };

    const handleBudgetYearChange = (budgetYear: number) => {
        const calendar =
            !budgetCalendarsDataView.isLoading && budgetCalendarsDataView.value
                ? budgetCalendarsDataView.value!.find(o => o.fiscalYear === budgetYear) ||
                  ({ fiscalYear: budgetYear, budgetPeriods: [] as Date[] } as BudgetCalendarModel)
                : undefined;
        setBudgetCalendar({ value: calendar });
        setBudgetPeriodType({ budgetPeriodType: undefined });
    };

    const handleYearEndChange = ({ selectedDay }: DatePickerState) => {
        if (budgetCalendar) {
            setBudgetCalendar({
                value: {
                    ...budgetCalendar,
                    fiscalYearEndDate: selectedDay!,
                },
                budgetPeriodType: budgetPeriodType === BudgetPeriodType.Custom ? undefined : BudgetPeriodType.Custom,
                customBudgetPeriodNumber: budgetPeriodType === BudgetPeriodType.Custom ? undefined : 1,
            });
        }
    };

    const handleBudgetPeriodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (budgetCalendar) {
            const periodType = event.currentTarget.value;
            const value = periodType as keyof typeof BudgetPeriodType;
            setBudgetCalendar({
                value: {
                    ...budgetCalendar,
                    fiscalYearEndDate: null,
                },
                budgetPeriodType: BudgetPeriodType[value],
                customBudgetPeriodNumber: customBudgetPeriodNumber || 1,
            });
        }
    };

    const handleCustomBudgetPeriodNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.currentTarget.value) {
            setCustomBudgetPeriodNumber({ customBudgetPeriodNumber: undefined });
            return;
        }

        let value = Number(event.currentTarget.value);
        value = value > 13 ? 13 : value;
        value = value < 1 ? 1 : value;
        setBudgetPeriodType({
            budgetPeriodType,
            customBudgetPeriodNumber: value,
        });
    };

    const handleStartDateChange = (index: number, selectedDay?: Date) => {
        if (selectedDay && budgetCalendar) {
            const updatedBudgetCalendar = immer(budgetCalendar, draft => {
                draft.budgetPeriods![index] = selectedDay;
            });
            setBudgetCalendar({ value: updatedBudgetCalendar });
        }
    };

    const handleRemoveIconClick = (index: number) => {
        if (!budgetCalendar) {
            return;
        }

        const calendar = immer(budgetCalendar, draft => {
            draft.budgetPeriods!.splice(index, 1);
        });
        setBudgetCalendar({ value: calendar });
        if (!customBudgetPeriodNumber) {
            return;
        }

        setCustomBudgetPeriodNumber({ customBudgetPeriodNumber: customBudgetPeriodNumber - 1 });
    };

    const yearEndDate = fiscalYearEndDate ? new Date(fiscalYearEndDate.toString()) : undefined;
    const rows = budgetCalendar
        ? budgetCalendar.budgetPeriods!.map((period, index) => {
              const endDate = budgetEndPeriods ? budgetEndPeriods[index] : "";
              return {
                  period: index + 1,
                  startDate: new Date(period!),
                  endDate: endDate ? `${endDate.getMonth() + 1}/${endDate.getDate()}/${endDate.getFullYear()}` : "",
              };
          })
        : [];

    return (
        <>
            <GridContainer {...styles.gridContainer}>
                <GridItem {...styles.titleGridItems}>
                    <Typography as="h2" {...styles.titleText}>
                        {translate("Configure Budgets")}
                    </Typography>
                </GridItem>
                <GridItem {...styles.buttonsGridItem}>
                    <Button {...styles.cancelButton} onClick={handleCancelButtonClick}>
                        {translate("Cancel")}
                    </Button>
                    <Button {...styles.saveButton} onClick={handleSaveButtonClick}>
                        {translate("Save")}
                    </Button>
                </GridItem>
                <GridItem {...styles.enforcementLevelGridItems}>
                    <div>
                        <Typography as="h3" {...styles.enforcementLevelLabel}>
                            {translate("Enforcement Level")}
                        </Typography>
                        <Tooltip text={siteMessage("Budget_EnforcementLevelInstructions").toString()} />
                    </div>
                    <RadioGroup
                        onChangeHandler={handleEnforcementLevelChange}
                        value={enforcementLevel}
                        data-test-selector="enforcementLevelRadio"
                        {...styles.enforcementLevelRadioGroup}
                    >
                        <Radio value={BudgetEnforcementLevel.None} {...styles.enforcementLevelRadio}>
                            {translate("No Enforcement")}
                        </Radio>
                        <Radio value={BudgetEnforcementLevel.ShipTo} {...styles.enforcementLevelRadio}>
                            {translate("Customer Ship To Level")}
                        </Radio>
                        <Radio value={BudgetEnforcementLevel.Customer} {...styles.enforcementLevelRadio}>
                            {translate("Customer Level")}
                        </Radio>
                        <Radio value={BudgetEnforcementLevel.User} {...styles.enforcementLevelRadio}>
                            {translate("User Level")}
                        </Radio>
                    </RadioGroup>
                </GridItem>
                <GridItem width={12} {...styles.gridItems}>
                    <Typography {...styles.budgetPeriodTitle}>
                        {translate("Configure Budget Period by Year")}
                    </Typography>
                    <Tooltip text={siteMessage("Budget_PeriodInstruction").toString()} />
                </GridItem>
                <GridItem {...styles.budgetYearGridItem}>
                    <BudgetYearSelector
                        budgetYear={budgetYear}
                        extendedStyles={styles.budgetYearSelectorStyles}
                        dataTestSelector="configureBudgetYearSelector"
                        onBudgetYearChange={handleBudgetYearChange}
                    ></BudgetYearSelector>
                </GridItem>
                <GridItem {...styles.budgetYearEndGridItem}>
                    <RadioGroup
                        label="Assign Budget Period"
                        onChangeHandler={handleBudgetPeriodChange}
                        value={budgetPeriodType || ""}
                        data-test-selector="budgetPeriodTypeRadio"
                        {...styles.budgetPeriodTypeRadioGroup}
                    >
                        <Radio
                            value={BudgetPeriodType.Monthly}
                            {...styles.budgetPeriodTypeRadio}
                            disabled={!!fiscalYearEndDate}
                        >
                            {/* eslint-disable-next-line spire/avoid-dynamic-translate */}
                            {translate(BudgetPeriodType.Monthly)}
                        </Radio>
                        <Radio
                            value={BudgetPeriodType.Quarterly}
                            {...styles.budgetPeriodTypeRadio}
                            disabled={!!fiscalYearEndDate}
                        >
                            {/* eslint-disable-next-line spire/avoid-dynamic-translate */}
                            {translate(BudgetPeriodType.Quarterly)}
                        </Radio>
                        <Radio
                            value={BudgetPeriodType.Yearly}
                            {...styles.budgetPeriodTypeRadio}
                            disabled={!!fiscalYearEndDate}
                        >
                            {/* eslint-disable-next-line spire/avoid-dynamic-translate */}
                            {translate(BudgetPeriodType.Yearly)}
                        </Radio>
                        <Radio value={BudgetPeriodType.Custom} {...styles.customBudgetPeriodTypeRadio}>
                            {/* eslint-disable-next-line spire/avoid-dynamic-translate */}
                            {translate(BudgetPeriodType.Custom)}
                        </Radio>
                        {budgetPeriodType === BudgetPeriodType.Custom && (
                            <TextField
                                value={customBudgetPeriodNumber || ""}
                                {...styles.customBudgetPeriodInput}
                                data-test-selector="customBudgetPeriodNumber"
                                onChange={handleCustomBudgetPeriodNumberChange}
                            />
                        )}
                    </RadioGroup>
                    {budgetPeriodType === BudgetPeriodType.Custom && (
                        <DatePicker
                            label="Budget Year End"
                            selectedDay={yearEndDate}
                            {...styles.budgetYearEndDatePicker}
                            dateTimePickerProps={{
                                maxDate: new Date(budgetYear + 1, 11, 31),
                                minDate: new Date(budgetYear, 0, 1),
                                clearIcon: null,
                                ...styles.budgetYearEndDatePicker?.dateTimePickerProps,
                            }}
                            onDayChange={handleYearEndChange}
                        />
                    )}
                </GridItem>
                <GridItem width={[12, 12, 6, 6, 6]} {...styles.gridItems}>
                    <DataTable {...styles.dataTable}>
                        <DataTableHead>
                            <DataTableHeader {...styles.periodHeader}>{translate("Period")}</DataTableHeader>
                            <DataTableHeader {...styles.startDateHeader}>{translate("Start Date")}</DataTableHeader>
                            <DataTableHeader {...styles.endDateHeader}>{translate("End Date")}</DataTableHeader>
                            <DataTableHeader {...styles.removeHeader} title={translate("Remove")} />
                        </DataTableHead>
                        <DataTableBody>
                            {rows.map(({ period, startDate, endDate }, index) => (
                                <DataTableRow key={period} data-test-selector="budgetPeriodRow">
                                    <DataTableCell {...styles.periodCells}>{period}</DataTableCell>
                                    <DataTableCell
                                        {...styles.startDateCells}
                                        data-test-selector={`budgetStartDate_${index}`}
                                    >
                                        <DatePicker
                                            selectedDay={startDate}
                                            {...styles.startDatePicker}
                                            dateTimePickerProps={{
                                                maxDate: getCalendarPeriodToDate(index),
                                                minDate: getCalendarPeriodFromDate(index),
                                                clearIcon: null,
                                                ...styles.startDatePicker?.dateTimePickerProps,
                                            }}
                                            onDayChange={({ selectedDay }) => handleStartDateChange(index, selectedDay)}
                                        />
                                    </DataTableCell>
                                    <DataTableCell
                                        {...styles.endDateCells}
                                        data-test-selector={`budgetEndDate_${index}`}
                                    >
                                        {endDate}
                                    </DataTableCell>
                                    <DataTableCell {...styles.removeCells}>
                                        {/* TODO ISC-12606 needs clickable */}
                                        <Icon {...styles.removeIcon} onClick={() => handleRemoveIconClick(index)} />
                                    </DataTableCell>
                                </DataTableRow>
                            ))}
                        </DataTableBody>
                    </DataTable>
                </GridItem>
                <GridItem {...styles.buttonsGridItem}>
                    <Hidden above="sm">
                        <Button {...styles.cancelButton} onClick={handleCancelButtonClick}>
                            {translate("Cancel")}
                        </Button>
                        <Button
                            {...styles.saveButton}
                            onClick={handleSaveButtonClick}
                            data-test-selector="saveConfigurationButton"
                        >
                            {translate("Save")}
                        </Button>
                    </Hidden>
                </GridItem>
            </GridContainer>
            <TwoButtonModal
                modalIsOpen={saveConfigurationModalIsOpen}
                headlineText={siteMessage("Budget_Save_Title")}
                messageText={siteMessage("Budget_Save_Confirmation")}
                cancelButtonText={translate("Cancel")}
                submitButtonText={translate("Save and Continue")}
                submitTestSelector="saveAndContinueButton"
                extendedStyles={styles.twoButtonModalStyles}
                onCancel={handleCancelModalButtonClick}
                onSubmit={handleSaveModalButtonClick}
            ></TwoButtonModal>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(ConfigureBudget),
    definition: {
        group: "BudgetManagement",
        allowedContexts: [BudgetManagementPageContext],
    },
};

export default widgetModule;
