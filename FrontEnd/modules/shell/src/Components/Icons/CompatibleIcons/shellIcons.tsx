import { buildIconsObject } from "@insite/mobius/Icons/commonIcons";

// if we don't exclude the current file, we end up with a circular dependency and module loading fails
const icons = require.context("./", true, /\/(?!shellIcons).+\.tsx$/);
const shellIconsObject = buildIconsObject(icons);

export default shellIconsObject;
