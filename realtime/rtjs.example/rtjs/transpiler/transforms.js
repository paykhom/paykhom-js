"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = exports.DEFAULT_TRANSFORM_CONFIG = exports.REALTIME_BUDGET_IDENTIFIER = exports.REALTIME_MODULE_NAME = exports.REALTIME_DECORATOR = void 0;
const ts = require("typescript");
const lodash_1 = require("lodash");
/**
 * decorator name for generating generators
 */
exports.REALTIME_DECORATOR = "rtjs";
exports.REALTIME_MODULE_NAME = "rtjs";
/**
 * name for the global budget variable
 */
exports.REALTIME_BUDGET_IDENTIFIER = "REALTIME_BUDGET";
/**
 * defaults for the transformation config objects
 */
exports.DEFAULT_TRANSFORM_CONFIG = Object.freeze({
    forLoops: {
        transform: true,
        beforeLoop: true,
        onlyBeforeTopLevelLoops: true,
        insideLoop: true
    },
    whileLoops: {
        transform: true
    },
    doLoops: {
        transform: true // no in use
    },
    callStatements: {
        insertYieldBeforeCall: true
    },
    ifStatements: {
        beforeIfStatements: false
    }
});
let rtjsMethods = [];
/**
 * returns a single yield statement with the message Scheduler::Continue
 * @returns ast objects for ```yield SchedulerMessage.Continue```
 */
function createYieldStatement() {
    let propertyAccess = ts.createPropertyAccess(ts.createPropertyAccess(ts.createThis(), "SchedulerMessage"), "Continue");
    let yieldExpression = ts.createYield(propertyAccess);
    return ts.createExpressionStatement(yieldExpression);
}
/**
 * returns a single return statement with Scheduler::TerminateTask message; indicates, that the task is finished
 * @returns ast objects for ```return SchedulerMessage.TerminteTask```
 */
function createReturnStatement() {
    let propertyAccess = ts.createPropertyAccess(ts.createPropertyAccess(ts.createThis(), "SchedulerMessage"), "TerminateTask");
    return ts.createReturn(propertyAccess);
}
/**
 * modify the list of statements in a block
 * @param config configuration variable
 * @param block the block of statements to be modified
 */
function modifyBlock(config, block) {
    block.statements = modifyStatementList(config, block.statements);
    return block;
}
/**
 * returns property access of rtjs's budget variable
 * @returns ```this.rtjs.REALTIME_BUDGET```
 */
function createREALTIMEBudget() {
    return ts.createPropertyAccess(ts.createPropertyAccess(ts.createPropertyAccess(ts.createThis(), "rtjs"), "scheduler"), exports.REALTIME_BUDGET_IDENTIFIER);
}
/**
 * returns a budgeted version of the yield statement
 * @returns ```if ( --this.rtjs.REALTIME_BUDGET < 0 ) { yield this.Schedulermessage.Continue }```
 */
function createBudgetedYieldStatement() {
    let checkExpression = ts.createBinary(ts.createPrefix(ts.SyntaxKind.MinusMinusToken, createREALTIMEBudget()), ts.createToken(ts.SyntaxKind.LessThanEqualsToken), ts.createLiteral(0)); // creates (( --rtjs.REALTIME_BUDGET ) > 0)
    let thenBlock = ts.createBlock([createYieldStatement()]);
    return ts.createIf(checkExpression, thenBlock);
}
/**
 * modifies for-loops according to the config variable
 * @param config configuration variable
 * @param forStatement AST node identifying the for-loop-statement
 * @returns <budgetYield> <for ( ..; ..; ..)> { <bugetYield> <forbody>}
 */
function modifyFor(config, forStatement) {
    forStatement.statement = modifyBlock(config, forStatement.statement);
    if (config.forLoops.transform) {
        // transform if loops
        if (config.forLoops.insideLoop) {
            let yieldPoint = createBudgetedYieldStatement();
            let block = forStatement.statement;
            forStatement.statement = ts.updateBlock(block, [yieldPoint].concat(block.statements));
        }
        if (config.forLoops.beforeLoop) {
            if (config.forLoops.onlyBeforeTopLevelLoops) {
                for (let parent = forStatement.parent; parent != undefined; parent = parent.parent) {
                    if (ts.isForStatement(parent)) {
                        return [forStatement];
                    }
                }
            }
            return [createBudgetedYieldStatement(), forStatement];
        }
        return [forStatement];
    }
    else {
        // leave everything as it is
        return [forStatement];
    }
}
/**
 * modifies while-loops according to the config variable
 * @param config configuration variable
 * @param whileStatement AST node identifying the while-loop-statement
 * @returns <while ( ... )> { <bugetYield> <whilebody>}
 */
