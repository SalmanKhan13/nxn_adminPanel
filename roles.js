const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function() {
  ac.grant("basic")
    .readOwn("products")
    .deleteOwn('products')
    .readAny('products')
    .updateOwn("products")

  ac.grant("teamlead")
    .extend("basic")
    .updateOwn("products")

  ac.grant("admin")
    .extend("basic")
    .extend("teamlead")
    .updateAny("products")
    .deleteAny("products")

  return ac;
})();
