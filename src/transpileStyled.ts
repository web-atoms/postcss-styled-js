import { globIterate } from "glob";
import FilePath from "./FilePath";
import path from "path";
import { SourceNode } from "source-map";
import { writeFile } from "fs/promises";
import SourceMapReMap from "./SourceMapReMap";

export default async function transpileStyled({
    sourceFile,
    targets,
    result,
    rule,
    AtRule
}) {

    const sourceFilePath = new FilePath(sourceFile);

    for await(const file of globIterate(targets, {
        absolute: true,
        root: sourceFilePath.dir
    })) {
        const nodeFilePath = new FilePath(file);
        console.log(`Compiling ${nodeFilePath.filePath}`);
        const fileResult = require(nodeFilePath.filePath) as SourceNode;

        if (!fileResult) {
            result.warn(`JavaScript file did not return Style object` , {
                node: rule
            });
            continue;
        }

        const fp = new FilePath(nodeFilePath.dir);
                                
        const sourceRoot = fp.webPath;

        const cssFilePath = nodeFilePath.filePath.replace(".css.js", ".css");

        const csp = new FilePath(cssFilePath);

        const { code: source, map: sourceMap } = fileResult.toStringWithSourceMap({});
        await writeFile(cssFilePath, `${source}\n/*# sourceMappingURL=${csp.name}.map */`, "utf-8");
        await writeFile(cssFilePath + ".map", SourceMapReMap.save(sourceMap, sourceRoot), "utf-8");

        // save file and change import

        const relativePath = new FilePath(cssFilePath)
            .relativeTo(new FilePath(rule.source.input.file));

        const replacedRule = new AtRule({
            name: 'import',
            params: `"${relativePath}"`,
            source: rule.source,
            });

        rule.before(replacedRule);

    }

}