(function() {
  "use strict";

  angular.module("mdApp", []);

  // Api
  angular.module("mdApp")
    .factory("MdApi", MdApi);

  function MdApi($http, $q) {
    var fn = {},
      baseUrl = 'https://gist.githubusercontent.com/ivillamil/e10ca31afcd136a5a7c7/raw/240a27e8c34b5bec7edfa19ee42efad909a85401/demo-users-db.json';

    fn.query = query;

    function query() {
      return $http.get(baseUrl);
    }

    return fn;
  }

  // Controller
  angular.module("mdApp")
    .controller('mdController', mdController);

  function mdController(MdApi) {
    var vm = this,
      $itemFloat,
      $itemSelected,
      $profile = document.querySelector('.profile'),
      $section = $profile.parentNode,
      $list = $section.querySelector('ul'),
      pos,
      contentSpeed = 50;

    vm.closeProfile = closeProfile;
    vm.showProfile = showProfile;
    vm.user = null;
    vm.users = [];

    MdApi.query()
      .then(function(response) {
        vm.users = response.data.users;
      });

    function closeProfile(e) {
      e.preventDefault();

      var $profile = document.querySelector('.profile'),
        $section = $profile.parentNode;

      _animateInfo(false)
        .then(function() {

          setTimeout(function() {
            $profile.classList.remove('show');
            $itemFloat.style.top = pos + 'px';
            $itemFloat.classList.remove('centered');
          }, contentSpeed * 2);

          setTimeout(function() {
            $itemSelected.style.opacity = 1;
          }, 500);

          setTimeout(function() {
            $section.removeChild($itemFloat);
          }, 600);
        });
    }

    function showProfile(e, i) {
      e.preventDefault();

      var $selectedItem = e.target.closest('a'),
        $floatingItem = document.createElement('div');

      pos = ($selectedItem.offsetTop - $list.scrollTop);

      $floatingItem.innerHTML = $selectedItem.innerHTML;
      $floatingItem.classList.add('floating-item');
      $floatingItem.style.height = $selectedItem.offsetHeight + 'px';
      $floatingItem.style.top = pos + 'px';
      $floatingItem.style['will-change'] = 'left, top';

      $section.appendChild($floatingItem);
      $itemFloat = $floatingItem;
      $itemSelected = $selectedItem;
      $selectedItem.style.opacity = 0;

      vm.user = vm.users[i];

      setTimeout(function() {
        var $imageWrapper = $floatingItem.querySelector('.imageWrapper');
        $profile.style.zIndex = 1;
        $profile.classList.add('show');
        $floatingItem.style.top = '50px';
        $floatingItem.classList.add('centered');
      }, 50);

      setTimeout(function() {
        _animateInfo(true);
      }, 600);

    }

    function _animateInfo(show) {
      return new Promise(function(resolve, reject) {
        var $contentItems = document.querySelectorAll('.profile li'),
          i = 0,
          length = $contentItems.length,
          arr = [];

        if (length === 0) return;

        for (i = 0; i < length; i++) {
          arr.push($contentItems[i]);
        }

        i = show ? 0 : length;
        arr.forEach(function(item) {
          var delay = (show ? i++ : i--) * contentSpeed;

          setTimeout(function() {
            if (show)
              item.classList.add('show');
            else
              item.classList.remove('show');

            hasFinished(delay);
          }, delay);
        });

        function hasFinished(d) {
          if (d === ((length - 1) * contentSpeed))
            resolve();
        }
      });
    }

  }
}());