const fs = require('fs');

const dotEnvExists = fs.existsSync('.env')
if (dotEnvExists) {
    console.log('getEnv.js: .env exists, probably running on development environment')
    process.exit()
}

const gcs = require('@google-cloud/storage')()

const bucketName = `envvarstimebank`;
console.log('Downloading .env from bucket envvarstimebank');
gcs
    .bucket(bucketName)
    .file('.env')
    .download({ destination: '.env' })
    .then(() => {
        console.info('getEnv.js: .env downloaded succesfully')
    })
    .catch(e => {
        console.error(`getEnv.js: There was an error: ${JSON.stringify(e, undefined, 2)}`)
    })