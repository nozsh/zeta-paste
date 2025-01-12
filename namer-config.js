const fs = require("fs");
const path = require("path");

// Path to package.json
const packagePath = path.resolve(__dirname, "package.json");

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

// Check exists "parcel-namer-rewrite"
if (!packageJson["parcel-namer-rewrite"]) {
  packageJson["parcel-namer-rewrite"] = {};
}

// Set rules based on NODE_ENV
const env = process.env.NODE_ENV || "development";
packageJson["parcel-namer-rewrite"].rules =
  env === "production"
    ? {
        "(.*).css": "{hash}.css",
        "(.*).js": "{hash}.js",
      }
    : {
        "(.*).css": "dev_$1.{hash}.css",
        "(.*).js": "dev_$1.{hash}.js",
      };

packageJson["parcel-namer-rewrite"].silent = env === "development";

// Write changes back to package.json
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
console.log(`Updated parcel-namer-rewrite rules for ${env}`);
