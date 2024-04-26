module.exports = function (plop) {
    plop.setGenerator("widget", {
        description: "Add a new widget",
        prompts: [
            {
                type: "input",
                name: "pageName",
                message: "What is the page name?",
            },
            {
                type: "input",
                name: "name",
                message: "What is widget name (for example LineNotes)?",
            },
            {
                type: "confirm",
                name: "functionComponent",
                message: "Will the widget be a function component?",
            },
            {
                type: "confirm",
                name: "toast",
                message: "Will the widget display toast?",
            },
        ],

        actions: [
            {
                type: "add",
                path:
                    "modules/content-library/src/Widgets/{{pascalCase pageName}}/{{pascalCase pageName}}{{pascalCase name}}.tsx",
                templateFile: "tools/plop/widget.hbs",
            },
            {
                type: "add",
                path: "modules/content-library/src/Pages/{{pascalCase pageName}}Page.tsx",
                templateFile: "tools/plop/page.hbs",
                abortOnFail: false,
            },
        ],
    });
};
