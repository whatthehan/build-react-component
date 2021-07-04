## build-react-component

使用 gulup 和 babel 构建 cjs 和 esm 格式

使用 rollup 构建 umd 格式

#### 自定义 babel 插件

动机：将 less 编译为 css 后，tsx 内部的引用名称需要改变

示例：`import "./style.less"` → `import "./style.css"`

实现：

```ts
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
];
```

#### 注意事项

1. `gulp-typescript`目前可能不再维护？默认 `latest` 版本是`6.0.0-alpha.1`，需要手动降级至稳定版 `5.0.1`。**需要寻找其他替代工具**
