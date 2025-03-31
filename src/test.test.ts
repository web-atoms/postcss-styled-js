import { readdir } from "fs/promises";
import { join } from "path";
import { pathToFileURL } from "url";

const currentDir = join(__dirname, "tests");

class TestFile {

    public error;
    public readonly logs = [] as { log?, error?, warn? }[];

    constructor(public readonly filePath) {

    }

    async run() {
        console.log(`Running ${this.filePath}`);
        const oldLog = console.log;
        const oldError = console.error;
        const oldWarn = console.warn;
        console.log = (... log) => this.logs.push({ log });
        console.warn = (... warn) => this.logs.push( { warn });
        console.error = (... error) => this.logs.push( { error });
        try {
            const ex = await import(pathToFileURL(this.filePath).toString());
            if (ex?.default) {
                try {
                    const p = ex.default();
                    if (p?.then) {
                        await p;
                    }
                } catch (error) {
                    this.error = error;
                    console.error(error);
                }
            }
        } finally {
            console.log = oldLog;
            console.error = oldError;
            console.warn = oldWarn;
        }
    }

    print() {
        for (const { log, warn, error } of this.logs) {
            if (log) {
                console.log( ... log);
                continue;
            }
            if (warn) {
                console.warn(... warn);
            }
            if (error) {
                console.error(... error);
            }
        }
    }
}

async function run() {

    const success = [] as TestFile[];
    const errors = [] as TestFile[];

    for(const dir of await readdir(currentDir, { withFileTypes: true, recursive: true })) {
        if (!/\.js$/i.test(dir.name)) {
            continue;
        }
        const fullPath = join(dir.parentPath, dir.name);
        const testFile = new TestFile(fullPath);
        await testFile.run();
        if (testFile.error) {
            errors.push(testFile);
        } else {
            success.push(testFile);
        }
    }

    for (const element of errors) {
        console.error(`Failed: ${element.filePath}`);
        element.print();
    }
    for (const element of success) {
        console.error(`Success: ${element.filePath}`);
        element.print();
    }
}

run().catch(console.error);