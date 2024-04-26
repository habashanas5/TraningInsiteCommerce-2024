# Changelog

## Next

**Breaking Changes**
- `AccordionSection`: is now either fully controlled or fully uncontrolled. 

**Improvements**
- `AccordionSection`: new props `expandIconProps`, `collapseIconProps`, and `toggleTransition` to provide more granular control over iconography. 
- `DataTable`: Added sortable features to `DataTableHeader`. Style extensibility is through DataTable in theme, and can also be applied to components individually.
- `DatePicker`: added a padding to fix the display on mobile.
- `Pagination`: set button type to "button".
- `DataTableHeader`: set button type to "button" for Clickable element.

## Insite Commerce 5.0.2 cut 6/18 docs release

**Breaking changes**
- `CheckboxGroup`: renamed `onChange` prop into to `onChangeHandler` to avoid HTML attribute collisions.
- `Link`: removed `iconProps`. Use `icon.iconProps` instead.
- `PanelMenu`: removed the `dataTestSelector` prop in lieu of using `data-test-selector` HTML attribute.

**Improvements**
- Accessibility improvements:
    - Modify base theme for appropriate contrast ratios.
    - `RadioGroup` and `CheckboxGroup` will render a div rather than a fieldset when it contains only one radio or checkbox.
    - `Tooltip` added a prop named `triggerAltText` and includes it as alt text for the trigger icon.
    - `DatePicker` buttons provide alt text.
    - `FileUpload` is more keyboard friendly and only provides one label.
    - `TextField` added a `clickableText` prop that renders a visually hidden text to describe the clickable.
- Added styling extension points to allow for theme and prop styling on:
    - `PanelRow` within `PanelMenu`.
    - `Toast` close button icon and icon source per toast type.
    - `Pagination` navigation button icons.
    - `Modal` close button icon.
    - `LazyImage` component as a whole.
    - `Drawer` close button icon. 
- `AccordionSection`: added `onTogglePanel` event.
- `Checkbox`: added an `indeterminate` checked type.
- `DynamicDropdown`: 
    - Text displaying selected option is now fully contained to the visual form field. 
    - Options receive a pointer cursor
    - Prevents browser autocomplete.
- `FileUpload`: added a "clear" button. Added a visual transition for file name appearance and clear button appearance. Both are style extensible.
- `Icon`: 
    - Added named export `IconMemo`. Use when the same icon is used multiple times within a page, or a set of pages that can be reasonably expected to be rendered in the same session.
    - Prop `src` will interpret a string matching the filename in `Icons/*.tsx` and render the corresponding icon. Icons whose source is provided this way are dynamically loaded in a second module. The initial site render speed is increased. Also useful for theme and style extensions.
- `LazyImage`: added `onLoad` and `onError` props. Both are callback functions.
- `Menu`: improvements to behavior closing menu when menu item is clicked.
- `PanelMenu`: If a menu item has `excludeFromNavigation` set to true, it will no longer be rendered. 
- `Tag`: now respects `iconProp` color when set.
- `Toast`: `body` prop now accepts `ReactNode` instead of `string`. This affects the `addToast` function when using `ToasterContext`.
- `Tooltip`: semantic improvements to the tooltip elements to allow for correct styling. 

## 1.0.0-beta.3

**Breaking changes**
- Refactoring the app-controlling elements of the `Modal` component into a generic `Overlay` component, including renaming `overlay` within `Modal` to `scrim` in `cssOverrides`, props (`closeOnScrimClick`) and componentry. 
- `TokenXFrame` has been renamed `TokenExFrame` to reflect the accurate name of the service.
- Removed `RelativeLink` and refactored how `Clickable` and `Link` interact. Link is now opt-out for SPA routing on relative links. 
- Full refactor of `DatePicker` to use `react-datetime-picker` instead of `react-day-picker`.

**New Components**
- `PanelMenu`
- `CascadingMenu`
- `Drawer`
- `Popover` - utility component
- `Overlay` - utility component
- `Tag`

**Improvements**
- `DataTable` now uniformly implements wrapping strings in `Typography` and accepts themable typography props for header and cells.
- `Button` now only wraps children in typography if those children are strings. 
- `Pagination` component now accepts a `currentPageButtonVariant` prop to determine the visual styles applied to the button denoting the current page. 
- `FormField` components now accepts a `backgroundColor` prop to determine the color of the form field's background and field icon background. 
- `LazyImage` component now provides a better experience when the image fails to load. 
- Upgraded to `react-styleguidist` v^10.6.2.
- `GridItem` modified so that it doesn't use the border for padding.
- Modified implementation of font import. Due to this change, imported fonts do not take effect in the live styleguide, however they will take effect in the application. 

## 1.0.0-beta.2

