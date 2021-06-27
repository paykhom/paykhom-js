"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.TSCONFIG = void 0;
const ts = require("typescript");
const lodash_1 = require("lodash");
exports.TSCONFIG = {
    allowJs: true,
    allowUnreachableCode: true,
    allowUnusedLabels: true,
    checkJs: false,
    extendedDiagnostics: false,
    experimentalDecorators: true,
    jsx: ts.JsxEmit.React,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    noEmitOnError: false,
    noUnusedLocals: true,
    noUnusedParameters: true,
    stripInternal: true,
    target: ts.ScriptTarget.ES2016,
    outDir: "build",
    skipLibCheck: true,
    traceResolution: false
};
function parse(sourceFiles, config = exports.TSCONFIG) {
    let c = lodash_1.defaults({}, config, exports.TSCONFIG);
    let compilerHost = ts.createCompilerHost(c);
    return ts.createProgram(sourceFiles, c, compilerHost);
}
exports.parse = parse;
