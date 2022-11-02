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
            this.model = new SliderModel(options.handles);

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
                            this.view.bar.getRelativeCoords(event).y
                            : this.view.bar.getRelativeCoords(event).x;
            this.requestModelChange('zzz', 'pcnt', value).then(cores => this.view.renderModel(cores))
        }

        this.view.bar.elem.addEventListener('pointerup', clickHandler, {once: true})
    }

    onMove(startEvent) {
        const handleID = startEvent.target.dataset.id;
        const shift = this.view.handles[handleID].getCoordsShiftedToCenter(
            this.view.bar.getRelativeCoords(startEvent).x,
            this.view.bar.getRelativeCoords(startEvent).y
        )

        let moveHandler = event => {
            const value = this.isVertical ?
                            this.view.bar.getRelativeCoords(event).y + shift.y
                            : this.view.bar.getRelativeCoords(event).x + shift.x;
            
            this.requestModelChange(handleID, 'pcnt', value).then(cores => {
                console.log(cores)
                this.view.renderModel(cores)
            })
        }

        document.addEventListener('pointermove', moveHandler);
        document.addEventListener('pointerup', () => {
            document.removeEventListener('pointermove', moveHandler)
        }, {once: true});
    }

    requestModelChange(id, type, value) {
        return this.model.dummySetNewValue(id, type, value)
    }
}

class SliderModel {
    constructor(handles) {
        this.initCores(handles)
    }

    initCores(handles) {
        this.cores = {};
        for(let id in handles) {
            this.cores[id] = {
                value: handles[id].value,
                pcnt: this.getPcntFromValue(handles[id].value),
            }
        }
    }

    getPcntFromValue(value) {
        return value;
    }

    dummySetNewValue(id, type, value) {
        return new Promise(resolve=> {
            let cores = {
                [id]: {
                    pcnt: value
                }
            }
            resolve(cores)
        })
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
    constructor(initValue, classes) { 
        super(classes);
        this.initValue = initValue;
    }
}