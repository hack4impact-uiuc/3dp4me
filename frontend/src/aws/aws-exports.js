const awsconfig = { 
    Auth: {
      identityPoolId: 'us-east-2:eebab691-ab2b-4225-bd67-9f5e79fa61ee',
      region: 'us-east-2',
      userPoolId: 'us-east-2_xE6iqHhIV',
      userPoolWebClientId: '25cnrbddteac1ak0dtm7coojvh',
      mandatorySignIn: true,
    }, 
    Storage: {
      AWSS3: {
          bucket: '3dp4me-dev',
          region: 'us-east-2',
      }
    }
  }
  
  export default awsconfig;