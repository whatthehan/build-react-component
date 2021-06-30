import vfs from 'vinyl-fs';
import through from 'through2';
import fs from 'fs-extra';
import { extname, join } from 'path';
import less from 'gulp-less';
import gulpIf from 'gulp-if';
import babelTransform from './babel';

console.log('开始执行组件构建');

console.log('清理es lib文件夹');
fs.removeSync('es');
fs.removeSync('lib');

vfs
  .src(['src/**/*'], {
    allowEmpty: true,
    base: join(__dirname, '../src'),
  })
  .pipe(gulpIf((file) => extname(file.path) === '.less', less()))
  .pipe(
    through.obj((file, env, callback) => {
      if (['.tsx', '.ts', '.jsx', '.js'].includes(extname(file.path))) {
        const code = babelTransform('esm', file);
        file.path = file.path.replace(extname(file.path), '.js');
        file.contents = Buffer.from(code);
      }

      callback(null, file);
    }),
  )
  .pipe(vfs.dest('es'));
