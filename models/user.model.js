var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var mongoosastic = require("mongoosastic");
//var elastic = require('../../config/elasticsearch');
//var BussinessType = require('./bussiness-type.model');
//var BussinessCategory = require('./bussiness-category.model');
var Schema = mongoose.Schema;

var SALT_WORK_FACTOR = 10;
var UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      es_indexed: false,
    },
    password: {
      type: String,
      es_indexed: false,
    },
    api_key: {
      type: String,
      index: true,
      unique: true,
      es_indexed: false,
    }, // Unique API_KEY for user indentifier
    token_key: {
      type: String,
      es_indexed: false,
    }, // Randomly generated token key for api access
    first_name: {
      type: String,
      es_type: "completion",
      es_analyzer: "simple",
      es_search_analyzer: "simple",
    },
    last_name: {
      type: String,
      es_type: "completion",
      es_analyzer: "simple",
      es_search_analyzer: "simple",
    },
    user_type: {
      type: String,
      enum: ["general", "merchant", "admin"],
      default: "general",
      es_indexed: false,
    },
    phone: {
      home: {
        type: String,
        es_indexed: false,
      },
      office: {
        type: String,
        es_indexed: false,
      },
      personal: {
        type: String,
        es_indexed: false,
      },
    },
    address: {
      type: {
        country: {
          type: String,
          es_indexed: true,
          es_type: "text",
        },
        city: {
          type: String,
          es_indexed: true,
          es_type: "text",
        },
        zip: {
          type: Number,
          es_indexed: true,
          es_type: "text",
        },
        street: {
          type: String,
          es_indexed: true,
          es_type: "text",
        },
        street2: {
          type: String,
          es_indexed: true,
          es_type: "text",
        },
      },
    },
    website: {
      type: String,
      es_indexed: false,
    },
    email_verification: {
      type: Boolean,
      default: false,
      es_indexed: true,
    }, // email verified or not
    phone_number_verification: {
      type: Boolean,
      default: false,
      es_indexed: false,
    }, // phone number verified or not
    status: {
      type: {
        active: {
          type: Boolean,
          default: true,
        },
        suspended: {
          type: Boolean,
          default: false,
        },
      },
      default: {
        active: true,
        suspended: false,
      },
      es_indexed: false,
    }, // account activated or not or blocked
    followings: {
      type: [
        {
          userId: String,
          status: {
            type: Boolean,
            default: false,
          },
          following_date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      es_indexed: false,
    },
    followers: {
      type: [
        {
          userId: String,
          status: {
            type: Boolean,
            default: false,
          },
          follower_date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      es_indexed: false,
    },
    shortlists: {
      type: [],
      es_indexed: false,
    }, // shortlists topics or categories
    social_profile: {
      type: {
        facebook: {
          access_token: String,
          access_secret: String,
        },
        twitter: {
          access_token: String,
          access_secret: String,
        },
        linkedin: {
          access_token: String,
          access_secret: String,
        },
        google: {
          googleId: String,
        },
      },
      es_indexed: false,
    },
    featurePhotoOne: {
      type: String,
      es_indexed: false,
    },
    featurePhotoTwo: {
      type: String,
      es_indexed: false,
    },
    featurePhotoThree: {
      type: String,
      es_indexed: false,
    },
    featurePhotoFour: {
      type: String,
      es_indexed: false,
    },
    featurePhotoFive: {
      type: String,
      es_indexed: false,
    },

    optimizedFeaturedImages: {
      es_indexed: false,
      one: {
        thumbnail: String,
        large: String,
      },
      two: {
        thumbnail: String,
        large: String,
      },
      three: {
        thumbnail: String,
        large: String,
      },
      four: {
        thumbnail: String,
        large: String,
      },
      five: {
        thumbnail: String,
        large: String,
      },
    },

    business_name: {
      type: String,
      es_indexed: true,
      es_type: "text",
      es_fields: {
        completion: {
          type: "completion",
          analyzer: "standard",
          preserve_position_increments: true,
          preserve_separators: true,
        },
      },
    }, // User business Infos business name
    username: {
      type: String,
      unique: true,
      es_indexed: true,
      es_type: "text",
    }, // Auto generated username(generate one time when user signup)
    business_info: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          es_indexed: true,
          es_type: "text",
        },
        businessName: {
          type: String,
          es_indexed: true,
          es_type: "text",
        }, // User Business name
        businessType: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "BussinessType",
          es_indexed: true,
          es_type: "nested",
        },
        businessCategory: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "BussinessCategory",
          es_indexed: true,
          es_type: "nested",
        },
        businessLocation: {
          country: {
            type: String,
            es_indexed: true,
            es_type: "text",
          },
          city: {
            type: String,
            es_indexed: true,
            es_type: "text",
          },
          zip: {
            type: Number,
            es_indexed: true,
            es_type: "text",
          },
          street: {
            type: String,
            es_indexed: true,
            es_type: "text",
          },
          street2: {
            type: String,
            es_indexed: true,
            es_type: "text",
          },
          state: {
            type: String,
            es_indexed: true,
            es_type: "text",
          },
        },
        businessTimes: {
          monDay: {
            openingTime: {
              type: Date,
              default: setOpeningTime,
              es_indexed: false,
              es_type: "text",
            },
            closingTime: {
              type: Date,
              default: setClosingTime,
              es_indexed: false,
              es_type: "text",
            },
            isOpen: {
              type: Boolean,
              default: true,
              es_indexed: false,
              es_type: "text",
            },
          },
          tuesDay: {
            openingTime: {
              type: Date,
              default: setOpeningTime,
              es_indexed: false,
              es_type: "text",
            },
            closingTime: {
              type: Date,
              default: setClosingTime,
              es_indexed: false,
              es_type: "text",
            },
            isOpen: {
              type: Boolean,
              default: true,
              es_indexed: false,
              es_type: "text",
            },
          },
          wednesDay: {
            openingTime: {
              type: Date,
              default: setOpeningTime,
              es_indexed: false,
              es_type: "text",
            },
            closingTime: {
              type: Date,
              default: setClosingTime,
              es_indexed: false,
              es_type: "text",
            },
            isOpen: {
              type: Boolean,
              default: true,
              es_indexed: false,
              es_type: "text",
            },
          },
          thursDay: {
            openingTime: {
              type: Date,
              default: setOpeningTime,
              es_indexed: false,
              es_type: "text",
            },
            closingTime: {
              type: Date,
              default: setClosingTime,
              es_indexed: false,
              es_type: "text",
            },
            isOpen: {
              type: Boolean,
              default: true,
              es_indexed: false,
              es_type: "text",
            },
          },
          friDay: {
            openingTime: {
              type: Date,
              default: setOpeningTime,
              es_indexed: false,
              es_type: "text",
            },
            closingTime: {
              type: Date,
              default: setClosingTime,
              es_indexed: false,
              es_type: "text",
            },
            isOpen: {
              type: Boolean,
              default: true,
              es_indexed: false,
              es_type: "text",
            },
          },
          saturDay: {
            openingTime: {
              type: Date,
              default: setOpeningTime,
              es_indexed: false,
              es_type: "text",
            },
            closingTime: {
              type: Date,
              default: setClosingTime,
              es_indexed: false,
              es_type: "text",
            },
            isOpen: {
              type: Boolean,
              default: false,
              es_indexed: false,
              es_type: "text",
            },
          },
          sunDay: {
            openingTime: {
              type: Date,
              default: setOpeningTime,
              es_indexed: false,
              es_type: "text",
            },
            closingTime: {
              type: Date,
              default: setClosingTime,
              es_indexed: false,
              es_type: "text",
            },
            isOpen: {
              type: Boolean,
              default: false,
              es_indexed: false,
              es_type: "text",
            },
          },
        },
        createdDate: {
          type: Date,
          default: Date.now,
          es_indexed: false,
          es_type: "text",
        },
      },
    ],
    register_ip: {
      type: String,
      es_indexed: false,
    },
    unique_url: {
      type: String,
      unique: true,
      lowercase: true,
      es_indexed: false,
    }, // Unique url for every user like http://bizen.com/example
    salt: {
      type: String,
      es_indexed: false,
    }, // unique salt for reset password
    profile_pic: {
      type: String,
      es_indexed: true,
      es_type: "text",
    },
    optimizedProfilePic: {
      es_indexed: false,
      size30: String,
      thumbnail: String,
      large: String,
    },
    cover_pic: {
      type: String,
      es_indexed: false,
    },
    aboutme: {
      type: String,
      es_indexed: false,
    },
    birthday: {
      type: Date,
      es_indexed: false,
    },
    gender: {
      type: String,
      es_indexed: false,
    },
    location: {
      type: String,
      es_indexed: true,
      es_type: "text",
    },
    contactName: {
      type: String,
      es_indexed: false,
    },
    companyDescription: {
      type: String,
      es_indexed: false,
      es_type: "text",
    },
    emailChange: {
      email: {
        type: String,
        default: null,
      },
      securityCode: {
        type: String,
        default: null,
      },
      expired: {
        type: Date,
        default: Date.now,
      },
      es_indexed: false,
    },
    // subscribe to posts flag
    subscribe_to_posts: {
      type: Boolean,
      default: true,
      es_indexed: false,
    },
    homeOnboarding: {
      type: Boolean,
      default: false,
      es_indexed: false,
    },
    profileOnboarding: {
      type: Boolean,
      default: false,
      es_indexed: false,
    },
    created_at: {
      type: Date,
      default: Date.now,
      es_indexed: false,
    },
    updated_at: {
      type: Date,
      es_indexed: false,
    },
    logins: [
      {
        ip: {
          type: String,
          es_indexed: false,
        },
        time: {
          type: Date,
          es_indexed: false,
        },
      },
    ],
    metaTags: {
      title: {
        type: String,
        default: null,
      },
      description: {
        type: String,
        default: null,
      },
      facebook_title: {
        type: String,
        default: null,
      },
      facebook_description: {
        type: String,
        default: null,
      },
      twitter_title: {
        type: String,
        default: null,
      },
      twitter_description: {
        type: String,
        default: null,
      },
    },
  },
  { usePushEach: true }
);
/*
 |--------------------------------------------------------------------------
 | Hide password
 |--------------------------------------------------------------------------
*/
UserSchema.methods.toJSON = function () {
  var user = this.toObject();
  delete user.password;
  return user;
};
/*
 |--------------------------------------------------------------------------
 | Password hash create
 |--------------------------------------------------------------------------
*/
UserSchema.pre("save", function (next) {
  var self = this;
  if (!self.isModified("password")) return next();
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(self.password, salt, null, function (err, hash) {
      if (err) return next(err);
      self.password = hash;
      next();
    });
  });
});
/*
 |--------------------------------------------------------------------------
 | Compare Password
 |--------------------------------------------------------------------------
*/
UserSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, callback);
};

