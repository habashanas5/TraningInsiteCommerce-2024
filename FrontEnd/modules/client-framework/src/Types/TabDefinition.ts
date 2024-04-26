export interface TabDefinition {
    displayName: string;
    sortOrder: number;
    /** Sets the `data-test-selector` attribute on the DOM element. */
    dataTestSelector?: string;
}
