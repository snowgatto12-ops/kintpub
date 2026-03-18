(function () {
  'use strict';

  var repo = 'snowgatto12-ops/kintpub';
  var branch = 'main';
  var targetFile = 'test.js';
  var commitApi =
    'https://api.github.com/repos/' + repo + '/commits/' + branch + '?t=' + Date.now();

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
      var latestUrl =
        'https://raw.githubusercontent.com/' + repo + '/' + sha + '/' + targetFile + '?v=' + sha;
      loadScript(latestUrl);
    })
    .catch(function (error) {
      console.error('kintpub loader failed to resolve latest commit:', error);
      var branchUrl =
        'https://raw.githubusercontent.com/' +
        repo +
        '/' +
        branch +
        '/' +
        targetFile +
        '?v=' +
        Date.now();
      loadScript(branchUrl);
    });
})();