**Breaking changes**
- All `size` properties on components that accepted non-numeric values (e.g. 'small', 'medium', 'large'), have been renamed `sizeVariant`. Affected components include: 
    - `Button`
    - `Modal`
    - `FormField` - `TextField`, `TextArea`, `DatePicker`, `FileUpload`, `Select`, `DynamicDropdown`, & `TokenExFrame`
    - `FieldSet` - `Radio`, & `Checkbox`
- Conversion to typescript and concomitant clarification of type definitions may cause formerly silent typing issues to produce errors.
- All `css` and `cssOverrides` only accept the styled-components `css` helper. 

**New Components**
- Dynamic Dropdown [demo](https://insitesoftware.github.io/insite-commerce/#!/DynamicDropdown) which is a type of `FormField`.
- Toggle [demo](https://insitesoftware.github.io/insite-commerce/#!/Checkbox), which is a variant of `Checkbox`.

**Improvements**
- `FormField` accepts `labelId` to apply to label for use in `aria-labelledby`.
- `DatePicker` `onChange` prop documented and tested. `DatePicker` can be fully controlled.
- Styling changes on `Radio`.
- Helper functions are documented in the [Styleguide](https://insitesoftware.github.io/insite-commerce/#section-helper-functions).
- Disabled `FormField`s look disabled.
- Introduced three Header `Typography` variants: `headerPrimary`, `headerSecondary`, and `headerTertiary`.
- Allow `DataTable` to be themable via `cssOverride` object.
- `TextField` will render a clickable icon when passed a `clickableProps` prop.
- `Clickable` now prefers rendering a `Link` rather than rendering a `Button`. This provides value for SEO and accessibility. The existing behavior of `onClick` execution followed by `href` navigation is maintained when both are present.
- `Checkbox` receives size by default from `CheckboxGroup`.
- Upgraded to `react-styleguidist` v9.1.16

## 1.0.0-beta.1

**Breaking changes**
- `Typography` variants no longer accept pseudo-jss style objects, but props objects including a CSS override that can contain JSS.
- Meaningful re-write of theme shadows and colors to provide a more semantic-based theming API. When used consistently, colors now allow for robust theming, as demonstrated in the [Second ThemeProvider Demo](https://insitesoftware.github.io/insite-commerce/#!/ThemeProvider/3).
- Upgraded Styleguidist to version 9.
- Meaningful changes to the `Pagination` component, including:
    - 1-based numbering rather than 0-based, to allow for consistency with InsiteCommerce APIs.
    - Styling changes for consistency and improved customizability.
- `Pagination`, `DatePicker`, `TextField`, `Select` and `TokenExFrame` accept `iconProps` instead of `iconSrc`.
- `ThemeProvider` component no longer defaults to providing global default styles, but accepts two props, `createGlobalStyle` and `createChildGlobals` to govern creation of global styles and child styles for typography and css resets. This allows for multiple themes to coexist while providing a mechanism to explicitly apply styles to the `body`.
- `Button` theme object `defaultProps` removed in lieu of explicitly setting properties on each theme `Button` variant.
- `Button` when passed an icon will only apply button styles to an icon when passed as a `ButtonIcon`.
- Various typescript definition modifications.

**New components**
- Text Area input [demo](https://insitesoftware.github.io/insite-commerce/#!/TextArea)
- Overflow Menu [demo](https://insitesoftware.github.io/insite-commerce/#!/OverflowMenu)
- File Upload input [demo](https://insitesoftware.github.io/insite-commerce/#!/FileUpload)
- Toast (and Toaster) [demo](https://insitesoftware.github.io/insite-commerce/#!/Toast)
- TokenExFrame [demo](https://insitesoftware.github.io/insite-commerce/#!/TokenExFrame)

**Improvements**
- `Typography` component can accept a font family, and font family can be imported globally, as demonstrated in the [First ThemeProvider Demo](https://insitesoftware.github.io/insite-commerce/#!/ThemeProvider/1).
- `FormField`s (`TextField`, `TextArea`, `DatePicker`, `FileUpload`, `Select`, & `TokenExFrame`):
    - Now accept a `labelPosition="left"` prop that allows the label to display to the left of the FormField.
- `FieldSet`s (`Checkbox`, `Radio`):
    - Accept and render errors consistently.
- Both `FieldSet`s and `FormField`s:
    - Now accept any node as a `label`, `error` and `hint`, so that links, tooltips, etc can be included in these areas.
    - Are styled consistently out of the box when it comes to `label`, `hint` and `error`.
- Tertiary `Button` variant.
- `Radio` component displays correctly in Safari. 
- Tests pass!
- A subset of Icons can be viewed in the Style Guide.
- Focus object from theme is now being used to style every focusable element in Mobius.
- `Breadcrumb` link does not override theme link properties.
- Default theme provides `FormFields` border style `rectangle` instead of `underline`. 
- `OverflowMenu` transition improvement
- Components with internal `Typography` components which accept `typographyProps` objects via theme or prop will now accept variants and logically apply variant properties in a cascade.   

## 1.0.0-beta.0

Let there be Mobius.
