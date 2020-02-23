---
layout: grid
title: Resume
permalink: /resume/
---
{% include construction.html %}

<div class="persp panel">
    <div class="label" onclick="Activate(this)">Experiences</div>
    <div class="label" onclick="Activate(this)">Relevant Coursework</div>
    <div class="label" onclick="Activate(this)">Skills</div>
    <div class="label" onclick="Activate(this)">Education</div>
</div>

<div id="start" class="window"
      style="opacity: 0;
             width: 100vw;
             height: 0vh;
             -webkit-transition: ease-in-out 1s;
             -moz-transition: ease-in-out 1s;
             -o-transition: ease-in-out 1s;
             transition: ease-in-out 1s;
             background-color: lightgray;">
</div>

<script>
  function MeasureToInt(str) {
    return parseInt(str.slice(0, -2))
  }

  function Flip(window) {
    var height = 100 - MeasureToInt(window.style.height);

    window.style.height = height + "vh";
    window.style.opacity = 1 - window.style.opacity;
  }

  function Activate(current) {
    var window = document.getElementsByClassName("window")[0];
    var newId  = current.innerHTML;

    Display(current);
    Flip(window);

    if (newId != window.id && window.id != "start") {
      Display(current);
      setTimeout(function(){ Flip(window);}, 1000);
    }

    window.id = newId;
  }
</script>
