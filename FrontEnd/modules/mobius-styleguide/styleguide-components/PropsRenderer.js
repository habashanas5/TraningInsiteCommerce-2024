/**
 * This renderer was extracted from react-styleguidist in order to add the `renderThemable` function.
 */
/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import Group from "react-group";
import { css } from "styled-components";
import objectToString from "javascript-stringify";
import Argument from "react-styleguidist/lib/client/rsg-components/Argument";
import Arguments from "react-styleguidist/lib/client/rsg-components/Arguments";
import Code from "react-styleguidist/lib/client/rsg-components/Code";
import JsDoc from "react-styleguidist/lib/client/rsg-components/JsDoc";
import Markdown from "react-styleguidist/lib/client/rsg-components/Markdown";
import Name from "react-styleguidist/lib/client/rsg-components/Name";
import Type from "react-styleguidist/lib/client/rsg-components/Type";
import Text from "react-styleguidist/lib/client/rsg-components/Text";
import Link from "react-styleguidist/lib/client/rsg-components/Link";
import Para from "react-styleguidist/lib/client/rsg-components/Para";
import Table from "react-styleguidist/lib/client/rsg-components/Table";
import { unquote, getType, showSpaces } from "react-styleguidist/lib/client/rsg-components/Props/util";
import Tooltip from "../../mobius/src/Tooltip";
import Icon from "../..//mobius/src/Icon";
import ExternalLink from "../../mobius/src/Icons/ExternalLink";
import ThemeProvider from "../../mobius/src/ThemeProvider";

function doesStringDescribeObject(string) {
    return string[0] === "{" && string[string.length - 1] === "}";
}

function renderType(type) {
    if (!type) {
        return "unknown";
    }

    const { name } = type;

    if (name.indexOf("StyledProp") >= 0) {
        return (
            <Tooltip
                triggerComponent={<Type>StyledProp</Type>}
                text={"CSS helper from styled-components or JSS object."}
                cssOverrides={{ tooltipClickable: { borderBottom: "1px dashed grey" } }}
            />
        );
    } else if (name.indexOf("Props") >= 0) {
        let linkDestination;
        switch (name) {
            case "TypographyPresentationProps":
                linkDestination = "#!/Typography";
                break;
            case "IconPresentationProps":
                linkDestination = "#!/Icon";
                break;
            case "ButtonPresentationProps":
                linkDestination = "#!/Button";
                break;
        }
        if (linkDestination)
            return (
                <span style={{ borderBottom: "1px dashed grey", padding: "3px 0", cursor: "pointer" }}>
                    <Link href={linkDestination} target="_blank">
                        <Type>
                            {`${name}`}&nbsp;
                            <Icon
                                src={ExternalLink}
                                size={14}
                                css={css`
                                    margin-top: 5px;
                                `}
                            />
                        </Type>
                    </Link>
                </span>
            );
    } else if (doesStringDescribeObject(name)) {
        return "object";
    }

    switch (name) {
        case "arrayOf":
            return `${type.value.name}[]`;
        case "objectOf":
            return `{${renderType(type.value)}}`;
        case "instanceOf":
            return type.value;
        case "ReactText":
            return "number | string";
        default:
            return name;
    }
}

function renderFlowType(type) {
    if (!type) {
        return "unknown";
    }

    const { name, raw, value } = type;

    switch (name) {
        case "enum":
            return name;
        case "literal":
            return value;
        case "signature":
            return renderComplexType(type.type, raw);
        case "union":
        case "tuple":
            return renderComplexType(name, raw);
        default:
            return raw || name;
    }
}

function renderComplexType(name, title) {
    return (
        <Text size="small" underlined title={title}>
            {name}
        </Text>
    );
}

function renderEnum(prop) {
    if (!Array.isArray(getType(prop).value)) {
        return <span>{getType(prop).value}</span>;
    }

    const values = getType(prop).value.map(({ value }) => <Code key={value}>{showSpaces(unquote(value))}</Code>);
    return (
        <span>
            One of: <Group separator=", ">{values}</Group>
        </span>
    );
}

function renderShape(props) {
    return Object.keys(props).map(name => {
        const prop = props[name];
        const defaultValue = renderDefault(prop);
        const { description } = prop;
        return (
            <div key={name}>
                <Name>{name}</Name>
                {": "}
                <Type>{renderType(prop)}</Type>
                {defaultValue && " — "}
                {defaultValue}
                {description && " — "}
                {description && <Markdown text={description} inline />}
            </div>
        );
    });
}

const defaultValueBlacklist = ["null", "undefined"];

