********
## Grid

The [GridContainer](#/Components?id=gridcontainer) and [GridItem](#/Components?id=griditem) components allow for responsive layouts based on a 12-unit grid. I recommend using these whenever a responsive layout is required.

In the example below, the content is laid out into 4 columns (each 3 units wide). At the three lowest breakpoints, the content is condensed into 1 column (12 units wide).

```jsx static
<GridContainer gap={15}>
    <GridItem width={[12, 12, 12, 3 ,3]}>
        <TextField label="First Name" />
    </GridItem>
    <GridItem width={[12, 12, 12, 3 ,3]}>
        <TextField label="Last Name" />
    </GridItem>
    <GridItem width={[12, 12, 12, 3 ,3]}>
        <TextField label="Email Address" />
    </GridItem>
    <GridItem width={[12, 12, 12, 3 ,3]}>
        <TextField label="Phone Number" />
    </GridItem>
</GridContainer>
```

Note that the [GridContainer](#/Components?id=gridcontainer) gap is not responsive.

********
## breakpointMediaQueries

The breakpointMediaQueries function generates media queries based on the breakpoints defined in the theme. It's used by these components:
* [GridContainer](#/Components?id=gridcontainer)
* [GridItem](#/Components?id=griditem)
* [Modal](#/Components?id=modal)
* [Page](#/Components?id=page)

It provides a way to create responsive behavior with minimal boilerplate. The first argument of the function is the theme itself, which is available to any styled-components inside a `<ThemeProvider>` context. The second argument is an array of CSS styles, the third (optional) argument is a flag to allow responsive behavior between breakpoints.

In the example below, the background color of the div changes at every breakpoint:

```jsx static
const ResponsiveContainer = styled.div`
    padding: 1em;
    ${({ theme }) => {
        return breakpointMediaQueries(theme, [
            'background: red',
            'background: orange',
            'background: yellow',
            'background: green',
            'background: blue'
        ])
    }}
`;
```

The CSS generated in the example above looks something like this (formatted for clarity):

```css static
.ckKnLw{ padding:1em; }

@media (max-width:575px) {
    .ckKnLw{ background:red; }
}
@media (min-width:576px) and (max-width:767px) {
    .ckKnLw{ background:orange; }
}
@media (min-width:768px) and (max-width:991px) {
    .ckKnLw{ background:yellow; }
}
@media (min-width:992px) and (max-width:1199px){
    .ckKnLw{ background:green; }
}
@media (min-width:1200px){
    .ckKnLw{ background:blue; }
}
```
The 'min' and 'max' values in option should be used when styling is applied across multiple breakpoints. If the same styling is applied at multiple breakpoints, this syntax allows rules to be applied as a min- or max- size only.

```jsx static
const ResponsiveContainer = styled.div`
    padding: 1em;
    ${({ theme }) => {
        return breakpointMediaQueries(theme, [
            'background: red',
            null,
            'background: yellow',
            null,
            null,
        ], 'min')
    }}
`;
```

The CSS generated in the example above looks something like this (formatted for clarity):

```css static
.ckKnLw{ padding:1em; }

@media (min-width:575px) {
    .ckKnLw{ background:red; }
}
@media (min-width:768px) {
    .ckKnLw{ background:yellow; }
}
```

The following examples will result in the same breakpoint behavior, for conciseness, it is better to use the option with the 'min' or 'max' flag:

```js static
    ${({ theme }) => (breakpointMediaQueries(theme, [css` color: red; `, css` color: red; `, css` color: blue; `, css` color: blue; `, css` color: blue; `]))};
    ${({ theme }) => (breakpointMediaQueries(theme, [null,               css` color: red; `, null,                null,                css` color: blue; `], 'max'))};
```

```js static
    ${({ theme }) => (breakpointMediaQueries(theme, [css` color: red; `, css` color: red; `, css` color: blue; `, css` color: blue; `, css` color: blue; `]))};
    ${({ theme }) => (breakpointMediaQueries(theme, [css` color: red; `, null,               css` color: blue; `, null,                null               ], 'min'))};
```

When using the 'min' flag, place the styles in the array spot corresponding to the *smallest* size at which they should apply.
When using the 'max' flag, place the styles in the array spot corresponding to the *largest* size at which they should apply. Styles will apply at any size smaller than that size *up to* the point at which a new style block takes over. 

NOTE: All style blocks must be completely overriden at further breakpoints when using 'min' or 'max' options, and using the css default value for that block is a good way to go.

Instead of: 
```js static
    ${({ theme }) => (breakpointMediaQueries(theme, [css` color: red; `, null, css` color: blue; width: 50%; `, null, null ], 'min'))};
```
Do this: 
```js static
    ${({ theme }) => (breakpointMediaQueries(theme, [css` color: red; width: auto; `, null, css` color: blue; width: 50%; `, null, null ], 'min'))};
```

If breakpoints cannot be overriden, you can use two breakpointMediaQueries to create an exclusionary set: 
Instead of:
```js static
${({ theme }: { theme: BaseTheme }) =>
      breakpointMediaQueries(theme, [css` color: orange; `, css` color: orange; `, css` margin-right: 14px; `, css` margin-right: 14px; `, css` margin-right: 14px; `])}
```

```js static
${({ theme }: { theme: BaseTheme }) => `
    ${breakpointMediaQueries(theme, [null,                  css` color: orange; `, null,                       null,                       null], 'max')}
    ${breakpointMediaQueries(theme, [null,                  null,                  css` margin-right: 14px; `, null,                       null], 'min')} 
`};
```

********
## Hidden
`Hidden` is a component wrapper that hides the enclosed content above, below and between given breakpoints based on theme values. 

For more extensive documentation, see the [Hidden Component documentation](#!/Hidden)

```jsx static
<Hidden above='sm'>
    {/* Will be hidden at any breakpoint above the small size. 
    Will display at small (sm) and extra small (xs) breakpoints. */}
</Hidden>

<Hidden below='lg'>
    {/* Will be hidden at any breakpoint below the large size. 
    Will display at large (lg) and extra large (xl) breakpoints. */}
</Hidden>

<Hidden below='sm' above='lg'>
    {/* Will be hidden at any breakpoint below the large size. 
    Will be hidden at any breakpoint above the large size.
    Will only display at medium (md) breakpoint. */}
</Hidden>
```
