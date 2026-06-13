const fs = require("fs");
const path = require("path");

module.exports = function(eleventyConfig) {
  
  // Custom Markdown Engine Override to inject inline base64 images
  eleventyConfig.amendLibrary("md", (mdLib) => {
    const originalImageRenderer = mdLib.renderer.rules.image;

    mdLib.renderer.rules.image = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const srcIndex = token.attrIndex("src");
      let srcValue = token.attrs[srcIndex][1];

      try {
        // Resolve path assuming images reside within your workspace directories
        // e.g., 'Rise-the-level-of-abstraction/imgs/image.png' or relative paths
        let imagePath = path.isAbsolute(srcValue) 
          ? path.join(__dirname, srcValue) 
          : path.resolve(env.page ? path.dirname(env.page.inputPath) : __dirname, srcValue);

        if (fs.existsSync(imagePath)) {
          const extension = path.extname(imagePath).replace(".", "");
          const bitmap = fs.readFileSync(imagePath);
          // Convert binary to base64 encoding
          const base64Data = Buffer.from(bitmap).toString("base64");
          
          // Overwrite the src attribute with a self-contained data URI
          token.attrs[srcIndex][1] = `data:image/${extension};base64,${base64Data}`;
        }
      } catch (error) {
        console.error(`[-] Failed to inline image target: ${srcValue}`, error);
      }

      // Pass down to the original markdown renderer with modified token attributes
      return originalImageRenderer(tokens, idx, options, env, self);
    };
  });

  return {
    dir: {
      input: ".",          // Look at your root directory for Markdown files
      output: "_site"      // Compile results cleanly inside an ignored destination folder
    }
  };
};