function modifyWhile(config, whileStatement) {
    whileStatement.statement = modifyBlock(config, whileStatement.statement);
    if (config.whileLoops.transform) {
        // transform if loops
        let yieldPoint = createBudgetedYieldStatement();
        let block = whileStatement.statement;
        whileStatement.statement = ts.updateBlock(block, [yieldPoint].concat(block.statements));
        return [whileStatement];
    }
    else {
        // leave everything as it is
        return [whileStatement];
    }
}
/**
 * modify if statements according to the config variable
 * @param config configuration variable
 * @param ifStatement the AST node identifying the if-statement
 * @returns <budgetYield> <if (..)> {} [else {}]
 */
function modifyIf(config, ifStatement) {
    if (config.ifStatements.beforeIfStatements) {
        ifStatement.thenStatement = modifyBlock(config, ifStatement.thenStatement);
        if (ifStatement.elseStatement) {
            ifStatement.elseStatement = modifyBlock(config, ifStatement.elseStatement);
        }
        return [createBudgetedYieldStatement(), ifStatement];
    }
    else {
        return [ifStatement];
    }
}
/**
 * creates an expression like ```yield this.rtjs.spawnTaskFromFn(node.bind(node, SIZE), this.name + "->" + node.name, this.priority)```
 */
function createTaskSpawn(node) {
    let thisRtjsProperty = ts.createPropertyAccess(ts.createThis(), "rtjs"); // this.rtjs
    let spawnTaskFromFnProperty = ts.createPropertyAccess(thisRtjsProperty, "spawnTaskFromFn"); // this.rtjs.spawnTaskFromFn
    let nodeIdentifier = node.expression;
    let nodeArgs = ts.createArrayLiteral(node.arguments);
    let thisNameProperty = ts.createPropertyAccess(ts.createThis(), "name");
    let taskName = ts.createBinary(thisNameProperty, ts.createToken(ts.SyntaxKind.PlusToken), ts.createPropertyAccess(nodeIdentifier, "name")); // this.name + node.name
    let taskPrio = ts.createPropertyAccess(ts.createThis(), "priority"); // this.priority
    let taskDeadline = ts.createPropertyAccess(ts.createThis(), "deadline"); // this.deadline
    let taskConfigProps = ts.createNodeArray([
        ts.createPropertyAssignment("name", taskName),
        ts.createPropertyAssignment("priority", taskPrio),
        ts.createPropertyAssignment("deadline", taskDeadline),
    ]);
    let taskConfig = ts.createObjectLiteral(taskConfigProps, false);
    let args = ts.createNodeArray([nodeIdentifier, nodeArgs, taskConfig]);
    let callExpression = ts.createCall(spawnTaskFromFnProperty, undefined, args);
    let yieldExpression = ts.createYield(callExpression);
    return yieldExpression;
}
/**
 * inserts a budgeted yield before function calls
 * @param config configuration variable
 * @param expressionStatement the statement to be altered
 */
function modifyExpresionStatement(config, expressionStatement) {
    if (ts.isCallExpression(expressionStatement.expression)) {
        return [createBudgetedYieldStatement(), expressionStatement];
    }
    return [expressionStatement];
}
/**
 * modifies a list of statements
 * @param config configuration variable
 * @param statements the list of statements of the block
 * @param additional list of statements to be concatted after the modification of statements
 * @returns the new list of statements
 */
