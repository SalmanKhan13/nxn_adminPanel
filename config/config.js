module.exports = {
  // App Settings
  TOKEN_SECRET: process.env.TOKEN_SECRET || "seebiz....enterprise",

  // Development environment config
  development: {
    Bucket: "seebiz-production-s3",
    clientHost: "http://localhost:3000",
    db: "mongodb://127.0.0.1/seebiz",
    app: {
      name: "seebiz",
    },
    /*  mailAddress: 'success@simulator.amazonses.com',
    supportAddress: 'success@simulator.amazonses.com' */
    mailAddress: "noreply@seebiz.com",
    supportAddress: "contact@seebiz.com",
    jwtSecret:'$secure$%^&*()!@#&^$avbg'
  },

  // Production environment config
  production: {
    Bucket: "seebiz-production-s3",
    clientHost: "https://seebiz.com",
    db:
      "mongodb://seebizAdmin:Rapidws2641@seebiz-cluster-shard-00-00-zyuvk.mongodb.net:27017,seebiz-cluster-shard-00-01-zyuvk.mongodb.net:27017,seebiz-cluster-shard-00-02-zyuvk.mongodb.net:27017/seebiz?ssl=true&replicaSet=seebiz-cluster-shard-0&authSource=admin&retryWrites=true",
    // db: 'mongodb://root:admin123@52.34.46.134:27017/sebiz',
    app: {
      name: "seebiz",
    },
    mailAddress: "noreply@seebiz.com",
    supportAddress: "contact@seebiz.com",
    jwtSecret:'$secure$%^&*()!@#&^$avbg'
  },

  // AWS Configuration
  Aws: {
    AuthMail: {
      accessKey: "AKIA43WBBQ57NM5XQ3ZP",
      secretKey: "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",
      region: "us-west-2",
    },
    AuthStorage: {
      accessKey: "AKIA2H3FXSCJU4OOHSOC", //'AKIAJSXHQ5M2DXCRUSNA',
      secretKey: "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", //'SYhmWYDdLVmDGdfFmhp54kLHG9dR4eAJRf1tPeHh',
      region: "us-west-2",
    }
  },

  // Mailgun Congfiguration
  Mailgun: {
    apiKey: "681be0ef4533899bb293e55364ad0350-c50f4a19-09fb0c68",
    domain: "mail.seebiz.com",
  },
};