function renderDefault(prop) {
    // Workaround for issue https://github.com/reactjs/react-docgen/issues/221
    // If prop has defaultValue it can not be required
    if (prop.defaultValue) {
        if (prop.type || prop.flowType) {
            const propName = prop.type ? prop.type.name : prop.flowType.type;

            if (defaultValueBlacklist.indexOf(prop.defaultValue.value) > -1) {
                return <Code>{showSpaces(unquote(prop.defaultValue.value))}</Code>;
            }
            if (propName === "func" || propName === "function") {
                return (
                    <Text size="small" color="light" underlined title={showSpaces(unquote(prop.defaultValue.value))}>
                        Function
                    </Text>
                );
            }
            if (propName === "shape" || propName === "object") {
                try {
                    // We eval source code to be able to format the defaultProp here. This
                    // can be considered safe, as it is the source code that is evaled,
                    // which is from a known source and safe by default
                    // eslint-disable-next-line no-eval
                    const object = eval(`(${prop.defaultValue.value})`);
                    return (
                        <Text size="small" color="light" underlined title={objectToString(object, null, 2)}>
                            Shape
                        </Text>
                    );
                } catch (e) {
                    // eval will throw if it contains a reference to a property not in the
                    // local scope. To avoid any breakage we fall back to rendering the
                    // prop without any formatting
                    return (
                        <Text size="small" color="light" underlined title={prop.defaultValue.value}>
                            Shape
                        </Text>
                    );
                }
            }
            if (propName === "boolean") {
                const booleanName = prop.defaultValue.value ? "true" : "false";
                return booleanName;
            }
        }

        return prop.defaultValue.value;
    }
    if (prop.required) {
        return (
            <Text size="small" color="light">
                Required
            </Text>
        );
    }
    return "";
}

function renderDescription(prop) {
    const { description, tags = {} } = prop;
    const extra = renderExtra(prop);
    const args = [...(tags.arg || []), ...(tags.argument || []), ...(tags.param || [])];
    const returnDocumentation = (tags.return && tags.return[0]) || (tags.returns && tags.returns[0]);

    return (
        <div>
            {description && <Markdown text={description} />}
            {extra && <Para>{extra}</Para>}
            <JsDoc {...tags} />
            {args.length > 0 && <Arguments args={args} heading />}
            {returnDocumentation && <Argument {...returnDocumentation} returns />}
        </div>
    );
}

function renderExtra(prop) {
    const type = getType(prop);
    if (doesStringDescribeObject(type.name)) {
        const objectContents = type.name.substring(2, type.name.length - 2);
        return (
            <Type>
                <p
                    style={{ fontSize: 10 }}
                    dangerouslySetInnerHTML={{
                        __html: `{ <br/> &nbsp;&nbsp; ${objectContents.replace(";", "; <br/> &nbsp;&nbsp;")} <br/>}`,
                    }}
                ></p>
            </Type>
        );
    }
    if (!type) {
        return null;
    }
    switch (type.name) {
        case "enum":
            return renderEnum(prop);
        case "union":
            return renderUnion(prop);
        case "shape":
            return renderShape(prop.type.value);
        case "arrayOf":
            if (type.value.name === "shape") {
                return renderShape(prop.type.value.value);
            }
            return null;
        case "objectOf":
            if (type.value.name === "shape") {
                return renderShape(prop.type.value.value);
            }
            return null;
        default:
            return null;
    }
}

function renderUnion(prop) {
    const type = getType(prop);
    if (!Array.isArray(type.value)) {
        return <span>{type.value}</span>;
    }

    const values = type.value.map((value, index) => <Type key={`${value.name}-${index}`}>{renderType(value)}</Type>);
    return (
        <span>
            One of type: <Group separator=", ">{values}</Group>
        </span>
    );
}

function renderName(prop) {
    const { name, tags = {} } = prop;
    return <Name deprecated={!!tags.deprecated}>{name}</Name>;
}

function renderThemable(prop) {
    const {
        tags: { themable },
    } = prop;
    return <span style={{ marginLeft: "25px" }}>{themable ? "✓" : ""}</span>;
}

function renderTypeColumn(prop) {
    if (prop.flowType) {
        return <Type>{renderFlowType(getType(prop))}</Type>;
    }
    return <Type>{renderType(getType(prop))}</Type>;
}

export function getRowKey(row) {
    return row.name;
}

export const columns = [
    {
        caption: "Prop name",
        render: renderName,
    },
    {
        caption: "Type",
        render: renderTypeColumn,
    },
    {
        caption: "Themable",
        render: renderThemable,
    },
    {
        caption: "Default",
        render: renderDefault,
    },
    {
        caption: "Description",
        render: renderDescription,
    },
];

export default function PropsRenderer({ props }) {
    return (
        <ThemeProvider>
            <Table columns={columns} rows={props} getRowKey={getRowKey} />
        </ThemeProvider>
    );
}

PropsRenderer.propTypes = {
    props: PropTypes.array.isRequired,
};
