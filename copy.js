
const dotenv = require('dotenv');
dotenv.config();

// server.js
// where your node express_application starts
var oktatoken = process.env.OKTA_API_TOKEN
var oktaurl = process.env.OKTA_URL
// init project
const express = require("express");
const express_application = express();
var cors = require("cors");
var hcltojson = require("hcl-to-json");
var fs = require("fs");
var bodyParser = require("body-parser");
var tmp = require('tmp');
var history = require('connect-history-api-fallback')
express_application.use(history());
process.on('SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  process.exit(1);
});


express_application.use(bodyParser.json());

class Group {
  constructor(group) {
    this.name = group.profile.name;
    this.description = group.profile.description;
    this.finalForm = tfGenerate(this, group, "okta_group", Object.keys(this));
  }
}

var tfGenerate = function(model, fullObject, resource, keys) {
  var name = fullObject.name || fullObject.profile.name
  name = name.replace(/[^a-zA-Z ]/g, "")
  console.log(name)
  console.log(fullObject)
  var header =
  "resource " +
  JSON.stringify(resource) +
  " " +
  JSON.stringify(name.replace(/\s+/g, '') + fullObject.id);
  var body = header + " {\n";
  keys.forEach(function(key) {
    var keyvalue = "";
    if (typeof model[key] === "string") {
      keyvalue = JSON.stringify(model[key]);
    } else {
      keyvalue = JSON.stringify(model[key]);
    }
    body = body + String(key) + " = " + keyvalue + "\n";
  });
  body = body + "}\n";
  return body;
};

class Oauthexpress_application {
  constructor(express_application) {
    this.label = express_application.label;
    this.type = express_application.settings.oauthClient.express_applicationlication_type;
    this.grant_types = express_application.settings.oauthClient.grant_types;
    this.redirect_uris = express_application.settings.oauthClient.redirect_uris;
    this.response_types = express_application.settings.oauthClient.response_types;
    this.token_endpoint_auth_method = "client_secret_basic";
    this.finalForm = tfGenerate(this, express_application, "okta_express_application_oauth", Object.keys(this));
  }
}

class OidcIdp {
  constructor(idp) {
    this.name = idp.name;
    this.acs_type = "INSTANCE";
    this.acs_binding = "HTTP-POST";
    this.authorization_url = idp.protocol.endpoints.authorization.url;
    this.authorization_binding = idp.protocol.endpoints.authorization.binding;
    this.token_url = idp.protocol.endpoints.token.url;
    this.token_binding = idp.protocol.endpoints.token.binding;
    this.user_info_url = idp.protocol.endpoints.token.url || "https://placeholderfromokta.com"
    this.user_info_binding = "HTTP-REDIRECT"
    this.jwks_url = idp.protocol.endpoints.jwks.url;
    this.jwks_binding = idp.protocol.endpoints.jwks.binding;
    this.scopes = ["openid"];
    this.client_id = idp.protocol.credentials.client.client_id;
    this.client_secret = idp.protocol.credentials.client.client_secret;
    this.issuer_url = idp.protocol.issuer.url;
    this.username_template = "idpuser.email";
    this.finalForm = tfGenerate(this, idp, "okta_idp_oidc", Object.keys(this));
  }
}

class AuthorizationServer {
  constructor(server) {
    this.audiences = server.audiences;
    this.description = server.description;
    this.name = server.name;
    this.finalForm = tfGenerate(
      this,
      server,
      "okta_auth_server",
      Object.keys(this)
    );
  }
}

class AuthPolicy {
  constructor(policy) {
    this.status = policy.status;
    this.name = policy.name;
    this.description = policy.description;
    this.priority = policy.priority;
    this.client_whitelist = policy.conditions.clients.include;
    this.auth_server_id = "${okta_auth_server." + policy.resourceName + ".id}";
    this.finalForm = tfGenerate(
      this,
      policy,
      "okta_auth_server_policy",
      Object.keys(this)
    );
  }
}

