import vfs from 'vinyl-fs';
import through from 'through2';
import fs from 'fs-extra';
import { extname, join } from 'path';
import { OutputOptions, rollup } from 'rollup';
import less from 'gulp-less';
import gulpIf from 'gulp-if';
import typescript from 'gulp-typescript';
import ts from 'typescript';
import babelTransform from './babel';
import getRollupConfig from './rollup';

const tsconfig = ts.readConfigFile('tsconfig.json', (path) =>
  fs.readFileSync(path, { encoding: 'utf-8' }),
).config;

async function buildUMD() {
  console.log('清理dist文件夹');
  fs.removeSync('dist');
  console.log(`\n开始执行构建umd类型`);

  const { output, ...input } = getRollupConfig();
  const bundle = await rollup(input);
  await bundle.write(output as OutputOptions);
}

function build(type: 'cjs' | 'esm') {
  const dir = type === 'cjs' ? 'lib' : 'es';

  console.log(`清理${dir}文件夹`);
  fs.removeSync(dir);

  console.log(`\n开始执行构建${type}类型`);
  vfs
    .src(['src/**/*'], {
      allowEmpty: true,
      base: join(__dirname, '../src'),
    })
    // 编译less
    .pipe(gulpIf((file) => extname(file.path) === '.less', less()))
    // 编译.d.ts文件
    .pipe(
      gulpIf(
        (file) => ['.tsx', '.ts'].includes(extname(file.path)) && !file.path.endsWith('.d.ts'),
        typescript({
          ...tsconfig.compilerOptions,
        }),
      ),
    )
    // 编译ts js文件
    .pipe(
      through.obj((file, env, callback) => {
        if (
          ['.tsx', '.ts', '.jsx', '.js'].includes(extname(file.path)) &&
          !file.path.endsWith('.d.ts')
        ) {
          const code = babelTransform(type, file);
          file.path = file.path.replace(extname(file.path), '.js');
          file.contents = Buffer.from(code);
        }

        callback(null, file);
      }),
    )
    // 输出
    .pipe(vfs.dest(type === 'cjs' ? 'lib' : 'es'));
}

(async () => {
  console.log('开始执行组件构建\n');
  build('cjs');
  build('esm');
  await buildUMD();
  console.log('\n构建完成');
})();
