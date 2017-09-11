window.MorphMixin = parent => class extends parent { // eslint-disable-line
  attachMorpher() {
    if (!this.morpher) {
      const morpher = document.createElement('div');
      this.set('morpher', morpher);
      morpher.style.position = 'fixed';
      morpher.style.display = 'none';
      morpher.style.zIndex = 103;
      const thisDom = this.shadowRoot;
      thisDom.appendChild(morpher);
    }
  }
  static get properties() {
    return {
      morphLife: {
        type: Number,
        value: 200,
      },
      morpher: Object,
    };
  }
  morphThis(e) {
    const trigger = e.currentTarget;
    const originFromDetail = e.detail ? e.detail.origin : null;
    const targetFromDetail = e.detail ? e.detail.target : null;
    const originSelector = trigger.getAttribute('morph-origin');
    const targetSelector = trigger.getAttribute('morph-target');
    const srqs = this.shadowRoot.querySelector.bind(this.shadowRoot);
    let origin = originSelector ? srqs(originSelector) : (originFromDetail || trigger);
    origin = this._resolveMorphGo(origin);
    let target = targetSelector ? srqs(targetSelector) : null;
    target = target ? this._resolveMorphGo(target) : targetFromDetail;
    if (origin && target) {
      const targetIsOverlayContent = (typeof target.open === 'function');
      const morphLife = trigger.getAttribute('morph-life') || 200;
      let overlay;
      if (targetIsOverlayContent) {
        overlay = target;
        this.morphLife = morphLife;
        this.morphTarget = target;
        this.morphOrigin = origin;
        this.morphTrigger = trigger;
      } else {
        const dropdown = document.createElement('iron-dropdown');
        Polymer.dom(dropdown).appendChild(target);
        Polymer.dom(this.root).appendChild(dropdown);
        overlay = dropdown;
        this.morphLife = morphLife;
        this.morphTarget = target;
        this.morphOrigin = origin;
        this.morphTrigger = trigger;
        const va = target.getAttribute('vertical-align');
        const ha = target.getAttribute('horizontal-align');
        const vo = target.getAttribute('vertical-offset');
        const ho = target.getAttribute('horizontal-offset');
        this._updateOverlayPosition(va, ha, vo, ho);
      }
      overlay.addEventListener('iron-overlay-opened', (event) => {
        if (event.target === target) {
          this._morphOpen();
        }
      });
      overlay.addEventListener('iron-overlay-closed', (event) => {
        if (event.target === target) {
          this._morphClose();
        }
      });
      overlay.open();
    } else {
      console.error('origin or target invalid.', trigger); // eslint-disable-line no-console
    }
  }
  _resolveMorphGo(el) {
    const selector = el.getAttribute('morph-go');
    if (selector) {
      const next = el.shadowRoot ? el.shadowRoot.querySelector(selector) : el.$(selector);
      return next ? this._resolveMorphGo(next) : el;
    }
    return el;
  }
  _updateOverlayPosition(va, ha, vo, ho) {
    if (this.morphTarget) {
      const d = this.morphTarget;
      d.verticalAlign = va;
      d.horizontalAlign = ha;
      d.verticalOffset = vo;
      d.horizontalOffset = ho;
    }
  }
  _morphOpen() {
    this.attachMorpher();
    const origin = this.morphOrigin;
    const target = this.morphTarget;
    const originRect = origin.getBoundingClientRect();
    const morpher = this.morpher;
    const ms = morpher.style;
    ms.display = 'block';
    ms.top = `${originRect.top}px`;
    ms.left = `${originRect.left}px`;
    ms.width = `${originRect.width}px`;
    ms.height = `${originRect.height}px`;
    ms.borderRadius = '50%';
    ms.backgroundColor = this._returnBG('origin');
    ms.backgroundColor = this._returnBG('origin'); // this is required because of some bizzare bug
    ms.transitionDuration = `${this.morphLife}ms`;
    origin.style.visibility = 'hidden';
    target.style.visibility = 'hidden';
    const targetRect = target.getBoundingClientRect();
    ms.top = `${targetRect.top}px`;
    ms.left = `${targetRect.left}px`;
    ms.width = `${targetRect.width}px`;
    ms.height = `${targetRect.height}px`;
    ms.borderRadius = '';
    ms.backgroundColor = this._returnBG('target');
    Polymer.Async.timeOut.run(() => {
      morpher.style.display = 'none';
      target.style.visibility = 'visible';
    }, this.morphLife);
  }
  _morphClose() {
    this.attachMorpher();
    const origin = this.morphOrigin;
    const morpher = this.morpher;
    const ms = morpher.style;
    morpher.style.display = 'block';
    Polymer.Async.timeOut.run(() => {
      const originRect = origin.getBoundingClientRect();
      ms.top = `${originRect.top}px`;
      ms.left = `${originRect.left}px`;
      ms.width = `${originRect.width}px`;
      ms.height = `${originRect.height}px`;
      ms.borderRadius = '50%';
      ms.backgroundColor = this._returnBG('origin');
      Polymer.Async.timeOut.run(() => {
        morpher.style.display = 'none';
        origin.style.visibility = 'visible';
      }, this.morphLife);
    });
  }
  _returnBG(type) {
    const el = type === 'origin' ? this.morphOrigin : this.morphTarget;
    const trigger = this.morphTrigger;
    const moc = trigger.getAttribute(`morph-${type}-color`);
    if (moc) {
      return moc;
    }
    const oBG = window.getComputedStyle(el, null).getPropertyValue('background-color');
    const o = oBG.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return parseFloat(o[3]) ? oBG : '#fff';
  }
};
