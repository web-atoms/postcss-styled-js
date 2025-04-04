import path from "path";
import * as valueParser from "postcss-value-parser";
import transpileStyled from "./transpileStyled.js";

const jsProcessed = Symbol("jsProcessed-1");

const postCssImportJs =(opts = {}) => {
    return {
        postcssPlugin: "postcss-styled-js",
        Once(root, { AtRule, result}) {
            const promisesList = [];

            root.walkAtRules("import-styled-js", (rule) => {

                if (rule[jsProcessed]) {
                    return;
                }
                rule[jsProcessed] = true;

                promisesList.push((async () => {

                    const params = valueParser(rule.params).nodes;

                    for (const param of params) {
                        if (param.type !== "string") {
                            result.warn(`File path was expected` , {
                                node: rule
                            });
                            continue;
                        }

                        try {

                            await transpileStyled({
                                sourceFile: rule.source.input.file,
                                targets: param.value,
                                AtRule,
                                result,
                                rule
                            })
                        } catch (error) {
                            result.warn(`Compilation failed with ${error.stack ?? error}`, {
                                node: rule
                            });
                        }
                        
                    }

                    rule.remove();

                })());
            });

            return Promise.all(promisesList);
        }
    };    
};
postCssImportJs.postcss = true;
export default postCssImportJs;