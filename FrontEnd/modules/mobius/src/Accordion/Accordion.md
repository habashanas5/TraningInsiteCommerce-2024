### Example

```jsx
const AccordionSection = require("../AccordionSection").default;
const ManagedAccordionSection = require("../AccordionSection/ManagedAccordionSection").default;
const Button = require("../Button").default;
const TextField = require("../TextField").default;
const Typography = require("../Typography").default;

const typographyProps = {
    as: "div",
    style: {
        marginBottom: "1em",
    },
};

<Accordion headingLevel={4}>
    <ManagedAccordionSection title="Accessibility" initialExpanded={true} onTogglePanel={() => console.log("toggling")}>
        <Typography {...typographyProps}>
            The title of each accordion header is contained in an element with role button.
        </Typography>
        <Typography {...typographyProps}>
            Each accordion header button is wrapped in an element with role heading that has a value set for aria-level
            that is appropriate for the information architecture of the page.
        </Typography>
        <TextField
            label="Focusable Element:"
            placeholder="Hooray for keyboard navigation!"
            hint="When the panel is collapsed, this input is not focusable."
        />
    </ManagedAccordionSection>
    <AccordionSection title="Details">
        <Typography {...typographyProps}>
            If the native host language has an element with an implicit heading and aria-level, such as an HTML heading
            tag, a native host language element may be used.
        </Typography>
        <Typography {...typographyProps}>
            The button element is the only element inside the heading element. That is, if there are other visually
            persistent elements, they are not included inside the heading element.
        </Typography>
        <Button>Another Focusable Element</Button>
    </AccordionSection>
    <AccordionSection title="Specifications">
        <Typography {...typographyProps}>
            If the accordion panel associated with an accordion header is visible, the header button element has
            aria-expanded set to true. If the panel is not visible, aria-expanded is set to false.
        </Typography>
        <Typography {...typographyProps}>
            The accordion header button element has aria-controls set to the ID of the element containing the accordion
            panel content.
        </Typography>
        <Button>Another Focusable Element</Button>
    </AccordionSection>
    <AccordionSection title="Documents">
        <Typography {...typographyProps}>
            Optionally, each element that serves as a container for panel content has role region and aria-labelledby
            with a value that refers to the button that controls display of the panel.
        </Typography>
        <Typography {...typographyProps}>
            Avoid using the region role in circumstances that create landmark region proliferation, e.g., in an
            accordion that contains more than approximately 6 panels that can be expanded at the same time.
        </Typography>
        <Typography>
            Role region is especially helpful to the perception of structure by screen reader users when panels contain
            heading elements or a nested accordion.
        </Typography>
    </AccordionSection>
</Accordion>;
```

### Custom Css

```jsx
const AccordionSection = require("../AccordionSection").default;
const Button = require("../Button").default;
const TextField = require("../TextField").default;
const Typography = require("../Typography").default;

import { css } from "styled-components";

const typographyProps = {
    as: "div",
    style: {
        marginBottom: "1em",
    },
};

<Accordion
    headingLevel={4}
    css={css`
        background: #000;
        color: #fff;
    `}
    mergeCss={true}
>
    <AccordionSection
        title="Accessibility"
        headerProps={{
            css: css`
                border: 5px solid #222;
                border-radius: 3px;
            `,
        }}
        panelProps={{
            css: css`
                background: green;
                color: #fff;
            `,
        }}
    >
        <Typography {...typographyProps}>
            The title of each accordion header is contained in an element with role button.
        </Typography>
        <Typography {...typographyProps}>
            Each accordion header button is wrapped in an element with role heading that has a value set for aria-level
            that is appropriate for the information architecture of the page.
        </Typography>
        <TextField
            label="Focusable Element:"
            placeholder="Hooray for keyboard navigation!"
            hint="When the panel is collapsed, this input is not focusable."
        />
    </AccordionSection>
    <AccordionSection title="Details">
        <Typography {...typographyProps}>
            If the native host language has an element with an implicit heading and aria-level, such as an HTML heading
            tag, a native host language element may be used.
        </Typography>
        <Typography {...typographyProps}>
            The button element is the only element inside the heading element. That is, if there are other visually
            persistent elements, they are not included inside the heading element.
        </Typography>
        <Button>Another Focusable Element</Button>
    </AccordionSection>
</Accordion>;
```

### Controlled Accordion

```jsx
const AccordionSection = require("../AccordionSection").default;
const Button = require("../Button/Button.tsx").default;
const TextField = require("../TextField").default;
const Typography = require("../Typography").default;

const Spacer = () => <div style={{ width: 50 }} />;

class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = { expanded: true };
        this.toggle = () => {
            this.setState(({ expanded }) => {
                return { expanded: !expanded };
            });
        };
    }

    render() {
        return (
            <div style={{ display: "flex" }}>
                <Accordion headingLevel={4}>
                    <AccordionSection
                        title="Controlled Panel"
                        expanded={this.state.expanded}
                        onTogglePanel={this.toggle}
                    >
                        <Typography>Panel content.</Typography>
                    </AccordionSection>
                </Accordion>
                <Spacer />
                <Button onClick={this.toggle}>Toggle Expanded</Button>
                <Spacer />
                <Typography style={{ whiteSpace: "nowrap", width: "180px" }}>
                    Expanded: {this.state.expanded ? "true" : "false"}
                </Typography>
            </div>
        );
    }
}

<Example />;
```
