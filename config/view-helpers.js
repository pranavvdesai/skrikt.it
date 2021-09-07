const fs = require('fs');
const path = require('path');

module.exports = (app) => {
    app.locals.asset_path = (filePath) => {
        if(process.env.NODE_ENV === 'development'){
            return filePath
        }

        return '/' + JSON.parse(fs.readFileSync(path.join(__dirname,'../public/assets/rev-manifest.json')))[filePath]
    }
}