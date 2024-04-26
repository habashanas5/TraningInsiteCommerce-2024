### Example, including custom CSS

```jsx
const css = require('styled-components').css

const links = [{
    children: 'Home',
    href: 'https://home.insitesoft.com'
}, {
    children: 'Category',
    onClick: () => alert('category')
}, {
    children: 'Subcategory',
    href: 'https://subcategory.insitesoft.com'
}, {
    children: 'Current Page'
}];

<>
    <Breadcrumbs links={links.slice(0, 2)} />
    <Breadcrumbs links={links.slice(0, 3)} css={css` margin-top: 1rem;`} />
    <Breadcrumbs links={links} css={css` margin-top: 1rem;`} />
</>
```
