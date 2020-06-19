# OKTAFORM

This a tool that leverages terraform to pull into config/resources from one Okta to another Okta tenant.  You have the option to allow this app to automatically migrate config like groups, applications, and authorization servers or just have it generate a .tf file for you. Feel free to fork if you want add features or report issues as with any open source project.


## Demo
Url Coming Soon

## Quick start

This app uses Vue so Vue, Node, npm are a must as well as having terraform.  Just clone this project. do npm install and then open up two terminal windows, one where you run the Vue App with npm run serve, and the other whe you run node server.js. If you want this application to apply and migrate the configuration for you run terraform init in the command line and edit the init.tf file with the info of the Okta Org you want to migrate to.  Additionally if you do not want to type out your api key and url feel free to leverage .env file with OKTA_URL= and OKTA_API_TOKEN=.

Commands as mentioned above ^

```
$ git clone git@github.com:andrewvanbeek-okta/okta-form.git

$ cd okta-form

$ npm install

# Optional
$ terraform init

$ npm start
```

## Credit

Credit for the UI to http://creative-tim.com/, really top-notch stuff.  Also Credit to Andy G from Articulate for his work on terraform and Okta.

## Documentation
Coming Soon


## Reporting Issues
I use GitHub Issues as the official bug tracker for the project. Here are some advices for our users that want to report an issue:

## Technical Support or Questions

If you have questions or need help integrating the product please leave it on the github ;0.

Sicnerely,

The Man, The Myth, The L3gend, AVB