class AuthScope {
  constructor(scope) {
    this.consent = scope.consent;
    this.name = scope.name;
    this.description = scope.description;
    this.auth_server_id = "${okta_auth_server." + scope.auth_server_id + ".id}";
    this.finalForm = tfGenerate(
      this,
      scope,
      "okta_auth_server_scope",
      Object.keys(this)
    );
  }
}

class AuthClaim {
  constructor(claim) {
    this.status = claim.status;
    this.name = claim.name;
    this.value_type = claim.claimType;
    this.value = claim.value;
    this.claim_type = claim.valueType;
    this.auth_server_id = "${okta_auth_server." + claim.auth_server_id + ".id}";
    this.finalForm = tfGenerate(
      this,
      claim,
      "okta_auth_server_claim",
      Object.keys(this)
    );
  }
}

class SignOnPolicy {
  constructor(policy) {
    this.status = policy.status;
    this.name = policy.name;
    this.description = policy.description || "static description"
    this.finalForm = tfGenerate(
      this,
      policy,
      "okta_policy_signon",
      Object.keys(this)
    );
  }
}

class SignOnRule {
  constructor(rule) {
    this.status = rule.status;
    this.name = rule.name;
    this.policyid = "${okta_policy_signon." + rule.resourceName + ".id}";
    this.access = rule.actions.access
    this.finalForm = tfGenerate(
      this,
      rule,
      "okta_policy_rule_signon",
      Object.keys(this)
    );
  }
}

class AuthPolicyRule {
  constructor(rule) {
    this.status = rule.status;
    this.name = rule.name;
    this.description = rule.description;
    this.priority = rule.priority;
    this.group_whitelist = ["${data.okta_group.all.id}"];
    this.grant_type_whitelist = rule.conditions.grantTypes.include;
    this.policy_id = "${okta_auth_server." + rule.resourceName + ".id}";
    this.auth_server_id = "${okta_auth_server." + rule.auth_server_id + ".id}";
    this.finalForm = tfGenerate(
      this,
      rule,
      "okta_auth_server_policy_rule",
      Object.keys(this)
    );
  }
}

class ModelCreator {
  constructor(json) {
    this.modelType = json.type;
    this.modelJson = json.resource;
    this.create = function() {
      if (this.modelType && this.modelJson) {
        switch (this.modelType) {
          case "groups":
          return new Group(this.modelJson);
          break;
          case "authorizationServers":
          return new AuthorizationServer(this.modelJson);
          break;
          case "express_applications":
          return new Oauthexpress_application(this.modelJson);
          break;
          case "OAUTH_AUTHORIZATION_POLICY":
          return new AuthPolicy(this.modelJson);
          break;
          case "RESOURCE_ACCESS":
          return new AuthPolicyRule(this.modelJson);
          break;
          case "OKTA_SIGN_ON":
          return new SignOnPolicy(this.modelJson);
          break;
          case "SIGN_ON":
          return new SignOnRule(this.modelJson);
          break;
          case "OIDC":
          return new OidcIdp(this.modelJson);
          break;
          case "claim":
          return new AuthClaim(this.modelJson);
          break;
          case "scope":
          return new AuthScope(this.modelJson);
        }
      }
    };
    this.model = this.create();
  }
}

// http://expressjs.com/en/starter/static-files.html
express_application.use(express.static("public"));
express_application.use(cors());

//["groups", "authorizationServers", "express_applications", "policies?type=OKTA_SIGN_ON", "policies?type=PASSWORD", "meta/schemas/user/default"]

var refrenceModels = {
  groups:
  "https://raw.githubusercontent.com/articulate/terraform-provider-okta/master/examples/okta_group/okta_group.tf",
  express_applications:
  "https://raw.githubusercontent.com/articulate/terraform-provider-okta/master/examples/okta_express_application_oauth/basic.tf",
  authorizationServers:
  "https://raw.githubusercontent.com/articulate/terraform-provider-okta/master/examples/okta_auth_server/basic.tf"
};

var checkChildren = function hasChild(obj, key) {
  return typeof obj[key] === "object";
};