UserSchema.plugin(mongoosastic, {
  // esClient: elastic.client,
  populate: [
    {
      path: "business_info.businessType",
      model: "BussinessType",
      select: "bussinessTypeName",
    },
    {
      path: "business_info.businessCategory",
      model: "BussinessCategory",
      select: "bussinessCategoryName",
    },
  ],
});

/*var currentStateFinal = async function(obj) {
  //console.log('this', obj.parent().address.state);
  return await obj.parent().address.state;
};*/
var currentState = "undefined";
function setOpeningTime() {
  /*//console.log('before current---->', currentState);
  if(currentState == 'undefined') {
    console.log('in function current first---->', currentState);
    currentState = currentStateFinal(this);
    setTimeout(2000);
    //await new Promise(r => setTimeout(r, 2000));
  }
  console.log('current---->', currentState);*/
  /*var statesList = stateExist();
  var stateTime = statesList.filter(function(stateObj) {
    return stateObj.state === currentState;
  });
  //console.log('state time', stateTime);
  var finalTime = (9 - (parseInt(stateTime[0].time)));*/

  var openingTime = new Date();
  //console.log('Time Zone--->', openingTime.getTimezoneOffset()/-60);
  openingTime.setHours(9);
  openingTime.setMinutes(0);
  //console.log('opening time UTC String', openingTime.toISOString());
  //console.log('opening time to String', openingTime.toString());
  //return false;
  return openingTime;
}

