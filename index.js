import { csv2yaml } from "./lib/csv2yaml.js";
import path from "node:path";

// get file path to public/source.csv using esm module path resolution
const csvPath = path.resolve("public", "source.csv");
const yamlPath = path.resolve("public");
csv2yaml(csvPath, yamlPath);