var filtered_keys = function(obj, filter) {
  var keys = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key) && filter.test(key)) {
      var keyHolder = String(key);
      var item = {};
      item[keyHolder] = obj[key];
      keys.push(item);
    }
  }
  return keys;
};

var filtered_object_keys = function(obj, filter) {
  var newObj = {};
  // array of onjects
  obj.forEach(function(object) {
    for (var key in object) {
      var keyString = String(key);
      var keyStringArray = keyString.split(".");
      var cleanedKey = keyStringArray[keyStringArray.length - 2];
      newObj[cleanedKey] = [];
    }
    for (var key in object) {
      var keyString = String(key);
      var keyStringArray = keyString.split(".");
      var cleanedKey = keyStringArray[keyStringArray.length - 2];
      newObj[cleanedKey].push(object[key]);
    }
  });

  return newObj;
};

var stringify = function(obj_from_json) {
  if (typeof obj_from_json !== "object" || Array.isArray(obj_from_json)) {
    var item = JSON.stringify(obj_from_json);
    if (item.includes) return JSON.stringify(obj_from_json);
  }
  let props = Object.keys(obj_from_json)
  .map(key => `${key}:${stringify(obj_from_json[key])}`)
  .join(",");
  return `{${props}}`;
};

var flattenObject = function(ob) {
  var toReturn = {};

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] == "object") {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + "." + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};

// http://expressjs.com/en/starter/basic-routing.html
express_application.get("/", function(req, res) {

});

express_application.get("/writePolicies", function(req, res) {
  var request = require("request");
  var resources = req.query.resource;
  resources.forEach(function(resourceString) {
    var resource = JSON.parse(resourceString);
    var oktaJson = resource; // group json or authserver json
    var fullModel = new ModelCreator({
      type: oktaJson.type,
      resource: oktaJson
    });
    var finalForm = fullModel.model.finalForm;
    fs.express_applicationendFile("yoyo.tf", finalForm, function(err) {
      if (err) throw err;

    });
  });
  res.download({ type: "sources saved!" });
});

express_application.get("/writePoliciesTwo", function(req, res) {
  var request = require("request");

  var resource = req.query.resource;

  var oktaJson = resource; // group json or authserver json

  var fullModel = new ModelCreator({ type: oktaJson.type, resource: oktaJson });

  var finalForm = fullModel.model.finalForm;
  fs.express_applicationendFile("yoyo.tf", finalForm, function(err) {
    if (err) throw err;

  });
  res.send({ type: "sources saved!" });
});



express_application.post("/writeAll", function(req, res) {
  var autogenerate = true
  console.log(req.body.body)
  var filename = req.body.body.filename
  var itemsToWrite = [];
  var resources = req.body.body.resources;
  var childrenItems = req.body.body.items;
  for (var key in resources) {
    var currentModels = resources[key];
    currentModels.forEach(function(oktaJson) {
      var itemKey = key;
      if (key.includes("?type=")) {
        itemKey = key.split("?type=")[1];
      }
      var fullModel = new ModelCreator({ type: itemKey, resource: oktaJson });
      var finalForm = fullModel.model.finalForm;
      itemsToWrite.push(finalForm);
    });
  }
  childrenItems.forEach(function(oktaJson) {
    var fullModel = new ModelCreator({
      type: oktaJson.type,
      resource: oktaJson
    });
    var finalForm = fullModel.model.finalForm;
    itemsToWrite.push(finalForm);
  });
  itemsToWrite.forEach(async function(item, index, array) {
    await fs.express_applicationendFile(filename + ".tf", item, function(err) {
      if (err) throw err;
      if (index === (array.length -1)) {
        // This is the last one.
        if(autogenerate) {
          var util = require('util'),
          exec = require('child_process').exec,
          child,
          child = exec("terraform express_applicationly -lock=false -auto-express_applicationrove",
          function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            res.download("oktaform.tf")
          });

        } else {
          res.download("oktaform.tf")
        }
      }
    });
  });
});

