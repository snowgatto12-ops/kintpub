(function () {
  'use strict';

  var repo = 'snowgatto12-ops/kintpub';
  var branch = 'main';
  var targetFile = 'test_v2.js';
  var commitApi = 'https://api.github.com/repos/' + repo + '/commits/' + branch;
  var fallbackUrl = 'https://cdn.jsdelivr.net/gh/' + repo + '@' + branch + '/' + targetFile;

  function loadScript(url) {
    var script = document.createElement('script');
    script.src = url;
    script.defer = true;
    document.head.appendChild(script);
  }

  fetch(commitApi, { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Failed to get latest commit');
      }
      return response.json();
    })
    .then(function (data) {
      var sha = data && data.sha ? data.sha : '';
      if (!sha) {
        throw new Error('Commit SHA not found');
      }
      var latestUrl = 'https://cdn.jsdelivr.net/gh/' + repo + '@' + sha + '/' + targetFile;
      loadScript(latestUrl);
    })
    .catch(function () {
      loadScript(fallbackUrl);
    });
})();
