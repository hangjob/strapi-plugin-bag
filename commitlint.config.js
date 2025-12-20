module.exports = {
  extends: ["@commitlint/config-conventional"],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(.*?)?\s?(\w+)(?:\((.*)\))?!?: (.*)$/,
      headerCorrespondence: ["emoji", "type", "scope", "subject"],
    },
  },
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "chore",
        "revert",
        "workflow",
      ],
    ],
    "type-case": [0],
    "type-empty": [2, "never"],
    "subject-empty": [2, "never"],
    "header-max-length": [0, "always", 72],
  },
};
