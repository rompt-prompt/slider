'use strict'

class SliderController {
    constructor(options) {
        ({
            root: this.root, 
            isVertical: this.isVertical,
        } = options)

        this.view = new SliderView(this.root, this.isVertical);
        this.model = new SliderModel();
    }
}

class SliderModel {}
class SliderView {
    constructor(root, isVertical) {
        this.root = root;
        this.isVertical = isVertical;
        this.renderTamplate();
    }

    renderTamplate() {
        this.sliderElem = document.createElement('div');
        this.sliderElem.classList.add('slider');
        this.isVertical 
        ? this.sliderElem.classList.add('slider_v', 'js-slider-v')
        : this.sliderElem.classList.add('slider_h', 'js-slider-h');


        this.bar = new Bar(['slider__bar', 'js-slider-bar']);
        this.handle_1 = new Handle(['slider__handle', 'js-slider-handle', 'slider__handle_1']);
        this.bar.elem.append(this.handle_1.elem);

        this.sliderElem.append(this.bar.elem);
        this.root.innerHTML = ''
        this.root.append(this.sliderElem);

    }
}

class SliderElement {
    constructor(classes) {
        this.elem = document.createElement('div');
        this.elem.classList.add(...classes)
    }
}

class Bar extends SliderElement {
    constructor(classes) {
        super(classes);
    }
}
class Handle extends SliderElement {
    constructor(classes) { 
        super(classes);
    }
}