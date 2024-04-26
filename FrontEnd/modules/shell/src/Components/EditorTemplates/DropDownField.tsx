import logger from "@insite/client-framework/Logger";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { DropDownFieldDefinition, Option } from "@insite/client-framework/Types/FieldDefinition";
import Select from "@insite/mobius/Select";
import StandardControl from "@insite/shell-public/Components/StandardControl";
import { EditorTemplateProps } from "@insite/shell-public/EditorTemplateProps";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect } from "react-redux";

interface State {
    options: Option<string | number>[];
}

const mapStateToProps = (state: ShellState) => {
    const page = getCurrentPage(state);
    return {
        page,
        settings: state.shellContext.settings,
    };
};

type Props = EditorTemplateProps<string | number, DropDownFieldDefinition<string> | DropDownFieldDefinition<number>> &
    ReturnType<typeof mapStateToProps>;

class DropDownField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            options: [],
        };
    }

    async componentDidMount() {
        const options = await this.getOptions();
        if (options.length === 0) {
            logger.error(
                `There were no options defined in the properties for the fieldDefinition ${this.props.fieldDefinition.name}`,
            );
        }

        this.setState({
            options,
        });
    }

    async getOptions(): Promise<Option<string | number>[]> {
        if (this.props.fieldDefinition && this.props.fieldDefinition.options) {
            if (typeof this.props.fieldDefinition.options === "function") {
                const options = await this.props.fieldDefinition.options();
                return options;
            }

            return this.props.fieldDefinition.options;
        }

        return [];
    }

    onChange = (event: React.FormEvent<HTMLSelectElement>) => {
        this.props.updateField(this.props.fieldDefinition.name, event.currentTarget.value);
    };

    render() {
        const { options } = this.state;
        if (options.length === 0) {
            return null;
        }

        return (
            <StandardControl fieldDefinition={this.props.fieldDefinition}>
                <Select
                    uid={this.props.fieldDefinition.name}
                    value={this.props.fieldValue}
                    onChange={this.onChange}
                    disabled={
                        this.props.fieldDefinition.isEnabled && !this.props.fieldDefinition.isEnabled(this.props.item)
                    }
                >
                    {!this.props.fieldDefinition.hideEmptyOption && <option value="">Select Value</option>}
                    {(this.props.fieldDefinition.customFilter
                        ? options.filter(
                              o =>
                                  this.props.fieldDefinition.customFilter &&
                                  this.props.fieldDefinition.customFilter(o, this.props.page, this.props.settings),
                          )
                        : options
                    ).map(option => (
                        <option key={option.value} value={option.value}>
                            {option.displayName ?? option.value}
                        </option>
                    ))}
                </Select>
            </StandardControl>
        );
    }
}

export default connect(mapStateToProps)(DropDownField);
