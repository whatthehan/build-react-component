import babel from '@babel/core';

export function getBabelConfig(type: 'cjs' | 'esm' | 'umd') {
  return {
    babelrc: false,
    configFile: false,
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          modules: type === 'esm' ? false : 'auto',
        },
      ],
      [
        require.resolve('@babel/preset-react'),
        {
          runtime: 'automatic',
        },
      ],
      require.resolve('@babel/preset-typescript'),
    ],
    plugins: [
      [
        require.resolve('babel-plugin-import'),
        {
          libraryName: 'antd',
          libraryDirectory: 'lib',
          style: 'css',
        },
      ],
      [
        {
          name: 'rename-less',
          visitor: {
            ImportDeclaration(path: any) {
              if (path.node.source.value.endsWith('.less')) {
                path.node.source.value = path.node.source.value.replace(/\.less$/, '.css');
              }
            },
          },
        },
      ],
    ],
  };
}

function babelTransform(type: 'cjs' | 'esm', file: any) {
  const config = getBabelConfig(type);

  return (
    babel.transform(file.contents, {
      ...config,
      filename: file.path,
    })?.code || ''
  );
}

export default babelTransform;
