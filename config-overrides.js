const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const GoogleFontsPlugin = require("google-fonts-plugin");
const {
  override,
  addWebpackModuleRule,
  addWebpackPlugin,
} = require("customize-cra");

const IS_DEV = process.env.NODE_ENV !== "production";

// override CRA config with rules for SASS modules
module.exports = override(
  addWebpackModuleRule({
    test: /\.module\.s([ac])ss$/,
    loader: [
      IS_DEV ? "style-loader" : MiniCSSExtractPlugin.loader,
      {
        loader: "css-loader",
        options: {
          modules: true,
          sourceMap: IS_DEV,
          importLoaders: 3,
          localsConvention: "camelCaseOnly",
        },
      },
      "postcss-loader",
      {
        loader: "sass-loader",
        options: {
          sourceMap: IS_DEV,
        },
      },
      {
        loader: "sass-resources-loader",
        options: {
          resources: ["./src/styles/variables.scss"],
        },
      },
    ],
  }),
  addWebpackPlugin(
    new GoogleFontsPlugin({
      fonts: [
        {
          family: "Roboto",
          variants: ["400", "400i", "700", "700i"],
          subsets: ["latin-ext"],
        },
      ],
      formats: ["woff", "woff2"],
    }),
  ),
);