function setClosingTime() {
  /* var closingCurrentState = this.parent().address.state;
   var closingStatesList = stateExist();
   var closingStateTime = closingStatesList.filter(function(stateObj) {
     return stateObj.state === closingCurrentState;
   });

   var closingFinalTime = (18 - (parseInt(closingStateTime[0].time)));*/

  var closingTime = new Date();
  closingTime.setHours(18);
  closingTime.setMinutes(0);
  //return false;
  return closingTime;
}
/*
function stateExist(states) {
  states = [
    {state:"Alabama",time:"-06"},
    {state:"Alaska",time:"-09"},
    {state:"Arizona",time:"-07"},
    {state:"Arkansas",time:"-06"},
    {state:"California",time:"-08"},
    {state:"Colorado",time:"-07"},
    {state:"Connecticut",time:"-05"},
    {state:"Columbia",time:"-05"},
    {state:"Delaware",time:"-05"},
    {state:"Florida",time:"-05"},
    {state:"Georgia",time:"-05"},
    {state:"Hawaii",time:"-10"},
    {state:"Idaho",time:"-08"},
    {state:"Illinois",time:"-06"},
    {state:"Indiana",time:"-05"},
    {state:"Iowa",time:"-06"},
    {state:"Kansas",time:"-06"},
    {state:"Kentucky",time:"-05"},
    {state:"Louisiana",time:"-06"},
    {state:"Maine",time:"-05"},
    {state:"Maryland",time:"-05"},
    {state:"Massachusetts",time:"-05"},
    {state:"Michigan",time:"-05"},
    {state:"Minnesota",time:"-06"},
    {state:"Mississippi",time:"-06"},
    {state:"Missouri",time:"-06"},
    {state:"Montana",time:"-07"},
    {state:"Nebraska",time:"-06"},
    {state:"Nevada",time:"-08"},
    {state:"New Hampshire",time:"-05"},
    {state:"New Jersey",time:"-05"},
    {state:"New Mexico",time:"-07"},
    {state:"New York",time:"-05"},
    {state:"N.Carolina",time:"-05"},
    {state:"N.Dakota",time:"-06"},
    {state:"Ohio",time:"-05"},
    {state:"Oklahoma",time:"-06"},
    {state:"Oregon",time:"-08"},
    {state:"Pennsylvania",time:"-05"},
    {state:"Rhode Island",time:"-05"},
    {state:"S.Carolina",time:"-05"},
    {state:"S.Dakota",time:"-06"},
    {state:"Tennessee",time:"-05"},
    {state:"Texas",time:"-06"},
    {state:"Utah",time:"-07"},
    {state:"Vermont",time:"-05"},
    {state:"Virginia",time:"-05"},
    {state:"Washington",time:"-08"},
    {state:"W.Virginia",time:"-05"},
    {state:"Wisconsin",time:"-06"},
    {state:"Wyoming",time:"-07"}
  ];
  return states;
}
*/
var Model = mongoose.model("User", UserSchema);

//console.log('Final model', Model);

// Model.createMapping(function (err, mapping) {
//   if (err) {
//     console.log('error creating mapping (you can safely ignore this)');
//     console.log(err);
//   } else {
//     console.log('mapping created!');
//     console.log(mapping);
//     synchronize();
//   }
// });

// function synchronize() {
//   var stream = Model.synchronize({ email_verification: false });
//   var count = 0;

//   stream.on('data', function (err, doc) {
//     count++;
//   });
//   stream.on('close', function () {
//     console.log('indexed ' + count + ' documents!');
//   });
//   stream.on('error', function (err) {
//     console.log(err);
//   });
// }

module.exports = Model;
