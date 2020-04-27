const Slug = require("slug");

exports.createSlug = (title) => {
  let productSlug = Slug(title.toLowerCase(), "-");
  if (!productSlug.length) {
    const slugArray = title.split(/[ ,]+/);
    for (let i = 0; i < slugArray.length - 1; i++) {
      if (i == 0) {
        productSlug = slugArray[0] + "-";
      } else {
        productSlug = productSlug + slugArray[i] + "-";
      }
    }
    productSlug = productSlug + slugArray[slugArray.length - 1];
  }

  return productSlug;
};
