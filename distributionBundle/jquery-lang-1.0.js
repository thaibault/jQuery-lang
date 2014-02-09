// Generated by CoffeeScript 1.6.3
/*
[Project page](https://thaibault.github.com/jQuery-lang)

This plugin provided client side internationalisation support for websites.

Copyright Torben Sickert 16.12.2012

License
-------

This library written by Torben Sickert stand under a creative commons naming
3.0 unported license. see http://creativecommons.org/licenses/by/3.0/deed.de

Extending this module
---------------------

For conventions see require on https://github.com/thaibault/require

Author
------

t.sickert@gmail.com (Torben Sickert)

Version
-------

1.0 stable
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function($) {
    var Lang, _ref;
    Lang = (function(_super) {
      __extends(Lang, _super);

      function Lang() {
        _ref = Lang.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      /*
          This plugin holds all needed methods to extend a website for
          internationalisation.
      */


      /*
          **__name__ {String}**
          Holds the class name to provide inspection features.
      */


      Lang.prototype.__name__ = 'Lang';

      Lang.prototype.initialize = function(options, currentLanguage, knownLanguage, _$domNodeToFade, _numberOfFadedDomNodes, _replacements, _textNodesWithKnownLanguage) {
        var newLanguage,
          _this = this;
        if (options == null) {
          options = {};
        }
        this.currentLanguage = currentLanguage != null ? currentLanguage : '';
        this.knownLanguage = knownLanguage != null ? knownLanguage : {};
        this._$domNodeToFade = _$domNodeToFade != null ? _$domNodeToFade : null;
        this._numberOfFadedDomNodes = _numberOfFadedDomNodes != null ? _numberOfFadedDomNodes : 0;
        this._replacements = _replacements != null ? _replacements : [];
        this._textNodesWithKnownLanguage = _textNodesWithKnownLanguage != null ? _textNodesWithKnownLanguage : {};
        /*
            Initializes the plugin. Current language is set and later
            needed dom nodes are grabbed.
        
            **options {Object}** - An options object.
        
            **returns {$.Lang}** - Returns the current instance.
        */

        /*
            **_options {Object}**
            Saves default options for manipulating the Gui's behaviour.
        */

        this._options = {
          domNodeSelectorPrefix: 'body',
          "default": 'enUS',
          domNodeClassPrefix: '',
          templateDelimiter: {
            pre: '{{',
            post: '}}'
          },
          fadeEffect: true,
          textNodeParent: {
            fadeIn: {
              duration: 'fast'
            },
            fadeOut: {
              duration: 'fast'
            }
          },
          preReplacementLanguagePattern: '^\\|({1})$',
          replacementLanguagePattern: '^([a-z]{2}[A-Z]{2}):((.|\\s)*)$',
          currentLanguagePattern: '^[a-z]{2}[A-Z]{2}$',
          replacementDomNodeName: ['#comment', 'langreplacement'],
          replaceDomNodeNames: ['#text', 'langreplace'],
          toolsLockDescription: '{1}Switch',
          languageHashPrefix: 'lang-',
          currentLanguageIndicatorClassName: 'current',
          cookieDescription: '{1}Last',
          languageMapping: {
            deDE: ['de', 'de-de', 'german', 'deutsch'],
            enUS: ['en', 'en-us'],
            enEN: ['en-en', 'english'],
            frFR: ['fr', 'fr-fr', 'french']
          },
          onSwitched: $.noop(),
          onSwitch: $.noop(),
          domNode: {
            knownLanguage: 'div.toc'
          }
        };
        Lang.__super__.initialize.call(this, options);
        this._options.preReplacementLanguagePattern = this.stringFormat(this._options.preReplacementLanguagePattern, this._options.replacementLanguagePattern.substr(1, this._options.replacementLanguagePattern.length - 2));
        this._options.toolsLockDescription = this.stringFormat(this._options.toolsLockDescription, this.__name__);
        this._options.cookieDescription = this.stringFormat(this._options.cookieDescription, this.__name__);
        this.$domNodes = this.grabDomNode(this._options.domNode);
        this.$domNodes.switchLanguageButtons = $("a[href^=\"#" + this._options.languageHashPrefix + "\"]");
        this._movePreReplacementNodes();
        this.currentLanguage = this._normalizeLanguage(this._options["default"]);
        newLanguage = this._determineUsefulLanguage();
        if (this.currentLanguage === newLanguage) {
          this._switchCurrentLanguageIndicator(newLanguage);
        } else {
          this["switch"](newLanguage, true);
        }
        this.on(this.$domNodes.switchLanguageButtons, 'click', function(event) {
          event.preventDefault();
          return _this["switch"]($(event.target).attr('href').substr(_this._options.languageHashPrefix.length + 1));
        });
        return this;
      };

      Lang.prototype["switch"] = function(language, ensure) {
        var _this = this;
        if (ensure == null) {
          ensure = false;
        }
        /*
            Switches the current language to given language. This method is
            mutual synchronized.
        
            **language {String|Boolean}** - New language as string or
                                            "true". If set to "true" it
                                            indicates that the dom tree
                                            should be checked again current
                                            language to ensure every text
                                            node has right content.
        
            **ensure {Boolean}**          - Indicates if a switch effect
                                            should be avoided.
        
            **returns {$.Lang}**  - Returns the current instance.
        */

        this.acquireLock(this._options.toolsLockDescription, function() {
          var $lastLanguageDomNode, $lastTextNodeToTranslate, actionDescription, _ref1;
          if (language === true) {
            ensure = true;
            language = _this.currentLanguage;
          } else {
            language = _this._normalizeLanguage(language);
          }
          if (ensure && language !== _this._options["default"] || _this.currentLanguage !== language) {
            actionDescription = 'Switch to';
            if (ensure) {
              actionDescription = 'Ensure';
            }
            _this.debug('{1} "{2}".', actionDescription, language);
            _this._switchCurrentLanguageIndicator(language);
            _this.fireEvent('switch', true, _this, _this.currentLanguage, language);
            _this._$domNodeToFade = null;
            _this._replacements = [];
            _ref1 = _this._collectTextNodesToReplace(language, ensure), $lastTextNodeToTranslate = _ref1[0], $lastLanguageDomNode = _ref1[1];
            _this._checkLastTextNodeHavingLanguageIndicator($lastTextNodeToTranslate, $lastLanguageDomNode, ensure);
            return _this._handleSwitchEffect(language, ensure);
          } else {
            _this.debug('"{1}" is already current selected language.', language);
            return _this.releaseLock(_this._options.toolsLockDescription);
          }
        });
        return this;
      };

      Lang.prototype.refresh = function() {
        /*
            Ensures current selected language.
        
            **returns {$.Lang}** - Returns the current instance.
        */

        return this._movePreReplacementNodes()["switch"](true);
      };

      Lang.prototype._movePreReplacementNodes = function() {
        /*
            Moves pre replacement dom nodes into next dom node behind
            translation text to use the same translation algorithm for
            both.
        
            **returns {$.Lang}** - Returns the current instance.
        */

        var self;
        self = this;
        this.$domNodes.parent.find(':not(iframe)').contents().each(function() {
          var $this, match, nodeName, regex, selfFound;
          nodeName = this.nodeName.toLowerCase();
          if ($.inArray(nodeName, self._options.replacementDomNodeName) !== -1) {
            if ($.inArray(nodeName, ['#comment', '#text']) === -1) {
              $(this).hide();
            }
            regex = new RegExp(self._options.preReplacementLanguagePattern);
            match = this.textContent.match(regex);
            if (match && match[0]) {
              this.textContent = this.textContent.replace(regex, match[1]);
              $this = $(this);
              selfFound = false;
              return $this.parent().contents().each(function() {
                if (selfFound && $.trim($(this).text())) {
                  $this.appendTo(this);
                  return false;
                }
                if ($this[0] === this) {
                  selfFound = true;
                }
                return true;
              });
            }
          }
        });
        return this;
      };

      Lang.prototype._collectTextNodesToReplace = function(language, ensure) {
        /*
            Normalizes a given language string.
        
            **language {String}**   - New language.
        
            **ensure {Boolean}**    - Indicates if the whole dom should be
                                      checked again current language to
                                      ensure every text node has right
                                      content.
        
            **returns {domNode[]}** - Return a tuple of last text and
                                      language dom node to translate.
        */

        var $currentLanguageDomNode, $currentTextNodeToTranslate, $lastLanguageDomNode, $lastTextNodeToTranslate, self;
        $currentTextNodeToTranslate = null;
        $currentLanguageDomNode = null;
        $lastTextNodeToTranslate = null;
        $lastLanguageDomNode = null;
        this.knownLanguage = {};
        self = this;
        this.$domNodes.parent.find(':not(iframe)').contents().each(function() {
          var $currentDomNode, match, nodeName;
          $currentDomNode = $(this);
          nodeName = this.nodeName.toLowerCase();
          if ($.inArray(nodeName.toLowerCase(), self._options.replaceDomNodeNames) !== -1) {
            if ($.trim($currentDomNode.text()) && $currentDomNode.parents(self._options.replaceDomNodeNames.join()).length === 0) {
              $lastLanguageDomNode = self._checkLastTextNodeHavingLanguageIndicator($lastTextNodeToTranslate, $lastLanguageDomNode, ensure);
              $currentTextNodeToTranslate = $currentDomNode;
            }
          } else if ($currentTextNodeToTranslate != null) {
            if ($.inArray(nodeName, self._options.replacementDomNodeName) !== -1) {
              match = this.textContent.match(new RegExp(self._options.replacementLanguagePattern));
              if (match && match[1] === language) {
                self.knownLanguage[$.trim($currentTextNodeToTranslate.text())] = $.trim(match[2]);
                self._registerTextNodeToChange($currentTextNodeToTranslate, $currentDomNode, match, $currentLanguageDomNode);
                $lastTextNodeToTranslate = $currentTextNodeToTranslate;
                $lastLanguageDomNode = $currentLanguageDomNode;
                $currentTextNodeToTranslate = null;
                $currentLanguageDomNode = null;
              } else if (this.textContent.match(new RegExp(self._options.currentLanguagePattern))) {
                $currentLanguageDomNode = $currentDomNode;
              }
              return true;
            }
            $lastTextNodeToTranslate = null;
            $lastLanguageDomNode = null;
            $currentTextNodeToTranslate = null;
            $currentLanguageDomNode = null;
          }
          return true;
        });
        this._registerKnownTextNodes();
        return [$lastTextNodeToTranslate, $lastLanguageDomNode];
      };

      Lang.prototype._registerKnownTextNodes = function() {
        /*
            Iterates all text nodes in language known area with known
            translations.
        
            **returns {$.Lang}**  - Returns the current instance.
        */

        var self;
        this._textNodesWithKnownLanguage = {};
        self = this;
        this.$domNodes.knownLanguage.find(':not(iframe)').contents().each(function() {
          var $currentDomNode;
          $currentDomNode = $(this);
          if ($.inArray(this.nodeName.toLowerCase(), self._options.replaceDomNodeNames) !== -1 && $.trim($currentDomNode.text()) && $currentDomNode.parents(self._options.replaceDomNodeNames.join()).length === 0 && (self.knownLanguage[$.trim(this.textContent)] != null)) {
            self._textNodesWithKnownLanguage;
            if ((self._textNodesWithKnownLanguage[self.knownLanguage[$.trim(this.textContent)]] != null)) {
              return self._textNodesWithKnownLanguage[self.knownLanguage[$.trim(this.textContent)]].push(this);
            } else {
              return self._textNodesWithKnownLanguage[self.knownLanguage[$.trim(this.textContent)]] = [this];
            }
          }
        });
        return this;
      };

      Lang.prototype._normalizeLanguage = function(language) {
        /*
            Normalizes a given language string.
        
            **language {String}** - New language.
        
            *returns {String}**   - Returns the normalized version of given
                                    language.
        */

        var key, value, _ref1;
        _ref1 = this._options.languageMapping;
        for (key in _ref1) {
          value = _ref1[key];
          if ($.inArray(key.toLowerCase(), value) === -1) {
            value.push(key.toLowerCase());
          }
          if ($.inArray(language.toLowerCase(), value) !== -1) {
            return key.substring(0, 2) + key.substring(2);
          }
        }
        return this._options["default"];
      };

      Lang.prototype._determineUsefulLanguage = function() {
        /*
            Determines a useful initial language depending on cookie and
            browser settings.
        
            **returns {String}** - Returns the determined language.
        */

        var result;
        if ($.cookie(this._options.cookieDescription) != null) {
          this.debug('Determine "{1}", because of cookie information.', $.cookie(this._options.cookieDescription));
          result = $.cookie(this._options.cookieDescription);
        } else if (navigator.language != null) {
          $.cookie(this._options.cookieDescription, navigator.language);
          this.debug('Determine "{1}", because of browser settings.', $.cookie(this._options.cookieDescription));
          result = navigator.language;
        } else {
          $.cookie(this._options.cookieDescription, this._options["default"]);
          this.debug('Determine "{1}", because of default option.', $.cookie(this._options.cookieDescription));
          result = this._options["default"];
        }
        return this._normalizeLanguage(result);
      };

      Lang.prototype._handleSwitchEffect = function(language, ensure) {
        /*
            Depending an activated switching effect this method initialized
            the effect of replace all text string directly.
        
            **language {String}** - New language.
        
            **ensure {Boolean}**  - Indicates if current language should be
                                    ensured again every text node content.
        
            **returns {$.Lang}**  - Returns the current instance.
        */

        if (!ensure && this._options.fadeEffect && (this._$domNodeToFade != null)) {
          this._options.textNodeParent.fadeOut.always = this.getMethod(this._handleLanguageSwitching, this, language, ensure);
          this._$domNodeToFade.fadeOut(this._options.textNodeParent.fadeOut);
        } else {
          this._handleLanguageSwitching(this._handleLanguageSwitching, this, language, ensure);
        }
        return this;
      };

      Lang.prototype._registerTextNodeToChange = function($currentTextNodeToTranslate, $currentDomNode, match, $currentLanguageDomNode) {
        /*
            Registers a text node to change its content with given
            replacement.
        
            **$currentTextNodeToTranslate {$}**  - Text node with content
                                                   to translate.
        
            **$currentDomNode {$}**              - A comment node with
                                                   replacement content.
        
            **match {String[]}**                 - A matching array of
                                                   replacement's text
                                                   content.
        
            **$currentLanguageDomNode {$|null}** - A potential given text
                                                   node indicating the
                                                   language of given text
                                                   node.
        
            **returns {$.Lang}**                 - Returns the current
                                                   instance.
        */

        var $parent;
        $parent = $currentTextNodeToTranslate.parent();
        if (this._$domNodeToFade === null) {
          this._$domNodeToFade = $parent;
        } else {
          this._$domNodeToFade = this._$domNodeToFade.add($parent);
        }
        if ($currentDomNode != null) {
          this._replacements.push({
            $textNodeToTranslate: $currentTextNodeToTranslate,
            $nodeToReplace: $currentDomNode,
            textToReplace: match[2],
            $parent: $parent,
            $currentLanguageDomNode: $currentLanguageDomNode
          });
        }
        return this;
      };

      Lang.prototype._checkLastTextNodeHavingLanguageIndicator = function($lastTextNodeToTranslate, $lastLanguageDomNode, ensure) {
        /*
            Checks if last text has a language indication comment node.
            This function is called after each parsed dom text node.
        
            **$lastTextNodeToTranslate {$|null}** - Last text to node to
                                                    check.
        
            **$lastLanguageDomNode {$|null}**     - A potential given
                                                    language indication
                                                    commend node.
        
            **ensure {Boolean}**                  - Indicates if current
                                                    language should be
                                                    ensured again every
                                                    text node content.
        
            **returns {$}**                       - Returns the retrieved
                                                    or newly created
                                                    language indicating
                                                    comment node.
        */

        var currentLocalLanguage;
        if (($lastTextNodeToTranslate != null) && ($lastLanguageDomNode == null)) {
          currentLocalLanguage = this.currentLanguage;
          if (ensure) {
            currentLocalLanguage = this._options["default"];
          }
          $lastLanguageDomNode = $("<!--" + currentLocalLanguage + "-->");
          $lastTextNodeToTranslate.after($lastLanguageDomNode);
        }
        return $lastLanguageDomNode;
      };

      Lang.prototype._handleLanguageSwitching = function(thisFunction, self, language, ensure) {
        /*
            Initialized the language switch and performs an effect if
            specified.
        
            **thisFunction {Function}** - The function itself.
        
            **self {$.Lang}**           - The current instance.
        
            **language {String}**       - The new language to switch to.
        
            **ensure {Boolean}**        - Indicates if current language
                                          should be ensured again every
                                          text node content.
        
            **returns {$.Lang}**        - Returns the current instance.
        */

        var oldLanguage,
          _this = this;
        this._numberOfFadedDomNodes += 1;
        oldLanguage = this.currentLanguage;
        if (!ensure && this._options.fadeEffect && (this._$domNodeToFade != null)) {
          if (this._numberOfFadedDomNodes === this._$domNodeToFade.length) {
            this._switchLanguage(language);
            this._numberOfFadedDomNodes = 0;
            this._options.textNodeParent.fadeIn.always = function() {
              _this._numberOfFadedDomNodes += 1;
              if (_this._numberOfFadedDomNodes === _this._$domNodeToFade.length) {
                _this._numberOfFadedDomNodes = 0;
                _this.fireEvent('switched', true, _this, oldLanguage, language);
                return _this.releaseLock(_this._options.toolsLockDescription);
              }
            };
            this._$domNodeToFade.fadeIn(this._options.textNodeParent.fadeIn);
          }
        } else {
          this._switchLanguage(language);
          this._numberOfFadedDomNodes = 0;
          this.fireEvent('switched', true, this, oldLanguage, language);
          this.releaseLock(this._options.toolsLockDescription);
        }
        return this;
      };

      Lang.prototype._switchLanguage = function(language) {
        /*
            Performs the low level text replacements for switching to given
            language.
        
            **language {String}** - The new language to switch to.
        
            **returns {$.Lang}**  - Returns the current instance.
        */

        var currentDomNodeFound, currentText, nodeName, replacement, trimmedText, _i, _len, _ref1;
        _ref1 = this._replacements;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          replacement = _ref1[_i];
          currentText = replacement.$textNodeToTranslate.html();
          if (replacement.$textNodeToTranslate[0].nodeName === '#text') {
            currentText = replacement.$textNodeToTranslate[0].textContent;
          }
          trimmedText = $.trim(currentText);
          if (!this._options.templateDelimiter || trimmedText.substr(-this._options.templateDelimiter.post.length) !== this._options.templateDelimiter.post && this._options.templateDelimiter.post) {
            if (replacement.$currentLanguageDomNode == null) {
              currentDomNodeFound = false;
              replacement.$textNodeToTranslate.parent().contents().each(function() {
                if (currentDomNodeFound) {
                  replacement.$currentLanguageDomNode = $(this);
                  return false;
                }
                if (this === replacement.$textNodeToTranslate[0]) {
                  currentDomNodeFound = true;
                }
                return true;
              });
            }
            if (language === replacement.$currentLanguageDomNode[0].textContent) {
              throw Error(("Text node \"" + replacement.textToReplace + "\" is ") + 'marked as "' + replacement.$currentLanguageDomNode[0].textContent + '" and has same translation language as it already ' + 'is.');
            }
            nodeName = replacement.$nodeToReplace[0].nodeName.toLowerCase();
            if (nodeName === '#comment') {
              replacement.$textNodeToTranslate.after($("<!--" + replacement.$currentLanguageDomNode[0].textContent + (":" + currentText + "-->")));
            } else {
              replacement.$textNodeToTranslate.after($(("<" + nodeName + ">") + replacement.$currentLanguageDomNode[0].textContent + (":" + currentText + "</" + nodeName + ">")).hide());
            }
            replacement.$textNodeToTranslate.after($("<!--" + language + "-->"));
            if (replacement.$textNodeToTranslate[0].nodeName === '#text') {
              replacement.$textNodeToTranslate[0].textContent = replacement.textToReplace;
            } else {
              replacement.$textNodeToTranslate.html(replacement.textToReplace);
            }
            replacement.$currentLanguageDomNode.remove();
            replacement.$nodeToReplace.remove();
          }
        }
        $.each(this._textNodesWithKnownLanguage, function(key, value) {
          return $.each(value, function(subKey, value) {
            return value.textContent = key;
          });
        });
        $.cookie(this._options.cookieDescription, language);
        this.currentLanguage = language;
        return this;
      };

      Lang.prototype._switchCurrentLanguageIndicator = function(language) {
        /*
            Switches the current language indicator in language switch
            triggered dom nodes.
        
            **language {String}** - The new language to switch to.
        
            **returns {$.Lang}**  - Returns the current instance.
        */

        $(("a[href^=\"#" + this._options.languageHashPrefix) + ("" + this.currentLanguage + "\"].") + this._options.currentLanguageIndicatorClassName).removeClass(this._options.currentLanguageIndicatorClassName);
        $("a[href=\"#" + this._options.languageHashPrefix + language + "\"]").addClass(this._options.currentLanguageIndicatorClassName);
        return this;
      };

      return Lang;

    })($.Tools["class"]);
    $.Lang = function() {
      return $.Tools().controller(Lang, arguments);
    };
    return $.Lang["class"] = Lang;
  })(this.jQuery);

}).call(this);
