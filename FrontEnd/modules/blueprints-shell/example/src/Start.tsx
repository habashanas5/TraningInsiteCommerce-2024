import { loadEditorTemplates } from "@insite/shell-public/EditorTemplatesLoader";

// this registers any custom editor templates that are used by custom pages/widgets
const templates = require.context("./EditorTemplates", true, /\.tsx$/);
const onHotTemplateReplace = loadEditorTemplates(templates);
if (module.hot) {
    module.hot.accept(templates.id, () => {
        onHotTemplateReplace(require.context("./EditorTemplates", true, /\.tsx$/));
    });
}
