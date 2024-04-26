export default interface PermissionsModel {
    canAddWidget: boolean;
    canDeleteWidget: boolean;
    canMoveWidgets: boolean;
    canEditWidget: boolean;

    canCreatePage: boolean;
    canDeletePage: boolean;
    canCreateVariant: boolean;
    canCopyPage: boolean;
    canMovePages: boolean;

    canAddSystemWidget: boolean;
    canDeleteSystemWidget: boolean;
    canMoveSystemWidgets: boolean;
    canEditSystemWidget: boolean;
    canEditSystemWidgetSettings: boolean;

    canCreateExperiments: boolean;

    canApproveContent: boolean;
    canPublishContent: boolean;
    canRollbackContent: boolean;

    canEditGlobalStyleGuide: boolean;
    canUseSearchDataMode: boolean;
    canUseAdvancedFeatures: boolean;
}
