import { SourceNode } from "source-map";
import { parse } from "stacktrace-parser";
import { globIterateSync } from "glob";
import * as path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readFileSync } from "node:fs";
import FilePath from "./FilePath.js";

export default class styled {

    /** This will expand `&` only */
    static css(t: TemplateStringsArray, ... a: any[]) {

        const stack = parse(new Error().stack);
        const callee = stack[1];
        const file = callee.file;

        const filePath = new FilePath(file);

        const s = new SourceNode(callee.lineNumber, callee.column || 1, filePath.webPath);
        for (let index = 0; index < t.length; index++) {
            const element = t[index];
            // we need to build map from previous length
            s.add(element);
            if (index < a.length) {
                const arg = a[index];
                if (Array.isArray(arg)) {
                    for (const item of arg) {
                        s.add(item);
                    }
                    continue;
                } 
                if (arg instanceof SourceNode) {
                    s.add(arg);
                    continue;
                }
                s.add(arg);                
            }
        }
        return s;
    }


    static import(src: string | string[]) {

        const stack = parse(new Error().stack);
        const callee = stack[1];
        const file = callee.file;

        const filePath = new FilePath(file);
        const { dir, name } = filePath;


        if (!Array.isArray(src)) {
            src = [src];
        }

        const srcPath = src.map((s) => path.join(dir, s).replaceAll("\\", "/"));

        const s = new SourceNode(callee.lineNumber, callee.column || 1, name);
        console.log({ filePath, dir, srcPath });

        for(const file of globIterateSync(srcPath, { absolute: true })) {
            
            const fp = new FilePath(file);
            const src = fp.relativeTo(filePath);
            const text = `@import "${src}";`;
            console.log(text);
            s.add(text);
        }

        return s;

    }

}