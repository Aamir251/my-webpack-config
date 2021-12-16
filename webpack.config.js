
const path = require("path")
// Build Scripts for our application
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");


const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const IS_DEVELOPMENT = process.env.NODE_ENV === "dev";

const dirApp = path.join(__dirname, "app")
const dirStyles = path.join(__dirname, "styles")
const dirImages = path.join(__dirname, "images")
const dirVideos = path.join(__dirname, "videos")
const dirShared = path.join(__dirname, "shared")
const dirNode = "node_modules"

// console.log(dirAssets, dirApp, dirStyles)

module.exports = {
    entry : [   //Entry point of our app
        path.join(dirApp, "index.js"),
        // path.join(dirStyles, "index.scss")
    ],
    resolve : {     //helps in finding the reuired files automatically.
                    //thus we don't need to exactly specify in which directory exactly our file is
        modules : [
            dirApp,
            dirStyles,
            dirShared,
            dirImages,
            dirVideos,
            dirNode
        ]
    },

    plugins : [     //they are responsible for bundling all the files for the production
        new webpack.DefinePlugin({
            IS_DEVELOPMENT
        }),

        new CopyWebpackPlugin({
            patterns : [
                {
                    from : "/shared",   //copies the content of shared folder to the root of the public folder (build folder)
                    to : "",
                    noErrorOnMissing : true
                }
            ]
        }),

        new MiniCssExtractPlugin({
            filename : "[name].css",
            chunkFilename : "[id].css"
        }),

        new ImageMinimizerPlugin({
            minimizerOptions: {
              // Lossless optimization with custom option
              // Feel free to experiment with options for better result for you
              plugins: [
                ["gifsicle", { interlaced: true }],
                ["jpegtran", { progressive: true }],
                ["optipng", { optimizationLevel: 8 }],
              ]
            }
        }),

    ],

    module : { // it looks for the extension of the file and executes different command on
                // on those files and outputs them into the public folder
        rules : [
            {
                test : /\.js$/,     //if file ends with .js, the babel loader is run on it.
                use : {
                    loader : "babel-loader" //babel loader is a loader for webpack that compiles modern JS into older JS
                }
            },
            {
                test : /\.scss$/,
                use : [
                    {
                        loader : MiniCssExtractPlugin.loader,
                        options : {
                            publicPath : "",    //to output everything to root folder of public

                        },
                    },
                    {
                        loader : "css-loader"   //enables importing css to javascript file
                    }, 
                    {
                        loader : "postcss-loader" //removes the need to write webkit and fallback support css for older browsers
                    },
                    {
                        loader : "sass-loader"
                    }
                ]
            },
            {
                test : /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/,
                loader : "file-loader",
                options : {
                    outputPath : "images",
                    name(file) {
                        return "[hash].[ext]"   //to prevent caching
                    }
                }
            },

            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                  {
                    loader: ImageMinimizerPlugin.loader,
                    options: {
                      severityError: "warning", // Ignore errors on corrupted images
                      minimizerOptions: {
                        plugins: ["gifsicle"],
                      },
                    },
                  },
                ],
            },

            // For web gl and shader
            {
                test : /\.(glsl|frag|vert)$/,
                loader : "raw-loader",
                exclude : /node_modules/
            },
            {
                test : /\.(glsl|frag|vert)$/,
                loader : "glslify-loader",
                exclude : /node_modules/
            }


        ]
    },

    optimization : {
        minimize : true,
        minimizer : [ new TerserPlugin()],
    }
}   
