module.exports = {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "{!(package)*.json,*.code-snippets,.!(browserslist)*rc}": [
    "prettier --write--parser json"
  ],
  "package.json": [
    "prettier --write"
  ],
  "*.vue": [
    "eslint --fix",
    "prettier --write",
    "stylelint --fix"
  ],
  "*.{sass, scss, less, stylus, html}": [
    "stylelint --fix",
    "prettier --write"
  ],
  "*.md": [
    "prettier --write"
  ]
}
