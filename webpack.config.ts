import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import EslintPlugin from 'eslint-webpack-plugin';
import path from 'path';

const webpackConfig: Configuration = {
  mode: 'development',
  entry: path.resolve(__dirname, './index.ts'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name][hash].js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html')
    }),
    new EslintPlugin()
  ],
  resolve: {
    extensions: ['.ts', '.js']
  },
  devServer: {
    port: 6060,
    hot: true,
    open: true,
    before: (_app, server, compiler): void => {
      compiler.hooks.done.tap('done', () => {
        if (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (compiler as any).watchFileSystem.watcher.mtimes &&
          Object.keys((compiler as any).watchFileSystem.watcher.mtimes).some(
            (name) => path.parse(name).ext === '.html'
          )
        ) {
          server.sockWrite(server.sockets, 'content-changed');
        }
      });
    }
  }
};

export default webpackConfig;
