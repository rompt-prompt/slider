'use strict'

class SliderController {
    constructor(options) {
        ({
            root: this.root, 
            isVertical: this.isVertical,
            useRange: this.useRange
        } = options)

        this.view = new SliderView(this.root, this.isVertical, this.useRange);
        this.model = new SliderModel();
    }
}

class SliderModel {}
class SliderView {
    constructor(root, isVertical, useRange) {
        this.root = root;
        this.isVertical = isVertical;
        this.useRange = useRange;
        this.renderTamplate();

        this.test()
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

        if(this.useRange) {
            this.range = new SelectedRange(['slider__range', 'js-slider-range']);
            this.bar.elem.prepend(this.range.elem);
        }

        this.sliderElem.append(this.bar.elem);
        this.root.innerHTML = ''
        this.root.append(this.sliderElem);

    }

    test() {
        this.bar.elem.onclick = event => console.log('pos on bar: ', this.bar.getRelativePosition(event));
        this.handle_1.elem.onclick = event => console.log('handle', this.handle_1.getCenterOffset(event))
    }
}

class SliderElement {
    constructor(classes) {
        this.elem = document.createElement('div');
        this.elem.classList.add(...classes)
    }

    getRelativePosition(event) {
        return {
            x: Math.min(1, Math.max(0,
                (event.pageX - (window.pageXOffset + this.elem.getBoundingClientRect().left) - this.elem.clientLeft) 
                / this.elem.clientWidth)) * 100,
            y: Math.min(1, Math.max(0,
                (event.pageY - (window.pageYOffset + this.elem.getBoundingClientRect().top) - this.elem.clientTop) 
                / this.elem.clientHeight)) * 100
        };
    }

    moveLeftEdgeTo(x, y) {
        if(x) this.elem.style.left = x + '%';
        if(y) this.elem.style.top = y + '%'
    }

    moveCenterTo(x, y) {
        const relativeMiddleX = this.elem.offsetWidth / this.elem.offsetParent.clientWidth * 100 / 2;
        const relativeMiddleY = this.elem.offsetHeight / this.elem.offsetParent.clientHeight * 100 / 2;

        if(x) this.elem.style.left = x - relativeMiddleX + '%';
        if(y) this.elem.style.top = y - relativeMiddleY + '%'
    }
}

class Bar extends SliderElement {
    constructor(classes) {
        super(classes);
    }
}

class SelectedRange extends SliderElement {
    constructor(classes) {
        super(classes);
    }

    moveCenterTo(x, y) {
        throw new Error('method moveCenterTo is not allowed for range');
    }

    setRelativeSize(width, height) {
        if(height) this.elem.style.height = height + '%'
        if(width) this.elem.style.width = width + '%';
    }
}

class Handle extends SliderElement {
    constructor(classes) { 
        super(classes);
    }
}