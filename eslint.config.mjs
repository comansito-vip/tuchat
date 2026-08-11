import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Los ficheros de configuración de la raíz son CommonJS porque la
  // herramienta que los lee los carga con require(): next-sitemap.config.js no
  // puede usar import sin que next-sitemap deje de encontrarlo. La regla de
  // TypeScript que prohíbe require() no tiene sentido ahí.
  {
    files: ["*.config.js"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
]);

export default eslintConfig;
