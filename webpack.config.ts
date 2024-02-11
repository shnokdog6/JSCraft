import path from "path";
import { Configuration } from "webpack";
import "webpack-dev-server"
import HtmlWebpackPlugin from "html-webpack-plugin"

const config : Configuration = {
    mode: "development",
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name][contenthash].js",
        clean: true
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, "public"),
        }
    },
    plugins:[
        new HtmlWebpackPlugin({template: "./public/index.html"})
    ],
    module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
        ],
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.js'],
      },

}

export default config;