
  // Initialize Firebase
  var config = {
    messagingSenderId: "1036616839013",
  };
  firebase.initializeApp(config);

  const messaging = firebase.messaging();

  messaging.onTokenRefresh(function() {
    messaging.getToken()
    .then(function(refreshedToken) {
      console.log('Token refreshed.');
      // Indicate that the new Instance ID token has not yet been sent to the
      // app server.
      setTokenSentToServer(false);
      // Send Instance ID token to app server.
      sendTokenToServer(refreshedToken);
    })
    .catch(function(err) {
      console.log('Unable to retrieve refreshed token ', err);
    });
  });

  // Handle incoming messages. Called when:
  // - a message is received while the app has focus
  // - the user clicks on an app notification created by a sevice worker
  //   `messaging.setBackgroundMessageHandler` handler.
  messaging.onMessage(function(payload) {
    console.log("Message received. ", payload);
  });

  function resetUI() {

    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging.getToken()
    .then(function(currentToken) {
      if (currentToken) {
        sendTokenToServer(currentToken);
      } else {
        console.log('No Instance ID token available. Request permission to generate one.');
        setTokenSentToServer(false);
        requestPermission();
      }
    })
    .catch(function(err) {
      console.log('An error occurred while retrieving token. ', err);
      setTokenSentToServer(false);
    });
  }

  // Send the Instance ID token your application server, so that it can:
  // - send messages back to this app
  // - subscribe/unsubscribe the token from topics
  function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer()) {
      console.log('Sending token to server...');
      $.get("https://iithbt.herokuapp.com/news/notif_reg?token="+currentToken, function(res){
        console.log(res);
        setTokenSentToServer(true);
      });
    } else {
      console.log('Token already sent to server so won\'t send it again ' +
        'unless it changes');
    }
  }

  function isTokenSentToServer() {
    if (window.localStorage.getItem('sentToServer') == 1) {
      return true;
    }
    return false;
  }

  function setTokenSentToServer(sent) {
    window.localStorage.setItem('sentToServer', sent?1:0);
  }


  function requestPermission() {
    console.log('Requesting permission...');
    messaging.requestPermission()
    .then(function() {
      console.log('Notification permission granted.');
      resetUI();
    })
    .catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
  }

  function deleteToken() {
    // Delete Instance ID token.
    // [START delete_token]
    messaging.getToken()
    .then(function(currentToken) {
      messaging.deleteToken(currentToken)
      .then(function() {
        console.log('Token deleted.');
        setTokenSentToServer(false);
        // [START_EXCLUDE]
        // Once token is deleted update UI.
        resetUI();
        // [END_EXCLUDE]
      })
      .catch(function(err) {
        console.log('Unable to delete token. ', err);
      });
      // [END delete_token]
    })
    .catch(function(err) {
      console.log('Error retrieving Instance ID token. ', err);
    });
  }

  resetUI();