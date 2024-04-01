module.exports = {
    transformIgnorePatterns: [
      "node_modules/(?!(msw|outras-bibliotecas-aqui)/)"
    ],
    transform: {
      "^.+\\.[t|j]sx?$": "babel-jest"
    },
  };
  