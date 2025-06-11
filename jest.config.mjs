export default {
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  moduleFileExtensions: ['js', 'mjs'],
  reporters: [
    "default",
    ["jest-html-reporter", {
      "pageTitle": "Reporte de Pruebas - Echome Backend",
      "outputPath": "test-report.html",
      "includeFailureMsg": true,
      "includeConsoleLog": true,
      "theme": "defaultTheme"
    }]
  ]
};
