<template>
  <div class="wrapper">
    <div id="cover">
      <center>
        <atom-spinner class="loader" :animation-duration="1000" :size="600" :color="'#ff1d5e'" />
      </center>
    </div>
    <div>
      <parallax class="section page-header" :style="headerStyle">
        <div class="container">
          <div class="md-layout">
            <div class="md-layout-item md-size-50 md-small-size-70 md-xsmall-size-100">
              <br />
              <md-button
                href="https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q"
                class="md-success md-lg"
                target="_blank"
              >
                <i class="fas fa-play"></i> Watch video
              </md-button>
            </div>
          </div>
        </div>
      </parallax>
      <div class="main main-raised">
        <div class="section">
          <div class="container">
            <div class="md-layout">
              <div class="md-layout-item md-size-66 md-xsmall-size-100 mx-auto text-center">
                <h2 class="title text-center">Let's talk product</h2>
                <h5 class="description">
                  This is the paragraph where you can write more details about
                  your product. Keep you user engaged by providing meaningful
                  information. Remember that by this time, the user is curious,
                  otherwise he wouldn't scroll to get here. Add a button if you
                  want the user to see more.
                </h5>
              </div>
            </div>
            <div class="features text-center">
              <div class="md-layout">
                <div class="md-layout-item md-medium-size-33 md-small-size-100">
                  <img src="https://miro.medium.com/max/960/0*3i0MOCi2wHX607Jp.png" />
                  <h4 class="info-title">Free Chat</h4>
                  <p>
                    Divide details about your product or agency work into parts.
                    Write a few lines about each one. A paragraph describing a
                    feature will be enough.
                  </p>
                </div>
              </div>
              <div class="md-layout-item md-medium-size-33 md-small-size-100">
                <div class="info">
                  <img
                    src="https://www.okta.com/sites/all/themes/Okta/images/logos/developer/Thumbnail-folderDeveloper.png"
                  />
                  <h4 class="info-title">Verified Users</h4>
                  <p>
                    Divide details about your product or agency work into parts.
                    Write a few lines about each one. A paragraph describing a
                    feature will be enough.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>9
      <div class="section section-contacts">
        <div class="container">
          <div class="md-layout">
            <div
              style="align-items: flex-start;"
              class="md-layout-item md-size-100 md-xsmall-size-100 mx-auto"
            >
              <h2 class="text-center title">Okta Details</h2>
              <h4 class="text-center description">
                Just Provide your Api key and URL. We do not transmit this anywhere else. Or Save Configs here
                <md-button v-on:click="openConfig()" class="md-primary md-just-icon md-round">
                  <md-icon>settings</md-icon>
                </md-button>
              </h4>
              <form class="contact-form">
                <div class="md-layout">
                  <div class="md-layout-item md-size-50">
                    <md-field>
                      <label>Your Okta Url</label>
                      <md-input v-model="url" type="text"></md-input>
                    </md-field>
                  </div>
                  <div class="md-layout-item md-size-50">
                    <md-field>
                      <label>Your Api Key</label>
                      <md-input v-model="apiToken" type="password"></md-input>
                    </md-field>
                  </div>
                </div>
                <md-field maxlength="5">
                  <label>Name Your File</label>
                  <md-input v-model="filename"></md-input>
                </md-field>
                <div class="md-layout">
                  <div class="md-layout-item md-size-33 mx-auto text-center">
                    <md-button v-on:click="pullResources()" class="md-success">Get Okta Config</md-button>
                  </div>
                </div>
              </form>
              <center></center>
              <vue-tabs>
                <v-tab v-for="(table, i) in tables" v-if="renderComponent" :title="tables[i].title">
                  <div style="align-items: flex-start;" class="full-table">
                    <h1>{{tables[i].title}}</h1>
                    <md-table v-model="tables[i].respData" md-card @md-selected="onSelect">
                      <md-table-toolbar>
                        <h1 class="md-title">With auto select and alternate headers</h1>
                      </md-table-toolbar>
                      <md-table-toolbar slot="md-table-alternate-header" slot-scope="{ count }">
                        <div class="md-toolbar-section-start">{{ getAlternateLabel(count) }}</div>
                        <div class="md-toolbar-section-end">
                          <md-button class="md-icon-button">
                            <md-icon>delete</md-icon>
                          </md-button>
                        </div>
                      </md-table-toolbar>
                      <md-table-row
                        slot-scope="{ item }"
                        slot="md-table-row"
                        md-seleted="true"
                        md-selectable="multiple"
                        md-auto-select
                      >
                        <md-table-cell
                          v-for="key in Object.keys(item)"
                          :md-label="key"
                          md-sort-by="name"
                        >{{ item[key] }}</md-table-cell>
                      </md-table-row>
                    </md-table>
                    <md-button
                      v-on:click="sendApiResource(tables[i].title)"
                      class="md-success"
                    >Add/Remove {{ tables[i].title }}</md-button>
                  </div>
                </v-tab>
              </vue-tabs>
            </div>
          </div>
        </div>
      </div>
      <md-switch v-model="autogenerate">Auto Migrate is on</md-switch>
      <md-button v-on:click="sendSelected()" class="md-success">Generate</md-button>
      <md-button v-on:click="show()" class="md-success">show</md-button>
      <md-button v-on:click="showDelete()" class="md-success">delete</md-button>
      <modal name="hello-world" :adaptive="true" :scrollable="true" width="80%" height="auto">
        <div v-for="(table, i) in addedTables" v-if="renderComponent" class="full-table">
          <h1>{{addedTables[i].title}}</h1>
          <md-table v-model="addedTables[i].respData" md-card>
            <md-table-toolbar>
              <h1 class="md-title">With auto select and alternate headers</h1>
            </md-table-toolbar>
            <md-table-toolbar slot="md-table-alternate-header" slot-scope="{ count }">
              <div class="md-toolbar-section-start">{{ getAlternateLabel(count) }}</div>
              <div class="md-toolbar-section-end">
                <md-button class="md-icon-button">
                  <md-icon>delete</md-icon>
                </md-button>
              </div>
            </md-table-toolbar>
            <md-table-row slot-scope="{ item }" slot="md-table-row">
              <md-table-cell
                v-for="key in Object.keys(item)"
                :md-label="key"
                md-sort-by="name"
              >{{ item[key] }}</md-table-cell>
            </md-table-row>
          </md-table>
        </div>
      </modal>
      <modal name="delete" :adaptive="true" :scrollable="true" width="80%" height="auto">
        <div v-if="renderComponent" class="full-table">
          <h1>Delete Models and Files</h1>
          <md-table v-model="files" md-sort="timestamp" md-sort-order="asc" md-card>
            <md-table-toolbar>
              <h1 class="md-title">With auto select and alternate headers</h1>
            </md-table-toolbar>
            <md-table-toolbar slot="md-table-alternate-header" slot-scope="{ count }">
              <div class="md-toolbar-section-start">{{ getAlternateLabel(count) }}</div>
              <div class="md-toolbar-section-end">
                <md-button class="md-icon-button">
                  <md-icon>delete</md-icon>
                </md-button>
              </div>
            </md-table-toolbar>
            <md-table-row slot-scope="{ item }" slot="md-table-row">
              <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
              <md-table-cell md-label="Last Modified" md-sort-by="name">{{ item.timestamp }}</md-table-cell>
              <md-table-cell md-label="delete file and models associated" md-sort-by="name">
                <md-button
                  v-on:click="deleteFileAndApply(item.fullfilepath)"
                  class="md-icon-button"
                >
                  <md-icon>delete</md-icon>
                </md-button>
              </md-table-cell>
            </md-table-row>
          </md-table>
        </div>
      </modal>
      <modal name="response" :adaptive="true" :scrollable="true" width="80%" height="auto">
        <div v-model="serverResponse">{{serverResponse}}</div>
      </modal>
      <modal name="spinner" :adaptive="true" :scrollable="true" width="50%" height="auto">
        <center>
          <h3>Hold tight</h3>
          <atom-spinner :animation-duration="1000" :size="60" :color="'#ff1d5e'" />
        </center>
      </modal>
      <modal name="configure" :adaptive="true" :scrollable="true" width="50%" height="auto">
        <form class="contact-form">
          <div class="md-layout">
            <div class="md-layout-item md-size-50 md-small-size-100 mr-auto">
              <login-card header-color="green">
                <h4 slot="title" class="card-title">Okta Tenant 1</h4>
                <p slot="description" class="description">Place the Okta url and api token you want to pull data from here</p>
                <md-field class="md-form-group" slot="inputs">
                  <md-icon>web</md-icon>
                  <label>Okta Url</label>
                  <md-input v-model="oktaTenantOneUrl"></md-input>
                </md-field>
                <md-field class="md-form-group" slot="inputs">
                  <md-icon>lock_outline</md-icon>
                  <label>Api Token for first tenant</label>
                  <md-input v-model="oktaTenantOneApiToken"></md-input>
                </md-field>
                <md-button slot="footer" class="md-simple md-success md-lg">Get Started</md-button>
              </login-card>
            </div>
            <div class="md-layout-item md-size-50 md-small-size-100 mr-auto">
              <login-card header-color="green">
                <h4 slot="title" class="card-title">Okta Tenant 2</h4>
                <p slot="description" class="description">Place the Okta url and api token you want to migrate data to here</p>
                <md-field class="md-form-group" slot="inputs">
                  <md-icon>web</md-icon>
                  <label>okta url</label>
                  <md-input v-model="oktaTenantTwoUrl"></md-input>
                </md-field>
                <md-field class="md-form-group" slot="inputs">
                  <md-icon>lock_outline</md-icon>
                  <label>Api Token for second tenant</label>
                  <md-input v-model="oktaTenantTwoApiToken"></md-input>
                </md-field>
                <md-button slot="footer" class="md-simple md-success md-lg">Get Started</md-button>
              </login-card>
            </div>
          </div>
        </form>
      </modal>
    </div>
  </div>
