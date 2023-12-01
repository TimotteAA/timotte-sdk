import { base } from '../../rollup-base.config';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
base.plugins = [
    ...base.plugins,
    alias({
        customResolver: nodeResolve({ extensions: ['.ts'] }),
    }),
];
base.output = {
    ...base.output,
    sourcemap: true,
};
export default [base];
//# sourceMappingURL=rollup.config.js.map