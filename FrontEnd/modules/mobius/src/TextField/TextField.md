### Examples

```jsx
const Typography = require('../Typography').default;
const Link = require('../Link').default;
const Tooltip = require('../Tooltip').default;
const Flag = require('../Icons/Flag').default;
const Search = require('../Icons/Search').default;

const { css } = require('styled-components');

const Spacer = () => <div style={{ height: 50 }} />;
const Container = ({ children }) => <div style={{ maxWidth: 400 }}>{children}</div>;

<>
    <Container>
        <Typography variant="h4">Default</Typography>
        <TextField
            label="Name that song"
            hint={<>{"Hint: it was in "}<Link href="https://www.imdb.com/title/tt0110357/">that one movie</Link></>}
        />
    </Container>
    <Spacer />
    <Container>
        <Typography variant="h4">Custom Css</Typography>
        <TextField
            label="Name that song"
            error="This is a required field"
            css={css` 
                border: 1px solid #222; 
                background: #000; 
                color: #fff;
            `}
        />
    </Container>
    <Spacer />
    <Container>
        <Typography variant="h4">Error</Typography>
        <TextField
            label="Name that song"
            error="This is a required field"
        />
    </Container>
    <Spacer />
    <Container>
        <Typography variant="h4">Disabled</Typography>
        <TextField
            label={<>{"Name that song "}<Tooltip text="It's a trap!" /></>}
            hint="Hint: it was in that one movie"
            error="This is a required field"
            disabled
        />
    </Container>
    <Spacer />
    <Container>
        <Typography variant="h4">Clickable Icon</Typography>
        <TextField
            label="Name that song"
            iconProps={{src: Flag}}
            iconClickableProps={{onClick: () => alert('look behind you!')}}
            placeholder="Look Back"
        />
    </Container>
    <Spacer />
    <Container>
        <form id="form1">
            <Typography variant="h4">Icon as form submission</Typography>
            <TextField
                label="Search"
                iconProps={{src: Search}}
                iconClickableProps={{type: 'submit', form: 'form1', onClick: () => alert('submitted')}}
                placeholder="Find a product"
            />
        </form>
    </Container>
</>
```

### Visual Alternatives

```jsx
const Typography = require("../Typography").default;
const UserCheck = require("../Icons/UserCheck").default;

const Spacer = () => <div style={{ height: 50 }} />;
const Container = ({ children }) => <div style={{ maxWidth: 400 }}>{children}</div>;

<>
    <Container>
        <Typography variant="h4">Small</Typography>
        <TextField sizeVariant="small" label="Label text" hint="Hint: guidance on filling out field" />
    </Container>
    <Spacer />
    <Typography variant="h4">Left Label</Typography>
    <Container>
        <TextField
            required
            sizeVariant="small"
            label="Small required"
            error="This is a required field"
            labelPosition="left"
        />
    </Container>
    <Spacer />
    <Container>
        <TextField border="underline" label="Disabled" hint="Hint: info on field" disabled labelPosition="left" />
    </Container>
    <Spacer />
    <Container>
        <TextField
            border="rounded"
            label="Icon"
            iconProps={{ src: UserCheck }}
            placeholder="placeholder text"
            labelPosition="left"
        />
    </Container>
</>;
```
