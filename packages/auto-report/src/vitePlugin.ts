import { Plugin } from 'vite';
import path from 'path';
import traverse, { Node, NodePath } from '@babel/traverse';
import api from '@babel/template';
import * as t from '@babel/types';
import { parse } from '@babel/parser';

const REPORT_COMMENT_NAME = '__report';
const REPORT_FUNC_NAME = 'TIMOTTE_SDK_REPORT';

const getReportComment = (comments: any[]) => {
    return comments.find((item) => item.value.includes(REPORT_COMMENT_NAME));
};

/**
 * __report&__reportParam={ eventType: 'xxxx', data: { id: 1 } }
 * @param comment
 */
const getCommentReportData = (comment: string) => {
    const leftTag = comment.indexOf('{');
    const rightTag = comment.lastIndexOf('}');
    if (leftTag !== -1 && rightTag !== -1) {
        const paramString = comment.substring(leftTag, rightTag);
        return paramString;
    }

    return '';
};

const autoReportPlugin = (): Plugin => {
    return {
        name: 'autoReportPlugin',
        enforce: 'pre',
        transform(code, id) {
            if (id.includes(path.join('node_modules')) || id.includes('/@react-refresh'))
                return code;
            // 生成ast
            const ast = parse(code, {
                sourceType: 'module',
                plugins: ['typescript', 'jsx'],
            });

            // traverse
            traverse(
                ast,
                {
                    enter(path, state) {
                        // parent ast
                        const parentAst = path.container;
                        // 关注整个函数体，函数体的ast node通常不会是个数组
                        if (!Array.isArray(parentAst)) {
                            parentAst?.leadingComments?.forEach((comment) => {
                                // console.log('comment ', comment);
                                if (comment.value.includes(REPORT_COMMENT_NAME)) {
                                    state.hasReportFunc = true;
                                    state.reportFuncName = REPORT_COMMENT_NAME;
                                }
                            });
                            /**
                             * 就函数而言，下面的是innerComments
                             * function() {
                             *     // asdasd
                             *     let a = 1
                             * }
                             *
                             * trailing comment:
                             * let a = 1; // trailing comment
                             */
                        }
                    },
                    'ClassMethod|ArrowFunctionExpression|FunctionExpression|FunctionDeclaration'(
                        path,
                        state,
                    ) {
                        if (state.hasReportFunc) {
                            const comments = path.node?.leadingComments ?? [];
                            const reportComment = getReportComment(comments);
                            if (reportComment) {
                                // 此处仅是函数声明才有的
                                const commentString = reportComment.value;
                                const params = getCommentReportData(commentString);
                                console.log('params ', params);
                                // 插入到节点中
                                const bodyPath = path.get('body') as NodePath<Node>;
                                // 创建一个表示 TIMOTTE_SDK_REPORT 的标识符节点
                                // const callee = t.identifier('TIMOTTE_SDK_REPORT');
                                // 整个body都是一个块级元素，往里面塞东西
                                if (bodyPath.isBlockStatement()) {
                                    const trackerAST = api.statement(`console.log(${params});`)();
                                    // const reportAST = api.statement.ast(
                                    //     `${callee.name}(${params})`,
                                    // );
                                    bodyPath.node.body.unshift(trackerAST);
                                }
                            } else {
                                // 箭头表达式、函数表达式、class Method，函数体都是嵌入在父ast上的，需要往上找leadingParent
                                const parent = path.findParent((p) => {
                                    return (
                                        Array.isArray(p.node.leadingComments) &&
                                        p.node.leadingComments.length > 0
                                    );
                                });
                                const reportComment = getReportComment(
                                    parent.node.leadingComments,
                                ).value;
                                const params = getCommentReportData(reportComment);
                                // 插入到节点中
                                const bodyPath = path.get('body') as NodePath<Node>;
                                // 整个body都是一个块级元素，往里面塞东西
                                if (bodyPath.isBlockStatement()) {
                                    bodyPath.node.body.unshift(
                                        api.statement(`console.log(${params});`)(),
                                    );
                                }
                            }
                        }
                    },
                },
                undefined,
                { hasReportFunc: false, reportFuncName: '' },
            );

            return code;
        },
    };
};

export { autoReportPlugin };
