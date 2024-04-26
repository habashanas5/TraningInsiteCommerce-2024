declare module "react-datetime-picker/dist/entry.nostyle" {
    import DateTimePicker from "react-datetime-picker";

    /**
     * 'react-calendar'
     * types from https://github.com/wojtekmaj/react-calendar/blob/6905e6998f66b1d976eec99d5369374390106208/index.d.ts
     * which has been removed by the maintainer.
     */
    type CalendarType = "ISO 8601" | "US" | "Arabic" | "Hebrew";
    type Detail = "month" | "year" | "decade" | "century";
    type DateCallback = (date: Date) => void;
    type ClickWeekNumberCallback = (weekNumber: number, date: Date) => void;
    type OnChangeDateCallback = (date: Date | Date[]) => void;
    type FormatterCallback = (locale: string, date: Date) => string;
    type ViewCallback = (props: ViewCallbackProperties) => void;

    export default DateTimePicker;
    export interface DateTimePickerProps extends CalendarProps {
        calendarIcon?: JSX.Element | null;
        clearIcon?: JSX.Element | null;
        locale?: string;

        showLeadingZeros?: boolean;
        autoFocus?: boolean;

        yearPlaceholder?: string;
        monthPlaceholder?: string;
        dayPlaceholder?: string;
        hourPlaceholder?: string;
        minutePlaceholder?: string;
        secondPlaceholder?: string;
        format?: string;
        locale?: string; // TODO ISC-12104 this should actually refer to valid values

        amPmAriaLabel?: string;
        calendarAriaLabel?: string;
        clearAriaLabel?: string;
        dayAriaLabel?: string;
        hourAriaLabel?: string;
        minuteAriaLabel?: string;
        monthAriaLabel?: string;
        nativeInputAriaLabel?: string;
        secondAriaLabel?: string;
        yearAriaLabel?: string;

        className?: string | string[];
        calendarClassName?: string | string[];
        clockClassName?: string | string[];

        disabled?: boolean;
        required?: boolean;
        name?: string;

        disableCalendar?: boolean;
        disableClock?: boolean;

        isCalendarOpen?: boolean;
        isClockOpen?: boolean;

        onCalendarClose?: React.EventHandler<React.SyntheticEvent>;
        onCalendarOpen?: React.EventHandler<React.SyntheticEvent>;
        onClockClose?: React.EventHandler<React.SyntheticEvent>;
        onClockOpen?: React.EventHandler<React.SyntheticEvent>;
        onFocus?: React.EventHandler<React.SyntheticEvent>;

        /**
         * 'react-calendar'
         * props from https://github.com/wojtekmaj/react-calendar/blob/6905e6998f66b1d976eec99d5369374390106208/index.d.ts
         * which has been removed by the maintainer.
         */
        activeStartDate?: Date;
        calendarType?: CalendarType;
        className?: string | string[];
        formatMonth?: FormatterCallback;
        formatMonthYear?: FormatterCallback;
        formatShortWeekday?: FormatterCallback;
        formatYear?: FormatterCallback;
        locale?: string;
        maxDate?: Date;
        maxDetail?: Detail;
        minDate?: Date;
        minDetail?: Detail;
        navigationLabel?: (props: { date: Date; view: Detail; label: string }) => string | JSX.Element | null;
        next2AriaLabel?: string;
        next2Label?: string | JSX.Element | null;
        nextAriaLabel?: string;
        nextLabel?: string | JSX.Element;
        onActiveStartDateChange?: ViewCallback;
        onChange?: OnChangeDateCallback;
        onClickDay?: DateCallback;
        onClickDecade?: DateCallback;
        onClickMonth?: DateCallback;
        onClickWeekNumber?: ClickWeekNumberCallback;
        onClickYear?: DateCallback;
        onDrillDown?: ViewCallback;
        onDrillUp?: ViewCallback;
        prev2AriaLabel?: string;
        prev2Label?: string | JSX.Element | null;
        prevAriaLabel?: string;
        prevLabel?: string | JSX.Element;
        renderChildren?: (props: CalendarTileProperties) => JSX.Element | null; // For backwards compatibility
        returnValue?: "start" | "end" | "range";
        selectRange?: boolean;
        showFixedNumberOfWeeks?: boolean;
        showNavigation?: boolean;
        showNeighboringMonth?: boolean;
        showWeekNumbers?: boolean;
        tileClassName?: string | string[] | ((props: CalendarTileProperties) => string | string[] | null);
        tileContent?: JSX.Element | ((props: CalendarTileProperties) => JSX.Element | null);
        tileDisabled?: (props: CalendarTileProperties & { activeStartDate: Date }) => boolean;
        value?: Date | Date[];
        view?: Detail;
    }
}
