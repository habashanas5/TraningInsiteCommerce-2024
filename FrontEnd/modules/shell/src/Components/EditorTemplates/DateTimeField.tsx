import { DateTimeFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import DatePicker, { DatePickerPresentationProps, DatePickerState } from "@insite/mobius/DatePicker/DatePicker";
import StandardControl from "@insite/shell-public/Components/StandardControl";
import { EditorTemplateProps } from "@insite/shell-public/EditorTemplateProps";
import * as React from "react";
import { css } from "styled-components";

const datePickerStyles: DatePickerPresentationProps = {
    cssOverrides: {
        inputSelect: css`
            padding: 10px !important;
            &:focus-within {
                padding: 9px !important;
            }
        `,
    },
    calendarIconProps: {
        color: "text.main",
        css: css`
            width: 28px !important;
            padding: 8px 0 !important;
        `,
        src: "Calendar",
    },
    clearIconProps: {
        color: "text.main",
        src: "X",
        css: css`
            width: 28px !important;
            padding: 8px 0 !important;
        `,
    },
};

export default class TextField extends React.Component<EditorTemplateProps<Date | null, DateTimeFieldDefinition>> {
    onChange = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        this.props.updateField(this.props.fieldDefinition.name, selectedDay ?? null);
    };

    oldOnChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.props.updateField(
            this.props.fieldDefinition.name,
            event.currentTarget.value ? new Date(event.currentTarget.value) : null,
        );
    };

    render() {
        const { fieldValue, fieldDefinition } = this.props;
        const selectedDate = typeof fieldValue === "string" ? new Date(fieldValue) : fieldValue;

        return (
            <StandardControl fieldDefinition={fieldDefinition}>
                <DatePicker
                    selectedDay={selectedDate ?? undefined}
                    onDayChange={this.onChange}
                    format="MM/dd/y hh:mm a"
                    {...datePickerStyles}
                />
            </StandardControl>
        );
    }
}