</template>

<script>
import Spinner from "vue-spinner-component/src/Spinner.vue";
import { VueTabs, VTab } from "vue-nav-tabs";
import "vue-nav-tabs/themes/vue-tabs.css";

import $ from "jquery";
import Api from "@/services/api/Api";
import { AtomSpinner } from "epic-spinners";
import FileDownload from "js-file-download";
import Loading from "vue-loading-overlay";
import {LoginCard} from '@/components'
export default {
  bodyClass: "landing-page",
  props: {
    header: {
      type: String,
      default: require("@/assets/img/bg7.jpg")
    },
    teamImg1: {
      type: String,
      default: require("@/assets/img/faces/avatar.jpg")
    },
    teamImg2: {
      type: String,
      default: require("@/assets/img/faces/christian.jpg")
    },
    teamImg3: {
      type: String,
      default: require("@/assets/img/faces/kendall.jpg")
    }
  },
  components: {
    AtomSpinner,
    VueTabs,
    Spinner,
    VTab,
    LoginCard
  },
  data() {
    return {
      url: null,
      resources: {},
      policies: [],
      autogenerate: true,
      rules: [],
      serverResponse: "",
      oktaTenantOneUrl: "",
      oktaTenantOneApiToken: "",
      oktaTenantTwoUrl: "",
      oktaTenantTwoApiToken: "",
      apiToken: null,
      message: null,
      selected: [],
      loading: "",
      filename: "oktaform",
      renderComponent: true,
      tables: [],
      addedTables: [],
      render: false,
      files: [{ name: "test" }],
      rezources: []
    };
  },
  methods: {
    spinning(value) {
      if (value) {
        this.$modal.show("spinner");
      } else {
        this.$modal.hide("spinner");
      }
    },
    show() {
      var component = this;
      this.addedTables = [];
      for (var key in this.resources) {
        if (this.resources.hasOwnProperty(key)) {
          component.addedTables.push({
            title: key,
            respData: this.resources[key]
          });
        }
      }
      console.log("YEAH");
      this.$modal.show("hello-world");
    },
    async openConfig() {
      console.log("JKNDKBFKDBK");
      this.$modal.show("configure");
    },
    async showDelete() {
      var component = this;
      var files = await component.$http.get(`http://localhost:8000/files`);
      console.log(files);
      component.files = files.data.files;
      this.$modal.show("delete");
    },
    hide() {
      this.$modal.hide("hello-world");
    },
    sendSelected() {
      var component = this;
      component.spinning(true);
      var resources = component.selected;
      var allItems = component.policies.concat(component.rules);
      component.$http
        .post(`http://localhost:8000/writeAll`, {
          body: {
            resources: component.resources,
            items: allItems,
            filename: component.filename
          }
        })
        .then(response => {
          console.log(response.data);
          //let blob = new Blob([response.data], { type: 'application/tf' }),
          component.spinning(false);
          component.showResponse(response.data);
          FileDownload(response.data, component.filename + ".tf");
        })
        .catch(e => {
          console.log(e);
        });
    },
    async deleteFileAndApply(file) {
      var component = this;
      component.spinning(true);
      component.$http
        .delete("http://localhost:8000/removeFile?filename=" + file)
        .then(response => {
          component.$http.get("http://localhost:8000/apply").then(response => {
            component.showResponse(response.data.message);
            component.spinning(false);
          });
        });
    },
    showResponse(response) {
      this.serverResponse = response;
      this.$modal.show("response");
    },
    async sendApiResource(res) {
      var component = this;
      this.resources[res] = this.selected;
      console.log(this.resources[res]);
      if (this.selected.length == 0) {
        delete this.resources[res];
      }
      if (this.resources[res]) {
        this.resources[res].forEach(function(item, key, arr) {
          component.checkPoliciesAndRules(item);
          component.checkIfAuthServer(res, item);
          if (Object.is(arr.length - 1, key)) {
            component.show();
          }
        });
      } else {
        component.show();
      }
    },
    async checkIfAuthServer(key, item) {
      var component = this;
      if (key == "authorizationServers") {
        if (item["_links"]["claims"]) {
          var href = item["_links"]["claims"]["href"];
          await component.$http
            .get("http://localhost:8000/policy" + "?href=" + href, {
              params: {
                url: component.url
              }
            })
            .then(function(response) {
              console.log(response);
              response.data.forEach(function(claim) {
                var claimModel = claim;
                var name = item.name || item.profile.name;
                name = name.replace(/[^a-zA-Z ]/g, "");
                claimModel["auth_server_id"] = name + item.id;
                claimModel["type"] = "claim";
                component.rules.push(claimModel);
              });
            });
        }
        if (item["_links"]["scopes"]) {
          var href = item["_links"]["scopes"]["href"];
          await component.$http
            .get("http://localhost:8000/policy" + "?href=" + href, {
              params: {
                url: component.url
              }
            })
            .then(function(response) {
              console.log(response);
              response.data.forEach(function(scope) {
                var scopeModel = scope;
                var name = item.name || item.profile.name;
                name = item.replace(/[^a-zA-Z ]/g, "");
                scopeModel["auth_server_id"] = name + item.id;
                scopeModel["type"] = "scope";
                component.rules.push(scopeModel);
              });
            });
        }
      }
    },
    async checkPoliciesAndRules(item) {
      var component = this;
      if (item["_links"]["policies"] || item["_links"]["rules"]) {
        if (item["_links"]["policies"]) {
          var href = item["_links"]["policies"]["href"];
          component.$http
            .get("http://localhost:8000/policy", {
              url: component.url,
              apiToken: component.apiToken
            })
            .then(function(response) {
              console.log(response);
              var policies = response.data;
              var policyArray = [];
              response.data.forEach(function(policy) {
                var policyModel = policy;
                var name = item.name || item.profile.name;
                name = item.replace(/[^a-zA-Z ]/g, "");
                name = name.replace(/\s+/g, "");
                policyModel["resourceName"] = name + item.id;
                component.policies.push(policyModel);
                component.checkPoliciesAndRules(policyModel);
              });
            });
        } else if (item["_links"]["rules"]) {
          var href = item["_links"]["rules"]["href"];
          component.$http
            .get("http://localhost:8000/policy" + "?href=" + href, {
              params: {
                url: component.url
              }
            })
            .then(function(response) {
              window.alert("NFSBUFIH");
              console.log(response);
              var policies = response.data;
              var policyArray = [];
              response.data.forEach(function(rule) {
                var ruleModel = rule;
                var name = item.name || item.profile.name;
                name = name.replace(/[^a-zA-Z ]/g, "");
                name = name.replace(/\s+/g, "");
                ruleModel["resourceName"] = name + item.id;
                if (rule.type == "RESOURCE_ACCESS") {
                  ruleModel["auth_server_id"] = item["resourceName"];
                }
                component.rules.push(ruleModel);
                component.checkPoliciesAndRules(ruleModel);
              });
            });
        }
      } else {
        return "no children objects";
      }
    },
    async getPolicies(type, policyResource, href) {
      var component = this;
      component.$http
        .get("http://localhost:8000/policy" + "?href=" + href, {
          params: {
            url: component.url
          }
        })
        .then(function(response) {
          var policies = response.data;
          var policyArray = [];
          response.data.forEach(function(policy) {
            var policyModel = policy;
            policyModel["resourceName"] =
              policyResource.name + policyResource.id;
            component.policies.push(policyModel);
            if (policy["_links"]["rules"]["href"]) {
              component.getRules(
                policy.type,
                policy,
                policy["_links"]["rules"]["href"]
              );
            }
          });
        });
    },
    async getRules(type, ruleResource, href) {
      component.$http
        .post("http://localhost:8000/policy", {
          url: component.url,
          apiToken: component.apiToken
        })
        .then(function(response) {});
    },
    pullResources() {
      var component = this;
      const baseURI = "";
      var resources = [
        "groups",
        "authorizationServers",
        "apps",
        "policies?type=OKTA_SIGN_ON",
        "idps?type=SAML2",
        "idps?type=OIDC"
      ];
      resources.forEach(function(rez) {
        component.$http
          .post("http://localhost:8000/resource", {
            url: component.url,
            apiToken: component.apiToken,
            resource: rez
          })
          .then(function(response) {
            component.tables.push({ title: rez, respData: response.data });
            component.rezources = response.data;
            component.renderComponent = false;
            component.$nextTick(() => {
              component.renderComponent = true;
            });
          })
          .catch(function(error) {
            console.log(error);
          });
      });
    },
    onSelect(items) {
      var component = this;
      component.selected = items;
    },
    getAlternateLabel(count) {
      let plural = "";

      if (count > 1) {
        plural = "s";
      }

      return `${count} user${plural} selected`;
    }
  },
  computed: {
    headerStyle() {
      return {
        backgroundImage: `url(https://cdn.glitch.com/4804aa21-14f8-431e-b8d7-87a67866858a%2FOKTAFORMBIGGER.png?v=1567701043120)`
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.md-card-actions.text-center {
  display: flex;
  justify-content: center !important;
}
.contact-form {
  margin-top: 30px;
}

.full-table {
  min-width: 100%;
  margin-left: 0px;
}

.md-table {
  min-width: 100vh;
  float: left;
}

.md-has-textarea + .md-layout {
  margin-top: 15px;
}

.loader {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9999;
}

#cover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.8;
  background: #aaa;
  z-index: 10;
  display: none;
}

.pirate {
  position: -webkit-sticky;
  position: sticky;
  top: 4rem;
}

.v--modal-overlay[data-modal="spinner"] {
  background: white;
}

.v--modal-overlay[data-modal="spinner"] .v--modal-box {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  background: transparent;
}
</style>
