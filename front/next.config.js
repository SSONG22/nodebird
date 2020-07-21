//custom webpack
// const CompressPlugin = require("compression-webpack-plugin"); //compression-webpack-pulgin은 내장돼서 더이상 설치할 필요가 없다
const withBundleAnaylzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnaylzer({
  compress: true,
  webpack(config, { webpack }) {
    const prod = process.env.NODE_ENV === "production";
    // if (prod) {
    //     plugins.push(new CompressPlugin());
    // }

    return {
      ...config,
      mode: prod ? "production" : "development",
      devtool: prod ? "hidden-source-map" : "eval", //배포환경에선 hidden-source-map , 개발일땐 eval
      plugins: [
        ...config.plugins,
        new webpack.ContextReplacementPlugin(/moment[\//]locale$/, /^.\/ko/),
      ],
    };
  },
});
