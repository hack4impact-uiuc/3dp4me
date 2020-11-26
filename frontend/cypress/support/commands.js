// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import Amplify, { Auth } from 'aws-amplify';
import awsconfig from '../../src/aws/aws-exports'
Amplify.configure(awsconfig);

Cypress.Commands.add("login", (email, password) => {
  return Auth.signIn(email, password)
      .then(user => {
        console.log('===> user', user);

        let session = Auth.currentSession();

        console.log('===> session', session);
      })
      .catch(err => console.log('===> err', err));
})

