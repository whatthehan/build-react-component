import vfs from 'vinyl-fs';
import through from 'through2';
import fs from 'fs-extra';
import { extname, join } from 'path';
import { rollup } from 'rollup';
import less from 'gulp-less';
import gulpIf from 'gulp-if';
import babelTransform from './babel';
import getRollupConfig from './rollup';

async function build(type: 'cjs' | 'esm' | 'umd') {
  if (type === 'umd') {
    console.log('清理dist文件夹');
    fs.removeSync('dist');
    console.log(`\n开始执行构建umd类型`);

    const { output, ...input } = getRollupConfig();
    const bundle = await rollup(input);
    await bundle.write(output);

    return;
  }

  const dir = type === 'cjs' ? 'lib' : 'es';

  console.log(`清理${dir}文件夹`);
  fs.removeSync(dir);

  console.log(`\n开始执行构建${type}类型`);
  vfs
    .src(['src/**/*'], {
      allowEmpty: true,
      base: join(__dirname, '../src'),
    })
    .pipe(gulpIf((file) => extname(file.path) === '.less', less()))
    .pipe(
      through.obj((file, env, callback) => {
        if (['.tsx', '.ts', '.jsx', '.js'].includes(extname(file.path))) {
          const code = babelTransform(type, file);
          file.path = file.path.replace(extname(file.path), '.js');
          file.contents = Buffer.from(code);
        }

        callback(null, file);
      }),
    )
    .pipe(vfs.dest(type === 'cjs' ? 'lib' : 'es'));
}

(async () => {
  console.log('开始执行组件构建\n');
  build('cjs');
  build('esm');
  await build('umd');
  console.log('\n构建完成');
})();
