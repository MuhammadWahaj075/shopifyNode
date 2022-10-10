const Shopify = require("shopify-api-node");
const express = require("express");
const app = express();

app.get("/product", async function (req, res, storeDomain) {
  const client = new Shopify({
    storeDomain,
    shopName: "demo-mobiles-store.myshopify.com",
    accessToken: "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",
  });

  let listProducts = [];
  let shopifyItems = [];
  let params_1 = { limit: 50 };

  do {
    const products = await client.product.list(params_1);
    listProducts = [...listProducts, ...products];

    params_1 = {
      limit: products.nextPageParameters
        ? products.nextPageParameters.limit
        : undefined,
      page_info: products.nextPageParameters
        ? products.nextPageParameters.page_info
        : undefined,
    };
  } while (params_1.page_info !== undefined && params_1.limit !== undefined);
  console.log("TOTAL PRODUCTS: ", listProducts.length);

  let total_variant = 0;
  for (const product of listProducts) {
    if (product.variants && product.variants.length) {
      const productItems = {
        id: product.id,
        title: product.title,
        // body_html: product.body_html,
        vendor: product.vendor,
        product_type: product.product_type,
        tags: product.tags,
      };

      console.log("PRODUCTSITEMS===========", productItems);
      let variants = product.variants;
      // total_variant += variants.length;
      // listVariants = [...listVariants, ...variants];
      for (const items of variants) {
        const variantsItems = {
          id: items.id,
          product_id: items.product_id,
          color: items.title,
          price: items.price,
          compare_at_price: items.compare_at_price,
        };
        console.log("variantsItems==========", variantsItems);

        shopifyItems.push({
          ...productItems,
          ...variantsItems,
        });
      }
    }
  }
  console.log("shopifylength", shopifyItems.length);
  return res.send({ products: shopifyItems });
});
app.listen(5000);
