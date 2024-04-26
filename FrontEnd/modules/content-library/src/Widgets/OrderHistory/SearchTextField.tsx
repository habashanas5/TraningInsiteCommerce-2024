/* eslint-disable spire/export-styles */
import { GetOrdersApiParameter } from "@insite/client-framework/Services/OrderService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import updateSearchFields from "@insite/client-framework/Store/Pages/OrderHistory/Handlers/UpdateSearchFields";
import SearchFieldWrapper, {
    SearchFieldWrapperStyles,
} from "@insite/content-library/Widgets/OrderHistory/SearchFieldWrapper";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

export interface SearchTextFieldStyles {
    textField?: TextFieldPresentationProps;
    wrapper?: SearchFieldWrapperStyles;
}

interface OwnProps {
    styles?: SearchTextFieldStyles;
    parameterField: keyof GetOrdersApiParameter;
    label: string;
    inputType: string;
    placeholder: string;
    testSelector?: string;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        parameter: state.pages.orderHistory.getOrdersParameter,
    };
};

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

interface State {
    value: string;
}

class SearchTextField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            value: this.getValue(props),
        };
    }

    updateTimeoutId: number | undefined;

    getValue = (props: Props): string => {
        let value = props.parameter[props.parameterField] as string;
        if (!value) {
            value = "";
        }
        return value;
    };

    componentDidUpdate(prevProps: Props) {
        const previousValue = this.getValue(prevProps);
        const currentValue = this.getValue(this.props);

        if (previousValue !== currentValue && currentValue !== this.state.value) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                value: currentValue,
            });
        }
    }

    handleChange = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({
            value: event.currentTarget.value,
        });
        if (typeof this.updateTimeoutId === "number") {
            clearTimeout(this.updateTimeoutId);
        }

        this.updateTimeoutId = setTimeout(() => {
            this.props.updateSearchFields({ [this.props.parameterField]: this.state.value });
        }, 250);
    };

    render() {
        return (
            <SearchFieldWrapper extendedStyles={this.props.styles?.wrapper}>
                <TextField
                    data-test-selector={this.props.testSelector}
                    value={this.state.value}
                    label={this.props.label}
                    type={this.props.inputType}
                    placeholder={this.props.placeholder}
                    onChange={this.handleChange}
                    {...this.props.styles?.textField}
                />
            </SearchFieldWrapper>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchTextField);
