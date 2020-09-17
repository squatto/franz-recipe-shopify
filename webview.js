"use strict";

module.exports = Franz => {
  const contains = function (selector, text) {
    const elements = document.querySelectorAll(selector);
    return Array.prototype.filter.call(elements, function(element){
      return RegExp(text).test(element.textContent);
    });
  }

  // have we clicked an account link already?
  let accountLinkClicked = false;

  const checkIfLoggedOut = () => {
    // check for a heading that says "Choose an account"
    // if it's present, we are logged out and Shopify is asking us to select our account to log back in
    const heading = document.querySelector('h1.ui-heading');

    if (heading !== undefined && heading.textContent === 'Choose an account') {
      // we're logged out and the account selection screen is showing
      console.log('Logged out');
      console.log('Checking for an account to log into');

      // find the first account link
      const link = document.querySelector('a.account-picker__item');

      if (link !== undefined) {
        // click the account link to log us back in
        console.log('Found an account to log into');
        console.log('Clicking the account link...');

        accountLinkClicked = true;
        link.click();
      } else {
        console.warn('Unable to find an account to log into!');
      }
    }
  };

  const getMessages = function getMessages() {
    let unread = 0;

    try {
      unread = parseInt(
        contains('span', '^Orders$')[0]
          .nextSibling
          .children[0]
          .innerText
          .split("\n")[1]
          .replace(',', ''),
        10
      );
    } catch (e) {
      // unable to find order count
    }

    Franz.setBadge(parseInt(unread, 10));

    if (! accountLinkClicked) {
      checkIfLoggedOut();
    }
  };

  Franz.loop(getMessages);
};
