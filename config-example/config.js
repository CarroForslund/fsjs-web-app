module.exports = {

  twitter: {

    consumer_key:         '',
    consumer_secret:      '',
    access_token:         '',
    access_token_secret:  ''
    // timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.

  },
  facebook: {
    app_id:       '',
    app_secret:   '',
    callback_url:    'http://localhost:3000/auth/facebook/return',
    profile_fields:  ['id', 'displayName', 'photos', 'email']
  },
  instagram : {

    // username:       '',
    // password:       '',
    client_id:      '',
    client_secret:  '',
    // redirect_uri:   'http://localhost:3000/auth',
    // auth_url:       'yourAuthUrl'

  },
  flickr: {

    api_key: ''

  }
  // github : {
  //
  //   client_id:      '',
  //   client_secret:  '',
  //   callback_url:   ''
  // }

}
