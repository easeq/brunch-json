'use strict';

var forEach = require('lodash.foreach');

class FlutterConfig {
    compile(file) {
        if (!file || !file.data) {
            return Promise.resolve(file);
        }

        let data = JSON.parse(file.data);
        var imports = [];
        if(data && data.imports) {
            forEach(data.imports, function(value, key) {
                // console.log(key, value);
                imports.push(`const ${key} = ${value};`);
            });

            delete data.imports;
        }

        data = JSON.stringify(data, null, 4);
        var patt = /\"%%(.+)%%\"/g;
        var replacement = "$1";
        data = data.replace(patt, replacement);
        data = data.replace(/\\\//g, '/');

        file.data = `${imports.join('\n')}`;
        file.data += imports.length > 0 ? `\n` : '';
        file.data += `exports.default = ${data}`;

        return Promise.resolve(file);
    }
}

FlutterConfig.prototype.brunchPlugin = true;
FlutterConfig.prototype.type = 'javascript';
FlutterConfig.prototype.extension = 'json';

module.exports = FlutterConfig;
