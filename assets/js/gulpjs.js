/**
 * gulpjs v1.0.0 - gulpjs is automation for app
 * @copyright 2015-2019 sahabuddinsgr <sahabuddinsgr@gmail.com>
 * @license MIT
 */
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function (window) {
  'use strict';

  var SpottedAI =
  /*#__PURE__*/
  function () {
    function SpottedAI(_ref) {
      var imgsArea = _ref.imgsArea;

      _classCallCheck(this, SpottedAI);

      this.imgsArea = imgsArea;
      this.modalMarkup(); // load modal markup first

      this.API_base = 'https://spotted.ai/echobase-web/rest/images/predicate/';
      this.imgs = document.querySelectorAll("".concat(this.imgsArea, " img"));
      this.loading = "<div class=\"lds-dual-ring\"></div>";
      this.popupWrap = document.querySelector('.mystery_popup');
      this.popupModal = document.querySelector('[data-popup-modal="masterylabel"]');
      this.modalCloseTrigger = document.querySelector('.popup-modal__close');
      this.bodyBlackout = document.querySelector('.body-blackout');
    }

    _createClass(SpottedAI, [{
      key: "modalMarkup",
      value: function modalMarkup() {
        document.body.innerHTML += "\n            <!-- Modals -->\n            <div class=\"popup-modal-container\" data-popup-modal=\"masterylabel\">\n                <i class=\"popup-modal__close\">x</i>\n                <div class=\"body-blackout\"></div>\n                <div class=\"popup-modal shadow\">\n                    <div class=\"mystery_popup\">\n                    </div>\n                </div>\n            </div>";
      }
    }, {
      key: "fetchData",
      value: function fetchData(imgUrl) {
        var _this = this;

        var url = this.API_base + encodeURIComponent(imgUrl);
        this.popupModal.classList.add('is--visible');
        this.bodyBlackout.classList.add('is-blacked-out');

        if (this.popupModal.classList.contains('is--visible')) {
          document.body.classList.add('mystery_popup_active');
        } // preloader


        this.popupWrap.innerHTML = this.loading;
        fetch(url, {
          method: 'GET',
          // mode: 'no-cors',
          cache: 'no-cache',
          credentials: 'omit',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          console.log('data', data);

          _this.loadInPopup(data);
        });
      }
    }, {
      key: "loadInPopup",
      value: function loadInPopup(data) {
        var attachment = data.messages[0].attachment;

        if (!attachment) {
          var html = "<p>".concat(data.messages[0].text, "</p>");
        } else {
          var photos = attachment.payload.elements;
          var html = photos.map(function (photo) {
            var buttons = photo.buttons,
                image_url = photo.image_url,
                title = photo.title;
            var link = buttons[0].url;
            return "<li><a href=\"".concat(link, "\" target=\"__blank\"><img src=\"").concat(image_url, "\" alt=\"").concat(title, "\" /></a></li>");
          }).join(' ');
        }

        this.popupWrap.innerHTML = "<ul>".concat(html, "</ul>");
      }
    }]);

    return SpottedAI;
  }();

  var init = function init() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$container = _ref2.container,
        container = _ref2$container === void 0 ? 'body' : _ref2$container;

    var imgsArea = 'body' === container ? container : "#".concat(container); // initiate

    var spotted = new SpottedAI({
      imgsArea: imgsArea
    }); // attach events to each images

    spotted.imgs.forEach(function (img) {
      var imgUrl = img.getAttribute('src'); // wrap each image with div

      var parent = img.parentNode;
      var wrapper = document.createElement('div');
      wrapper.classList.add("spot-img");
      parent.replaceChild(wrapper, img);
      wrapper.appendChild(img); // cusor pointer to each image

      wrapper.style.cursor = 'pointer'; // open popups on click

      wrapper.addEventListener('click', function (e) {
        e.preventDefault();
        spotted.fetchData(imgUrl);
      });
      spotted.modalCloseTrigger.addEventListener('click', function () {
        spotted.popupModal.classList.remove('is--visible');
        spotted.bodyBlackout.classList.remove('is-blacked-out');
        document.body.classList.remove('mystery_popup_active');
      });
      spotted.bodyBlackout.addEventListener('click', function () {
        spotted.popupModal.classList.remove('is--visible');
        spotted.bodyBlackout.classList.remove('is-blacked-out');
        document.body.classList.remove('mystery_popup_active');
      });
    });
  }; // init the library


  window.MysteryLabel = {
    init: init
  };
})(window);