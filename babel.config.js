module.exports = {
  presets: [
    [
      "@vue/cli-plugin-babel/preset",
      {
        useBuiltIns: false,
        targets: {
          esmodules: true
        }
      }
    ]
  ]
};
