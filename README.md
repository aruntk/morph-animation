# \<morph-animation\>

Element to element morphing using Polymer

For polymer 1.x see https://github.com/aruntk/morph-animation/tree/polymer1

# [Demo](https://aruntk.github.io/morph-animation/components/morph-animation/)


# Usage

```html
<link rel="import" href="bower_components/morph-animation/morph-animation.html">

<dom-module id="morph-animation">
  <template>
    <style>
:host {
  display: block;
}
    </style>
    <paper-icon-button icon="add" morph-target="#dialog" on-tap="morphThis"></paper-icon-button>
    <paper-dialog id="#dialog">
      <div>
        Contents
      </div>
    </paper-dialog>
  </template>
  </dom-module>
<script>
class MorphAnimation extends MorphMixin(Polymer.Element) {
  static get is() { return 'morph-animation'; }
  connectedCallback() {
    super.connectedCallback();
  }
};
window.customElements.define(MorphAnimation.is, MorphAnimation);
  </script>

```
