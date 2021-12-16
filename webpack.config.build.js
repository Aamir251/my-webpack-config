// standard build process that is shared between development and final build
// This is because build of development is bit different from production build

const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const { merge }  = require("webpack-merge")
const config = require("./webpack.config");

module.exports = merge(config, {
    mode : "production",

    output : {
        path : path.join(__dirname, "public")
    },

    plugins : [
        new CleanWebpackPlugin()
    ]
})