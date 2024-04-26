### Example

```jsx
const css = require('styled-components').css;
const CheckboxGroup = require('../CheckboxGroup').default;
const GridContainer = require('../GridContainer').default;
const GridItem = require('../GridItem').default;
const Typography = require('../Typography').default;

<GridContainer>
    <GridItem width={[12,12,4,4,4]} css={css` display: block; `}>
        <Typography variant="h4">Default</Typography>
        <CheckboxGroup label="Checkbox Group Label">
            <Checkbox checked>Checked</Checkbox>
            <Checkbox checked="indeterminate">Indeterminate</Checkbox>
            <Checkbox>Unchecked</Checkbox>
            <Checkbox checked disabled>Disabled Checked</Checkbox>
            <Checkbox checked="indeterminate" disabled>Disabled Indeterminate</Checkbox>
            <Checkbox disabled>Disabled</Checkbox>
        </CheckboxGroup>
    </GridItem>
    <GridItem width={[12,12,4,4,4]} css={css` display: block; `}>
        <Typography variant="h4">Error</Typography>
        <CheckboxGroup label="Legal statement" required error="You must agree">
            <Checkbox error onChange={(e, value) => alert(value)}>
                I agree to the terms
            </Checkbox>
        </CheckboxGroup>
    </GridItem>
    <GridItem width={[12,12,4,4,4]} css={css` display: block; `}>
        <Typography variant="h4">Toggle Variant</Typography>
        <CheckboxGroup label="Toggle ">
            <Checkbox variant="toggle" checked>Checked</Checkbox>
            <Checkbox variant="toggle">Unchecked</Checkbox>
            <Checkbox variant="toggle" disabled>Disabled</Checkbox>
            <Checkbox variant="toggle" disabled checked>Disabled Checked</Checkbox>
        </CheckboxGroup>
    </GridItem>
</GridContainer>
```

### Smaller Size

```jsx
const css = require('styled-components').css;
const CheckboxGroup = require('../CheckboxGroup').default;
const GridContainer = require('../GridContainer').default;
const GridItem = require('../GridItem').default;
const Typography = require('../Typography').default;

<GridContainer>
    <GridItem width={[12,12,4,4,4]} css={css` display: block; `}>
        <Typography variant="h4">Default</Typography>
        <CheckboxGroup sizeVariant="small" label="Checkbox Group Label">
            <Checkbox checked>Checked</Checkbox>
            <Checkbox checked="indeterminate">Indeterminate</Checkbox>
            <Checkbox>Unchecked</Checkbox>
            <Checkbox checked disabled>Disabled Checked</Checkbox>
            <Checkbox checked="indeterminate" disabled>Disabled Indeterminate</Checkbox>
            <Checkbox disabled>Disabled</Checkbox>
        </CheckboxGroup>
    </GridItem>
    <GridItem width={[12,12,4,4,4]} css={css` display: block; `}>
        <Typography variant="h4">Error</Typography>
        <CheckboxGroup sizeVariant="small" label="Legal statement" required error="You must agree">
            <Checkbox error onChange={(e, value) => alert(value)}>
                I agree to the terms
            </Checkbox>
        </CheckboxGroup>
    </GridItem>
    <GridItem width={[12,12,4,4,4]} css={css` display: block; `}>
        <Typography variant="h4">Toggle Variant</Typography>
        <CheckboxGroup sizeVariant="small" label="Toggle ">
            <Checkbox variant="toggle" checked>Checked</Checkbox>
            <Checkbox variant="toggle">Unchecked</Checkbox>
            <Checkbox variant="toggle" disabled>Disabled</Checkbox>
            <Checkbox variant="toggle" disabled checked>Disabled Checked</Checkbox>
        </CheckboxGroup>
    </GridItem>
</GridContainer>
```

### Style Extensibility
Checkboxes being themed by the `fieldSets` defaults, as well as `checkbox`-specific defaults, with a component specific override of `css`. These styles can also merge with styles from the theme if you provide `true` to the `mergeCss` property. 

```jsx
const CheckboxGroup = require('../CheckboxGroup').default;
const globalTheme = require('../globals/baseTheme').default;
const GridContainer = require('../GridContainer').default;
const GridItem = require('../GridItem').default;
const ThemeProvider = require('../ThemeProvider').default;

const theme={
    ...globalTheme,
    fieldSets: {
        defaultProps: {
            sizeVariant: 'default',
            color: 'primary'
        }
    },
    checkbox: {
        ...globalTheme.checkbox,
        defaultProps: {
            ...globalTheme.checkbox.defaultProps,
            css: css`
                border: 2px dashed blue;
                border-radius: 3px;
                span[role=checkbox] {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 20px;
                    height: 20px;
                    border-radius: 0px;
                    svg {
                        color: #fff;
                    }
                }
            `
            iconProps: {src: "X"},
            typographyProps: {weight: 300},
            indeterminateIconProps: {src: "MoreHorizontal"},
        }
    }
};

<ThemeProvider theme={theme}>
    <div style={{ width: 200 }}>
        <CheckboxGroup>
            <Checkbox checked>Themed with no instance overrides</Checkbox>
            <Checkbox checked labelPosition="left">Left Label</Checkbox>
            <Checkbox checked variant="toggle" labelPosition="right" iconProps>Toggle Right Label</Checkbox>
            <Checkbox color="warning" checked>Instance checkbox color</Checkbox>
            <Checkbox typographyProps={{weight: 'bold', underline: true}}>
                Instance text style
            </Checkbox>
            <Checkbox css={({ theme }) => `margin-left: -5px; border: 1px solid ${theme.colors.primary.main}; padding: 5px`}>
                Instance custom CSS (using styled-components function)
            </Checkbox>
            <Checkbox css={css`border: 3px solid #222`} mergeCss>
                Custom css that is merged with the theme css. The css property has priority over the theme.
            </Checkbox>
            <Checkbox checked="indeterminate">Indeterminate override in theme</Checkbox>
            <Checkbox checked="indeterminate" indeterminateColor="secondary">Instance indeterminate override</Checkbox>
        </CheckboxGroup>
    </div>
</ThemeProvider>
```

### Controlled Input

```jsx
const Button = require('../Button').default;
const Typography = require('../Typography').default;

const Spacer = () => <div style={{ width: 50 }} />;

class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = { checked: false};
        this.toggle = () => {
            this.setState(({checked}) => {
                return { checked: checked ? false : true };
            });
        };
        this.toggleIndeterminate = () => {
            this.setState(({checked}) => {
                return {
                    checked: checked === "indeterminate" ? false : "indeterminate",
                };
            });
        };
        this.handleChange = (e, currentValue) => {
            this.setState({ checked: currentValue });
        };
    }

    render() {
        let renderValue = this.state.checked ? "checked" : "unchecked";
        if (this.state.checked === "indeterminate") renderValue = "mixed";
        return (
            <div style={{ display: 'flex' }}>
                <Checkbox
                    onChange={this.handleChange}
                    checked={this.state.checked}
                >
                    Controlled Checkbox
                </Checkbox>
                <Spacer/>
                <Button onClick={this.toggle} icon={{src: "Check", position: "left"}} sizeVariant="small" variant="secondary">Toggle Checked</Button>
                <Spacer/>
                <Button onClick={this.toggleIndeterminate} icon={{src: "Minus", position: "left"}} sizeVariant="small" variant="secondary">Toggle Indeterminate</Button>
                <Spacer/>
                <Typography style={{ whiteSpace: 'nowrap', width: '180px' }}>Value: {renderValue}</Typography>
            </div>
        );
    }
}

<Example />
```
