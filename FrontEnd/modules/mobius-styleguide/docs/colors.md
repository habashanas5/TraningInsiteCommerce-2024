The storefront uses a range of default colors, which are based on a theme and can be changed within the CMS.

```jsx
const css = require('styled-components').css;
const resolveColor = require('../../mobius/src/utilities/resolveColor.ts').default;
const Typography = require('../../mobius/src/Typography').default;

const Swatch = ({ title, color, contrastColor }) => (
    <div style={{ marginRight: 30 }}>
        <Typography variant="h4">{title}</Typography>
        <div style={{padding: 5, border: '1px solid #ccc', marginTop: 30, borderRadius: 12}}>
            <div style={{
                background: resolveColor(color),
                width: 180,
                height: 180,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
            }}>
                {contrastColor && <Typography css={css` display: block; margin: 5px 10px; `} color={resolveColor(contrastColor)}> {title} Contrast</Typography>}
            </div>
        </div>
    </div>
);

<>
    <div style={{ display: 'flex', marginBottom: 30 }}>
        <Swatch title="Primary" color="primary" contrastColor="primary.contrast"/>
        <Swatch title="Secondary" color="secondary" contrastColor="secondary.contrast"/>
    </div>
    <div style={{ display: 'flex', marginBottom: 30 }}>
        <Swatch title="Background" color="common.background" contrastColor="common.backgroundContrast"/>
        <Swatch title="Accent" color="common.accent" contrastColor="common.accentContrast"/>
        <Swatch title="Border" color="common.border" />
        <Swatch title="Disabled" color="common.disabled" />
    </div>
    <div style={{ display: 'flex', marginBottom: 30 }}>
        <Swatch title="Main Text" color="text.main" />
        <Swatch title="Accent Text" color="text.accent" />
        <Swatch title="Link Text" color="text.link" />
        <Swatch title="Disabled Text" color="text.disabled"/>
    </div>
    <div style={{ display: 'flex' }}>
        <Swatch title="Success" color="success" contrastColor="success.contrast" />
        <Swatch title="Danger" color="danger" contrastColor="danger.contrast" />
        <Swatch title="Warning" color="warning" contrastColor="warning.contrast" />
        <Swatch title="Info" color="info" contrastColor="info.contrast" />
    </div>
</>
```