function modifyStatementList(config, statements, additional = []) {
    return ts.createNodeArray(lodash_1.flatMap(statements, (statement => {
        if (ts.isBlock(statement)) {
            return modifyBlock(config, statement);
        }
        else if (ts.isWhileStatement(statement)) {
            return modifyWhile(config, statement);
        }
        //else if ( ts.isDoStatement ( statement ) {
        //return modifyDoStatement ( config, statement as ts.DoStatement )
        //}
        else if (ts.isForStatement(statement)) {
            return modifyFor(config, statement);
        }
        else if (ts.isIfStatement(statement)) {
            return modifyIf(config, statement);
        }
        else if (ts.isExpressionStatement(statement)) {
            return modifyExpresionStatement(config, statement);
        }
        return statement;
    })).concat(additional));
}
/**
 * modifies a function according to the config values
 * @param ctx
 * @param config configuration variable
 * @param node the function node
 * @returns
 */
function modifyFunction(ctx, config, node) {
    let body = node.body;
    if (!body) {
        return;
    }
    let visitor = (node) => {
        // await -> yield
        if (ts.isAwaitExpression(node)) {
            let yieldExpression = ts.createYield(node.expression);
            yieldExpression.parent = node.parent;
            return yieldExpression;
        }
        if (ts.isCallExpression(node)) {
            let comment = getLeadingCommentForNode(node.parent.parent);
            if (comment == `@${exports.REALTIME_DECORATOR}`) {
                return createTaskSpawn(node);
            }
        }
        return ts.visitEachChild(node, visitor, ctx);
    };
    body = ts.visitNode(body, visitor);
    body.statements = modifyStatementList(config, body.statements, [createReturnStatement()]);
    node.body = body;
}
/**
 * returns the comment string before the node
 * @param node node for which to get the comment
 * @returns comment string
 */
function getLeadingCommentForNode(node) {
    let sourceText = node.getSourceFile().getFullText();
    let commentToken = lodash_1.last(ts.getLeadingCommentRanges(sourceText, node.getFullStart()));
    if (commentToken) {
        return sourceText
            .substring(commentToken.pos + 2, commentToken.kind === ts.SyntaxKind.SingleLineCommentTrivia ? commentToken.end : commentToken.end - 2)
            .trim();
    }
}
/**
 * tries to find the decorator REALTIME_DECORATOR for the given node, if found: add node to REALTIME-function list
 * @param node find the decorator for this node
 * @returns node if the decorator was found, nothing if not
 */
function asREALTIMEFunctionLike(node) {
    if (node.decorators) {
        // find all decorators which are REALTIME_DECORATOR
        let newDecorators = lodash_1.reject(node.decorators, d => ts.isIdentifier(d.expression)
            && d.expression.text == exports.REALTIME_DECORATOR);
        // if REALTIME_DECORATOR not found(?????)
        if (node.decorators.length === newDecorators.length) {
            return;
        }
        node.decorators = ts.createNodeArray(newDecorators);
        // make generator and add to list of REALTIME-functions
        ensureGeneratorFunction(node);
        rtjsMethods.push(node.id);
        return node;
    }
    // try to scrape REALTIME_DECORATOR from the comment above
    let comment = getLeadingCommentForNode(node);
    if (comment == `@${exports.REALTIME_DECORATOR}`) {
        ensureGeneratorFunction(node);
        rtjsMethods.push(node.id);
        return node;
    }
}
/**
 * make the node a generator and remove the async keyword
 * @param node function-like to be evaluated
 */
function ensureGeneratorFunction(node) {
    node.asteriskToken = ts.createNode(ts.SyntaxKind.AsteriskToken);
    if (!node.modifiers) {
        return;
    }
    let newModifiers = lodash_1.reject(node.modifiers, m => m.kind === ts.SyntaxKind.AsyncKeyword);
    node.modifiers = ts.createNodeArray(newModifiers);
}
/**
 * starts the transformation, looks for REALTIME_DECORATOR and starts transforming the decorated function-likes
 * @param config configuration variable
 */
function transform(config = exports.DEFAULT_TRANSFORM_CONFIG) {
    return function (ctx) {
        let visitor = (node) => {
            // is the node a method or function declaration
            if (ts.isMethodDeclaration(node) || ts.isFunctionDeclaration(node)) {
                // transform to generator and recurse into the function
                let methodNode = asREALTIMEFunctionLike(node);
                if (methodNode) {
                    modifyFunction(ctx, config, methodNode);
                }
            }
            // recurse over the children
            return ts.visitEachChild(node, visitor, ctx);
        };
        return (sf) => ts.visitNode(sf, visitor);
    };
}
exports.transform = transform;
