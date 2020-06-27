module.exports = {
  // App Settings


  // App Settings
  // TOKEN_SECRET: process.env.TOKEN_SECRET || 'seebiz....enterprise',

  // Development environment config
  development: {
    Bucket: 'seebiz-production-s3',
    clientHost: 'http://localhost:3000',
    db: 'mongodb://127.0.0.1/seebiz',
    jwtSecret: '$secure$%^&*()!@#&^$avbg',
    elasticsearch: {
      hosts: 'localhost:9200',
      log: ['error', 'warning', 'trace']
    },
    app: {
      name: 'seebiz'
    },


    /*  mailAddress: 'success@simulator.amazonses.com',
    supportAddress: 'success@simulator.amazonses.com' */
    mailAddress: 'noreply@seebiz.com',
    supportAddress: 'contact@seebiz.com',
    jwtSecret: '$secure$%^&*()!@#&^$avbg'
  },

  // Production environment config
  production: {
    Bucket: 'seebiz-production-s3',
    clientHost: 'https://seebiz.com',
    db:
      'mongodb://seebizAdmin:Rapidws2641@seebiz-cluster-shard-00-00-zyuvk.mongodb.net:27017,seebiz-cluster-shard-00-01-zyuvk.mongodb.net:27017,seebiz-cluster-shard-00-02-zyuvk.mongodb.net:27017/seebiz?ssl=true&replicaSet=seebiz-cluster-shard-0&authSource=admin&retryWrites=true',
    // db: 'mongodb://root:admin123@52.34.46.134:27017/sebiz',
    elasticsearch: {
      hosts: [
        'https://search-seebiz-search-g2gbx7cgrmdwlgsfvz6rxmptty.us-west-2.es.amazonaws.com'
        //'https://search-seebiz-search-7biw2qj7lcu6podlbhvttbsaxe.us-west-2.es.amazonaws.com'
      ],
      log: ['error', 'warning', 'trace']
    },
    app: {
      name: 'seebiz'
    },
    mailAddress: 'noreply@seebiz.com',
    supportAddress: 'contact@seebiz.com'
  },

  // AWS Configuration
  Aws: {
    AuthMail: {
      accessKey: 'AKIA43WBBQ57NM5XQ3ZP',
      secretKey: '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',
      region: 'us-west-2'
    },
    AuthStorage: {
      accessKey: 'AKIA2H3FXSCJU4OOHSOC',//'AKIAJSXHQ5M2DXCRUSNA',
      secretKey: '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', //'SYhmWYDdLVmDGdfFmhp54kLHG9dR4eAJRf1tPeHh',
      region: 'us-west-2'
    },
    AuthElasticsearch: {
      //accessKey: 'AKIAIJ46RS7AOB7E7WKQ',
      //secretKey: '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',
      accessKey: 'AKIAJKNOJH5EYBH5A6CQ',
      secretKey: '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',
      region: 'us-west-2'
    },
    AuthCognito: {
      production: {
        UserPoolId: 'us-west-2_NJCu2CShp',
        ClientId: '1t09tspqqkpg7v6cuc9ua831pr',
        PoolRegion: 'us-west-2'
      },
      development: {
        UserPoolId: 'us-east-2_wTboDRL7i',
        ClientId: '471v3vrpgjaknjaqk1p26ljn4d',
        PoolRegion: 'us-east-2'
      }
    },

    // AuthSQS: {
    //   // UserPoolId: 'us-east-2_wTboDRL7i',
    //   // ClientId: '471v3vrpgjaknjaqk1p26ljn4d',
    //   // PoolRegion: 'us-east-2'
    // }
  },
  // Twilio Configuration
  Twilio: {
    apiKey: 'HHEbfsfVZjXukF7HJ0aqSfYLtIy8Vavj'
  },

  // Mailgun Congfiguration
  Mailgun: {
    apiKey: '681be0ef4533899bb293e55364ad0350-c50f4a19-09fb0c68',
    domain: 'mail.seebiz.com'
  }
}
