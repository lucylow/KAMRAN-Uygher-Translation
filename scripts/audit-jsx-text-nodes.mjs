import fs from "node:fs";
import path from "node:path";
import { parse } from "@babel/parser";

const roots = [path.resolve("app"), path.resolve("components")];
const files = [];
function collect(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collect(full);
    else if (full.endsWith(".tsx")) files.push(full);
  }
}
for (const root of roots) collect(root);

for (const file of files) {
  const code = fs.readFileSync(file, "utf8");
  const ast = parse(code, { sourceType: "module", plugins: ["jsx", "typescript"] });
  const parents = [];
  function visit(node) {
    if (!node || typeof node !== "object") return;
    if (node.type === "JSXElement") {
      const name = node.openingElement.name;
      const tag = name.type === "JSXIdentifier" ? name.name : name.type === "JSXMemberExpression" ? `${name.object.name}.${name.property.name}` : "";
      parents.push(tag);
      for (const child of node.children ?? []) visit(child);
      parents.pop();
      return;
    }
    if (node.type === "JSXText" && node.value.trim() && !parents.some((tag) => tag === "Text" || tag.endsWith(".Text"))) {
      const line = code.slice(0, node.start).split("\n").length;
      console.log(`${path.relative(process.cwd(), file)}:${line}: ${JSON.stringify(node.value)}`);
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === "object" && value.type) visit(value);
    }
  }
  visit(ast);
}
