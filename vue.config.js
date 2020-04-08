// webpack配置文件
module.exports = {
  // 使用chainwebpack配置开发和发布的入口
  chainWebpack: config => {
    // 发布
    config.when(process.env.NODE_ENV === "production", config => {
      config
        .entry("app")
        .clear()
        .add("./src/main-prod.js");

      config.set("externals", {
        vue: "Vue",
        "vue-router": "VueRouter",
        axios: "axios",
        lodash: "_",
        echarts: "echarts",
        nprogress: "NProgress",
        "vue-quill-editor": "VueQuillEditor"
      });

      config.plugin("html").tap(args => {
        args[0].isProd = true;
        return args;
      });
    });
    // 开发
    config.when(process.env.NODE_ENV === "development", config => {
      config
        .entry("app")
        .clear()
        .add("./src/main-dev.js");

      config.plugin("html").tap(args => {
        args[0].isProd = false;
        return args;
      });
    });
  },
  publicPath: "./",
  outputDir: "dist",
  assetsDir: "static",
  indexPath: "index.html",
  filenameHashing: true
};
