'use strict'

class SliderController {
    constructor(options) {
        ({
            root: this.root, 
            isVertical: this.isVertical,
            useRange: this.useRange
        } = options)

        if(!this.isValidOptions) {
            throw new Error('not valid options');
        } else {
            this.view = new SliderView(this.root, options.handles, this.isVertical, this.useRange);
            this.model = new SliderModel(options);

            this.view.renderModel(this.model.cores);
            this.watchEvents();
        }
    }

    isValidOptions() {
        return true;
    }

    watchEvents() {
        this.view.sliderElem.onpointerdown = event => {
            event.preventDefault();
            let type = event.target.dataset.type
            if(type === 'bar' || type === 'range') this.onClick();
            if(type === 'handle') this.onMove(event);
        }
    }

    onClick() {
        let clickHandler = event => {
            const value = this.isVertical ? 
                            this.view.bar.getRelativeCoords(event, true).y
                            : this.view.bar.getRelativeCoords(event, true).x;
            this.requestModelChange('zzz', 'pcnt', value);
        }

        this.view.bar.elem.addEventListener('pointerup', clickHandler, {once: true})
    }

    onMove(startEvent) {
        const handleID = startEvent.target.dataset.id;
        const shift = this.view.handles[handleID].getDeltaToCenter(
            this.view.bar.getRelativeCoords(startEvent).x,
            this.view.bar.getRelativeCoords(startEvent).y
        )
        let moveHandler = event => {
            const value = this.isVertical ?
                            Math.min(100, Math.max(0, this.view.bar.getRelativeCoords(event).y + shift.y))
                            : Math.min(100, Math.max(0, this.view.bar.getRelativeCoords(event).x + shift.x));
            this.requestModelChange(handleID, 'pcnt', value);
        }

        document.addEventListener('pointermove', moveHandler);
        document.addEventListener('pointerup', () => {
            document.removeEventListener('pointermove', moveHandler)
        }, {once: true});
    }

    requestModelChange(id, type, value) {
        this.model.setValue(id, type, value)
            .then(cores => this.view.renderModel(cores)) // TODO render from here
    }
}

class SliderModel {
    constructor(options) {
        this.initCores(options.handles);
        this.mode = options.mode;
        this.step = options.step || 1;
        this.min = options.range[0];
        this.max = options.range[1];

    }

    initCores(handles) {
        this.cores = {};
        for(let id in handles) {
            this.cores[id] = {
                value: handles[id].value,
                pcnt: handles[id].value,
            }
        }
    }

    setValue(id, type, value) {
        if(this.mode === 'select') {
            if(type === 'pcnt') {
                let pcnt = value;
                let currentValue = this.cores[id].value;
                let requestedValue = (this.max - this.min) * value / 100;
                let permittedValue = this.calcNewValueByStep(currentValue, requestedValue);

                this.cores[id].value = permittedValue;
                this.cores[id].pcnt = pcnt;
            }
        }
        console.log(id, '=', this.cores[id].value, ':', this.cores[id].pcnt)
        return new Promise(resolve => {
            resolve(this.cores)
        })
    }

    calcNewValueByStep(currentValue, requestedValue) {
        const steps = Math.round((requestedValue - currentValue) / this.step);
        let newValue = currentValue + (this.step * steps);

        if(newValue < this.min) return this.min;
        if(newValue > this.max) return this.max;
        return newValue
    }
}
class SliderView {
    constructor(root, handles, isVertical, useRange) {
        this.root = root;
        this.isVertical = isVertical;
        this.useRange = useRange;

        this.createHandleInstances(handles);
        this.renderTamplate();

        this.test()
    }

    createHandleInstances(handles) {
        this.handles = {};
        for(let id in handles) {
            this.handles[id] = new Handle(
                handles[id].value, 
                ['slider__handle', 'js-slider-handle', `slider__handle_${id}`]
            );
            this.handles[id].elem.dataset.type = 'handle';
            this.handles[id].elem.dataset.id = id;
        }
    }

    renderTamplate() {
        this.sliderElem = document.createElement('div');
        this.sliderElem.classList.add('slider');
        this.isVertical 
        ? this.sliderElem.classList.add('slider_v', 'js-slider-v')
        : this.sliderElem.classList.add('slider_h', 'js-slider-h');


        this.bar = new Bar(['slider__bar', 'js-slider-bar']);
        this.bar.elem.dataset.type = 'bar'

        for(let handle in this.handles) {
            this.bar.elem.append(this.handles[handle].elem)
        }

        if(this.useRange) {
            this.range = new SelectedRange(['slider__range', 'js-slider-range']);
            this.range.elem.dataset.type = 'range'
            this.bar.elem.prepend(this.range.elem);
        }

        this.sliderElem.append(this.bar.elem);
        this.root.innerHTML = ''
        this.root.append(this.sliderElem);

    }

    renderModel(cores) {
        let swapArgs = arg => this.isVertical ? ['', arg] : [arg, ''];

        for(let id in cores) {this.handles[id].moveCenterTo(...swapArgs(cores[id].pcnt))}
    }

    test() {
    }
}

class SliderElement {
    constructor(classes) {
        this.elem = document.createElement('div');
        this.elem.classList.add(...classes)
    }

    getRelativeCoords(event, normalize) {
        let x = (event.pageX - (window.pageXOffset + this.elem.getBoundingClientRect().left) - this.elem.clientLeft) / this.elem.clientWidth * 100;
        let y = (event.pageY - (window.pageYOffset + this.elem.getBoundingClientRect().top) - this.elem.clientTop) / this.elem.clientHeight * 100;

        if(normalize) {
            x = Math.min(100, Math.max(0, x));
            y = Math.min(100, Math.max(0, y));
        }

        return {x, y};
    }
    
    getDeltaToCenter(x, y) {
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

    moveCenterTo(x, y) {
        const relativeMiddleX = this.elem.offsetWidth / this.elem.offsetParent.clientWidth * 100 / 2;
        const relativeMiddleY = this.elem.offsetHeight / this.elem.offsetParent.clientHeight * 100 / 2;

        const shift = {
            x: (x || x === 0) ? x - relativeMiddleX : '',
            y: (y || y === 0) ? y - relativeMiddleY : '',
        };

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
    constructor(initValue, classes) { 
        super(classes);
        this.initValue = initValue;
    }
}