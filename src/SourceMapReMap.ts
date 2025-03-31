import { relative } from "node:path";
import { SourceMapGenerator } from "source-map";

export default class SourceMapReMap {

    static save(s: SourceMapGenerator, relativeRoot) {

        const map = s.toJSON();
        map.sources = map.sources.map((src) => relative(relativeRoot, src).replaceAll("\\", "/"));

        return JSON.stringify(map);

    }

}