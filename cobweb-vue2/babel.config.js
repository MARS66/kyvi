module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'import',
      {
        'libraryName': 'ws-grocery-store',
        style: (name) => {
          return `${name}/style.css`
        }
      }
    ]
  ]
}
