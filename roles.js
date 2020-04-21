const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
  ac.grant("basic_user")
    .readOwn("product_upload")
  .updateOwn("product_upload")

  ac.grant("teamlead")
    .extend("basic_user")
    .readAny("product_upload")
    .updateOwn("product_upload")
    .deleteOwn('product_upload')

  ac.grant("admin")
    .extend("basic_user")
    .extend("teamlead")
    .grant("teamlead")
    .createAny("create_user")
    .updateAny("product_upload")
    .deleteAny("product_upload")

  return ac;
})();
