ko.bindingHandlers.animation = {
  init: function(element, valueAccessor) {
    let options = ko.unwrap(valueAccessor()) || [],
      // Build a master timeline so we can add to it. Paused by default.
      masterTimeline = new TimelineMax({ paused: true });

    // Add Timeline label so everything starts at the same time.
    masterTimeline.add("startAnimation");

    // Functions to build the animation timelines
    function slideTimline(animations, elem) {
      console.log(elem.children);
      let slideOptions = animations || [],
        animOptions = slideOptions.options || [],
        elemWidth = elem.offsetWidth,
        items = slideOptions.items != undefined
          ? elem.querySelectorAll(slideOptions.items)
          : elem.children,
        //Animation Options
        animSpeed = animOptions.speed || 1,
        animStagger = animOptions.stagger || 0.5,
        animOffset = animOptions.offset || elemWidth,
        animDirection = animOptions.reverse ? animOffset * -1 : animOffset,
        animEase = animOptions.ease || "",
        animFade = animOptions.fade ? 0 : 1,
        animAlternate = animOptions.alternate || false;

      let tl = new TimelineMax();

      // Alllow for alternating animation
      if (animAlternate) {
        for (var i = 0; i < items.length; i++) {
          if (i % 2 == 0) {
            tl.set(items[i], { x: animDirection * -1, opacity: animFade });
          } else {
            tl.set(items[i], { x: animDirection, opacity: animFade });
          }
        }
      } else {
        tl.set(items, { x: animDirection, opacity: animFade });
      }

      tl.staggerTo(
        items,
        animSpeed,
        { x: 0, opacity: 1, ease: animEase },
        animStagger
      );

      return tl;
    }

    function fadeTimeline(animations, elem) {
      let fadeInOptions = animations || [],
        animOptions = fadeInOptions.options || [],
        items = fadeInOptions.items != undefined
          ? elem.querySelectorAll(fadeInOptions.items)
          : elem.children,
        //Animation Options
        animSpeed = animOptions.speed || 1,
        animStagger = animOptions.stagger || 0.5,
        animEase = animOptions.ease || "",
        animFadeStart = animOptions.fadeStart || 0,
        animFadeEnd = animOptions.fadeEnd || 1,
        animReverse = animOptions.reverse || false; // curently does nothing

      //Start a new timeline
      let tl = new TimelineMax();

      tl.set(items, { opacity: animFadeStart });

      if (animReverse == true) {
        items = Array.prototype.slice.call(items, 0).reverse();
      }

      tl.staggerTo(
        items,
        animSpeed,
        { opacity: animFadeEnd, ease: animEase },
        animStagger
      );

      return tl;
    }

    function dropTimeline(animations, elem) {
      let dropOptions = animations || [],
        animOptions = dropOptions.options || [],
        elemHeight = elem.offsetHeight,
        items = dropOptions.items != undefined
          ? elem.querySelectorAll(dropOptions.items)
          : elem.children,
        //Animation Options
        animSpeed = animOptions.speed || 1,
        animStagger = animOptions.stagger || 0.5,
        animOffset = animOptions.offset || elemHeight,
        animDirection = animOptions.reverse ? animOffset * -1 : animOffset,
        animEase = animOptions.ease || "",
        animFade = animOptions.fade ? 0 : 1,
        animAlternate = animOptions.alternate || false;

      //Start a new timeline
      let tl = new TimelineMax();

      // Alllow for alternating animation
      if (animAlternate) {
        for (var i = 0; i < items.length; i++) {
          if (i % 2 == 0) {
            tl.set(items[i], { y: animDirection * -1, opacity: animFade });
          } else {
            tl.set(items[i], { y: animDirection, opacity: animFade });
          }
        }
      } else {
        tl.set(items, { y: animDirection, opacity: animFade });
      }

      tl.staggerTo(
        items,
        animSpeed,
        { y: 0, opacity: 1, ease: animEase },
        animStagger
      );

      return tl;
    }

    function rotateTimeline(animations, elem) {
      let rotateOptions = animations || [],
        animOptions = rotateOptions.options || [],
        items = rotateOptions.items != undefined
          ? elem.querySelectorAll(rotateOptions.items)
          : elem.children,
        //Animation Options
        animSpeed = animOptions.speed || 1,
        animStagger = !animOptions.stagger || animOptions.stagger !== 0
          ? animOptions.stagger
          : 0.5,
        animEase = animOptions.ease || "",
        animRotation = animOptions.rotation || 360,
        animRepeat = animOptions.repeat || 0,
        animYoyo = animOptions.yoyo || false;

      //Start a new timeline
      let tl = new TimelineMax();

      tl.staggerTo(
        items,
        animSpeed,
        {
          rotation: animRotation,
          repeat: animRepeat,
          yoyo: animYoyo,
          ease: animEase
        },
        animStagger
      );

      return tl;
    }
    
    function wiggleTimeline(animations, elem) {
      let rotateOptions = animations || [],
        animOptions = rotateOptions.options || [],
        items = rotateOptions.items != undefined
          ? elem.querySelectorAll(rotateOptions.items)
          : elem.children,
        //Animation Options
        animSpeed = animOptions.speed || 1,
        animStagger = !animOptions.stagger || animOptions.stagger !== 0
          ? animOptions.stagger
          : 0.5,
        animRepeat = animOptions.repeat || 0;
      
      //Start a new timeline
      let tl = new TimelineMax();
      
      tl.to(
        items,
        animSpeed,
        {
          rotation: random(),
          repeat: 10,
          yoyo: true
        }
      );
      
      return tl;
    }


    // Loop through the animations and add them to the timeline
    Object.keys(options).forEach(function(key, index) {
      let delay = "startAnimation+=" + options[key].delay || 0;

      switch (key) {
        case "slideIn":
          masterTimeline.add(slideTimline(options[key], element), delay);
          break;
        case "fadeIn":
          masterTimeline.add(fadeTimeline(options[key], element), delay);
          break;
        case "dropIn":
          masterTimeline.add(dropTimeline(options[key], element), delay);
          break;
        case "rotate":
          masterTimeline.add(rotateTimeline(options[key], element), delay);
          break;
        case "wiggle":
          masterTimeline.add(wiggleTimeline(options[key], element), delay);
          break;
      }
    });

    //This triggers all the animations, should be triggered by an event
    masterTimeline.play();
  }
};

ko.applyBindings();