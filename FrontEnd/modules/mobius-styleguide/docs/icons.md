A variety of icons are available to the storefront by default to be used as `src` in [Icon](#/Foundations?id=icon). 

Use via `import [iconName] from '@insiteSoft/mobius/src/Icons/[iconName]';` 

then `<Icon src={[iconName]} />`

```jsx

const css = require('styled-components').css;
const Icon = require('../../mobius/src//Icon').default;
const Typography = require('../../mobius/src//Typography').default;
const iconsObject = require('../../mobius/src//Icons/commonIcons').default;

const IconDemo = ({ iconSrc, name }) => (
    <div style={{ 
        textAlign: 'center', 
        borderRadius: 8, 
        border: '1px solid #ccc', 
        padding: 15, 
        overflowWrap: 'break-word',
    }}>
        <Icon src={iconSrc} size={32} css={{marginBottom: 15}}/>
        <Typography css={ css` display: block; `} size={12} color="text.accent">{name}</Typography>
    </div>
);

<>
    <div style={{ 
        display: 'grid', 
        marginBottom: 30, 
        'grid-template-columns': 'repeat(auto-fill,minmax(110px,1fr))',
        gridColumnGap: '20px',
        gridRowGap: '20px',
    }}>
        {Object.keys(iconsObject).map((iconKey) => {
            const src = iconsObject[iconKey];
            return (<IconDemo iconSrc={src} name={iconKey} />)
        })}
    </div>
</>
```

