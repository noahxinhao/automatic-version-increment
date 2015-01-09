/*
 * automatic-version-increment
 * https://github.com/noahxinhao/automatic-version-increment
 *
 * Copyright (c) 2014 lxh
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    function getNewAssetsUrl(assetName, timestamp) {
        timestamp = timestamp.substring(0, 13);
        var newurl = '';
        if (assetName.indexOf('?v=') >= 0) {
            newurl = assetName.substring(0, assetName.length - 13) + timestamp;
        } else {
            newurl = assetName + '?v=' + timestamp;
        }
        return newurl;
    }

    function replaceAssets(fileSrc, assetUrls, options) {
        grunt.log.success("#fileSrc:" + fileSrc)
        if (grunt.file.exists(fileSrc)) {
            //grunt.log.success(assetUrls);
            var basicSrc_list = options.basicSrc;
            var assetUrl_list = assetUrls;
            basicSrc_list.forEach(function (basic) {
                assetUrl_list.forEach(function (assetUrl) {
                    grunt.file.expandMapping(basic + assetUrl).forEach(function (f) {
                        var data = grunt.file.read(fileSrc);
                        assetUrl = f.src + "";
                        if (grunt.file.exists(assetUrl)) {
                            var assetData = grunt.file.read(assetUrl);
                            assetUrl = assetUrl.substring(assetUrl.lastIndexOf('/'), assetUrl.length);
                            if (data.indexOf(assetUrl) >= 0) {
                                var reg = new RegExp('".*' + assetUrl + '.*"', 'g');
                                var fullAssetUrl = reg.exec(data).toString();
                                var assetName = null;
                                var _url = fullAssetUrl.substring(fullAssetUrl.indexOf(assetUrl), fullAssetUrl.length - 1);
                                if (fullAssetUrl.indexOf(".js") >= 0) {
                                    var _split = _url.split(".js");
                                    if (fullAssetUrl.indexOf("?v=") >= 0) {
                                        assetName = _split[0] + ".js" + _split[1].substring(0, 16);
                                    } else {
                                        assetName = _url.split(".js")[0] + ".js";
                                    }
                                } else if (fullAssetUrl.indexOf(".css") >= 0) {
                                    var _split = _url.split(".css");
                                    if (fullAssetUrl.indexOf("?v=") >= 0) {
                                        assetName = _split[0] + ".css" + _split[1].substring(0, 16);
                                    } else {
                                        assetName = _url.split(".css")[0] + ".css";
                                    }
                                }

                                var timestamp = (new Date()).valueOf() + "";

                                var newurl = getNewAssetsUrl(assetName, timestamp);

                                var newdata = data.replace(assetName, newurl);

                                if (grunt.file.write(fileSrc, newdata)) {
                                    grunt.log.success(fileSrc + ' add js or css version successfully');
                                }
                            } else {
                                //grunt.log.warn('asset not found in file ' + fileSrc);
                            }
                        } else {
                            //grunt.log.warn("file not found:" + assetUrl);
                        }
                    })

                })
            });
        }
    }

    grunt.registerMultiTask('automatic', 'The best Grunt plugin to add js or css version .', function () {
        var options = this.options({});

        var assetUrl = this.data.assetUrl;

        this.files.forEach(function (f) {
            var src = f.src.filter(function (filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    grunt.log.success('Source file "' + filepath + '" found.');
                    replaceAssets(filepath, assetUrl, options);
                    return true;
                }
            });
        });
    });

};
