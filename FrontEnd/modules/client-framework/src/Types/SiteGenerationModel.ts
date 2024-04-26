export interface RootGenerationModel {
    pages?: PageGenerationModel[];
    pageCreator?: string;
}

export interface PageGenerationModel extends RootGenerationModel {
    type: string;
    name: string;
    urlSegment: string;
    excludeFromNavigation?: boolean;
}

export interface SiteGenerationModel {
    header: RootGenerationModel;
    home: RootGenerationModel;
    footer: RootGenerationModel;
}

export interface TemplateInfo {
    fullPath: string;
    name: string;
}