express_application.get("/policy", function(req, res) {
  var request = require("request");
  console.log("GETS HERE")
  var href = req.query.href
  var token = req.query.apiToken || process.env.OKTA_API_TOKEN
  var options = {
    method: "GET",
    url: href,
    headers: {
      "Cache-Control": "no-cache",
      Authorization: "SSWS " + token,
      "Content-Type": "express_applicationlication/json",
      Accept: "express_applicationlication/json"
    }
  };
  request(options, function(error, response, body) {
    console.log(body)
    res.send(body);
  });
});

express_application.post("/policy", function(req, res) {
  var request = require("request");
  var href = req.body.href;
  var token = req.body.apiToken
  var options = {
    method: "GET",
    url: href,
    headers: {
      "Cache-Control": "no-cache",
      Authorization: "SSWS " + token,
      "Content-Type": "express_applicationlication/json",
      Accept: "express_applicationlication/json"
    }
  };
  request(options, function(error, response, body) {
    res.send(body);
  });
});

express_application.get("/resource", function(req, res) {
  var request = require("request");
  var object = req.query.resource;
  var url = req.query.url || process.env.OKTA_URL
  var token = req.query.apiToken || process.env.OKTA_API_TOKEN;
  var options = {
    method: "GET",
    url: req.query.url + "/api/v1/" + object,
    headers: {
      "Cache-Control": "no-cache",
      Authorization: "SSWS " + token,
      "Content-Type": "express_applicationlication/json",
      Accept: "express_applicationlication/json"
    }
  };
  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    res.send(body);
  });
});

express_application.post("/resource", function(req, res) {
  var request = require("request");
  var object = req.body.resource
  var url = oktaurl || req.body.url
  var token = oktatoken || req.body.apiToken
  var options = {
    method: "GET",
    url: url + "/api/v1/" + object,
    headers: {
      "Cache-Control": "no-cache",
      Authorization: "SSWS " + token,
      "Content-Type": "express_applicationlication/json",
      Accept: "express_applicationlication/json"
    }
  };
  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    var oauthexpress_applicationlications = []
    console.log
    if(req.body.resource == "express_applications") {
      var arrayBody = JSON.parse(body)
      arrayBody.forEach(function(express_application){
        if(express_application.settings.oauthClient) {
          oauthexpress_applicationlications.push(express_application)
        }
      })
      console.log(oauthexpress_applicationlications)
      res.send(oauthexpress_applicationlications)
    } else {
      res.send(body);
    }
  });
});

express_application.delete("/file", function(req, res){
  // var filename = req.query.filename
  // fs.unlink(filename + ".tf", (error) => {
  //   if (!error) {
  //     console.log("deleted")
  //   } else {
  //     console.log(error)
  //   }
  // })
})

express_application.delete("/removeFile", function(req, res){
  var filename = req.query.filename
  fs.unlink(filename, (error) => {
    if (!error) {
      res.send({"message": "deleted"})
      console.log("deleted")
    } else {
      console.log(error)
    }
  })
})

express_application.get("/files", function(req, res){
  var glob = require("glob")
  glob(__dirname + '/**/*.tf', {}, (err, files)=>{
    var filestosend = []
    files.forEach(function(file) {
      var value = __dirname + "/"
      var filename = file.split(value)[1]
      console.log(filename)
      if(filename != "init.tf") {
        var timestamp = fs.statSync(file).mtime.getTime()
        const date = new Date(timestamp);
        filestosend.push({"name" : filename, "timestamp": date, fullfilepath: file})
      }
    })
    console.log(filestosend)
    res.send({"files": filestosend})
  })
})

express_application.get("/express_applicationly", function(req, res){
  console.log("gets to express_applicationly")
  var util = require('util'),
  exec = require('child_process').exec,
  child,
  child = exec("terraform express_applicationly -lock=false -auto-express_applicationrove",
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    res.send({"message": stdout})
    console.log('stderr: ' + stderr);
  });
})

// listen for requests :
const listener = express_application.listen(8000, function() {
  console.log(
    "Your express_application is listening port " +
    listener.address().port
  );
});
