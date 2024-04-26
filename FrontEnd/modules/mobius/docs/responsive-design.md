# Guidelines for Responsive Design in Mobius

Mobius has some basic provisions for responsive design.

## Breakpoints in the Theme

The theme currently provides breakpoints and maximum allowed widths per breakpoint:

```jsx static
const baseTheme = {
    breakpoints: {
        keys: ['xs', 'sm', 'md', 'lg', 'xl'],
        values: [0, 576, 768, 992, 1200],
        maxWidths: [540, 540, 720, 960, 1140]
    },
    // etc
}
```

The breakpoint values come from Bootstrap and indicate 5 basic ranges of window width:

- 0 to 575px
- 576px to 767px
- 768px to 991px
- 992px to 1199px
- above 1200px

The `maxWidths` indicate the maximum width for any containers in those 5 ranges. The [Page](https://github.com/InsiteSoftware/mobius/blob/master/packages/mobius-core/src/Page/Page.js) and [GridContainer](https://github.com/InsiteSoftware/mobius/blob/master/packages/mobius-core/src/GridContainer/GridContainer.js)
components make use of these values.

Breakpoints and maxWidths are defined in the theme so that they may be customized:

```jsx static
import baseTheme from '@insite/mobius/globals/baseTheme';

const customTheme = {...baseTheme};

customTheme.breakpoints.values: [0, 800, 1200];
customTheme.breakpoints.maxWidths: [800, 800, 1100];

export default customTheme;
```

For further information, review the `responsive.md` file in mobius-styleguide. 
