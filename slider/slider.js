'use strict'

class SliderController {
    constructor(options) {
        ({
            root: this.root, 
            isVertical: this.isVertical,
            useRange: this.useRange
        } = options)

        this.createHandleInstances(options.handles)
        this.view = new SliderView(this.root, this.handles, this.isVertical, this.useRange);
        this.model = new SliderModel(this.handles);

        this.view.renderModel(this.model.cores)
    }

    isValidOptions() {
        return true;
    }

    createHandleInstances(handles) {
        if(!this.isValidOptions) {
            throw new Error('not valid options');
        } else {
            this.handles = {};
            for(let id in handles) {
                this.handles[id] = new Handle(
                    id, 
                    handles[id].pcnt, 
                    ['slider__handle', 'js-slider-handle', `slider__handle_${id}`]
                );
            }
        }
    }
}

class SliderModel {
    constructor(handles) {
        this.initCores(handles)

        // this.cores = [
        //     {
        //         handleID: 1,
        //         abs: 70,
        //         pcnt: 45,
        //     }
        // ]
    }

    initCores(handles) {
        this.cores = {};
        console.log(handles)
        for(let id in handles) {
            this.cores[id] = {
                handle: handles[id],
                pcnt: handles[id].pcnt
            }
        }
    }
}
class SliderView {
    constructor(root, handles, isVertical, useRange) {
        this.root = root;
        this.handles = handles;
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

        for(let handle in this.handles) {
            this.bar.elem.append(this.handles[handle].elem)
        }

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

        for(let id in cores) {
            cores[id].handle.moveCenterTo(...swapArgs(cores[id].pcnt))
        }
    }

    test() {
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
    constructor(id, pcnt, classes) { 
        super(classes);
        this.id = id;
        this.pcnt = pcnt;
    }
}