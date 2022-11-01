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

        this.view.renderModel(this.model.cores)
    }
}

class SliderModel {
    constructor() {
        this.cores = [
            {
                handleID: 1,
                abs: 70,
                pcnt: 45,
            }
        ]
    }
}
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

    renderModel(cores) {
        let swapArgs = arg => this.isVertical ? ['', arg] : [arg, ''];

        cores.forEach(core => {
            this.handle_1.moveCenterTo(...swapArgs(core.pcnt))
        });
    }

    test() {
        this.bar.elem.onclick = event => console.log('pos on bar: ', this.bar.getRelativeCoords(event));
        this.handle_1.elem.onclick = event => 
            this.handle_1.getCoordsShiftedToCenter(
                this.bar.getRelativeCoords(event).x, 
                this.bar.getRelativeCoords(event).y
                )
    }
}

class SliderElement {
    constructor(classes) {
        this.elem = document.createElement('div');
        this.elem.classList.add(...classes)
    }

    getRelativeCoords(event) {
        return {
            x: Math.min(1, Math.max(0,
                (event.pageX - (window.pageXOffset + this.elem.getBoundingClientRect().left) - this.elem.clientLeft) 
                / this.elem.clientWidth)) * 100,
            y: Math.min(1, Math.max(0,
                (event.pageY - (window.pageYOffset + this.elem.getBoundingClientRect().top) - this.elem.clientTop) 
                / this.elem.clientHeight)) * 100
        };
    }
    
    getCoordsShiftedToCenter(x, y) {
        let relCenterPositionX = (this.elem.offsetLeft + this.elem.offsetWidth /2) / this.elem.parentElement.clientWidth * 100;
        let relCenterPositionY = (this.elem.offsetTop + this.elem.offsetHeight /2) / this.elem.parentElement.clientHeight * 100;

        return {
            x: relCenterPositionX - x,
            y: relCenterPositionY - y,
        }
    }

    moveLeftEdgeTo(x, y) {
        if(x || x === 0) this.elem.style.left = x + '%';
        if(y || y === 0) this.elem.style.top = y + '%'
    }

    shiftToCenter(x, y) {
        const relativeMiddleX = this.elem.offsetWidth / this.elem.offsetParent.clientWidth * 100 / 2;
        const relativeMiddleY = this.elem.offsetHeight / this.elem.offsetParent.clientHeight * 100 / 2;

        return {
            x: (x || x === 0) ? x - relativeMiddleX : '',
            y: (y || y === 0) ? y - relativeMiddleY : '',
        }
    }

    moveCenterTo(x, y) {
        const shift = this.shiftToCenter(x, y);
        this.moveLeftEdgeTo(shift.x, shift.y);
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