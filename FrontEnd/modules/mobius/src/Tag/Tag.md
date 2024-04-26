### Tag Group

```jsx
<div style={{
    width: '400px',
    display: 'flex',
    flexWrap: 'wrap',
}}>
    <Tag>
        This text will wrap and the x will stay in the top right.
    </Tag>
    <Tag>
        Standard Tag
    </Tag>
    <Tag deletable={false}>
        Persistent Tag
    </Tag>
    <Tag disabled>
        Disabled tag
    </Tag>
</div>
```

### Custom Styled Tags

```jsx
const { css } = require('styled-components');
const Check = require('../Icons/Check').default;

<div style={{
    width: '250px',
    display: 'flex',
    flexWrap: 'wrap',
}}>
    <Tag iconProps={{ src: Check }}>
        A Checkbox tag.
    </Tag>
    <Tag color="warning">
        A warning tag
    </Tag>
    <Tag css={css` &:hover { color: blue; background: red; }`}>
        A custom tag
    </Tag>
</div>
```

### Groups of tags arranged by their parent
Tag size and arrangement is largely governed by the parent container. `Tag` provides two style defaults `horizontalStyles` and `verticalStyles` that cover two standard use cases, however tags can also be used in an unstyled group or a custom-styled group based on the needs of the application. 

```jsx
const styled = require('styled-components').default;
const { horizontalStyles, verticalStyles } = require('./Tag')
const Typography = require('../Typography').default;
const { css } = require('styled-components');
const Check = require('../Icons/Check').default;

const HorizontalGroup = styled.div([horizontalStyles]);
const VerticalGroup = styled.div([verticalStyles]);

const exampleTags = [
    <Tag>
        Brand: Hero Manufacturing
    </Tag>,
    <Tag>
        Search: 18v
    </Tag>,
    <Tag>
        Power tool type: cordless
    </Tag>,
    <Tag>
        Fastener type / Gauge: 18 Gauge Brad Nails
    </Tag>,
];

<>
    <Typography variant="h3" css="margin-top: 0;">Horizontal Group</Typography>
    <HorizontalGroup>{exampleTags}</HorizontalGroup>
    <Typography variant="h3" css="margin-top: 12px;">Vertical Group</Typography>
    <VerticalGroup>{exampleTags}</VerticalGroup>
    <Typography variant="h3" css="margin-top: 12px;">Unstyled Group</Typography>
    <div>{exampleTags}</div>
</>
```
