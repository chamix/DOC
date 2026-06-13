const fs = require("fs");
const path = require("path");

module.exports = function(eleventyConfig) {
  
  // Guardrail: Stop Eleventy from trying to compile the template files as standalone HTML pages
  eleventyConfig.ignores.add("_includes/**");

  // Custom Markdown Engine Override to inject inline base64 images
  eleventyConfig.amendLibrary("md", (mdLib) => {
    const originalImageRenderer = mdLib.renderer.rules.image;

    mdLib.renderer.rules.image = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const srcIndex = token.attrIndex("src");
      let srcValue = token.attrs[srcIndex][1];

      try {
        let imagePath = path.isAbsolute(srcValue) 
          ? path.join(__dirname, srcValue) 
          : path.resolve(env.page ? path.dirname(env.page.inputPath) : __dirname, srcValue);

        if (fs.existsSync(imagePath)) {
          const extension = path.extname(imagePath).replace(".", "");
          const bitmap = fs.readFileSync(imagePath);
          const base64Data = Buffer.from(bitmap).toString("base64");
          
          token.attrs[srcIndex][1] = `data:image/${extension};base64,${base64Data}`;
        }
      } catch (error) {
        console.error(`[-] Failed to inline image target: ${srcValue}`, error);
      }

      return originalImageRenderer(tokens, idx, options, env, self);
    };
  });

  return {
    dir: {
      input: ".",          
      output: "_site"      
    }
  };
};
