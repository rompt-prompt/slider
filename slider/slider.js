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
            this.requestModelChange(undefined, 'pcnt', value);
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
            .then(cores => this.view.renderModel(cores))
    }
}

class SliderModel {
    constructor(options) {
        this.mode = options.mode;
        this.dataType = options.dataType;
        this.step = options.step || 1;
        this.min = options.range[0];
        this.max = options.range[1];
        this.neighborHandles = options.neighborHandles;
        this.initCores(options.handles);

    }

    initCores(handles) {
        this.cores = {};
        for(let id in handles) {
            this.cores[id] = {
                value: handles[id].value,
                pcnt: this.calcPcntFromValue(handles[id].value),
            }
        }
    }
    calcValueFromPcnt(pcnt) {
        if(this.dataType === 'number') return (this.max - this.min) * pcnt / 100;
    }

    calcPcntFromValue(value) {
        if(this.dataType === 'number') return value * 100 / (this.max - this.min);
    }

    getSortedCores() {
        return Object.entries(this.cores).sort((a, b) => {
            return a[1].pcnt > a[1].pcnt ? 1 : a[1].pcnt < b[1].pcnt ? -1 : 0});
    }

    getNeighbors(id, sortedCores) {
        const thisIndex = sortedCores.findIndex(element => element[0] === id);
        const prevIndex = thisIndex === 0 ? null : thisIndex - 1;
        const prevId = prevIndex === null ? null :  sortedCores[prevIndex][0];
        const nextIndex = thisIndex === sortedCores.length - 1 ? null : thisIndex + 1;
        const nextId = nextIndex === null ? null :  sortedCores[nextIndex][0];

        return {thisIndex, prevIndex, prevId, nextIndex, nextId}        
    }

    calcLimits(id) {
        const sortedCores = this.getSortedCores();
        const neighbors = this.getNeighbors(id, sortedCores);

        let min = neighbors.thisIndex !== 0 ? {
            value: sortedCores[neighbors.prevIndex][1].value,
            pcnt: sortedCores[neighbors.prevIndex][1].pcnt
        } : {value: this.min, pcnt: 0}

        let max = neighbors.thisIndex !== sortedCores.length - 1 ? {
            value: sortedCores[neighbors.nextIndex][1].value,
            pcnt: sortedCores[neighbors.nextIndex][1].pcnt
        } : {value: this.max, pcnt: 100}

        return {min, max}
    }

    inRange(value, min, max) {
        return Math.min(max, Math.max(min, value)) // TODO check others in view
    }

    calcCore(id, requestedValue, requestedPcnt, localLimits) {
        let value, pcnt;
        if(this.dataType === 'number') {
            const currentValue = this.cores[id].value;
            const currentPcnt = this.cores[id].pcnt;
            const steps = Math.round((requestedValue - currentValue) / this.step);

            switch(this.neighborHandles) {
                case 'jumpover':
                case 'move':
                    value = this.inRange(currentValue + (this.step * steps), this.min, this.max);
                    pcnt = this.inRange(requestedPcnt, 0, 100);
                    break;
                    
                case 'stop':
                    value = this.inRange(currentValue + (this.step * steps), localLimits.min.value, localLimits.max.value);
                    pcnt = this.inRange(requestedPcnt, localLimits.min.pcnt, localLimits.max.pcnt);
                    break;
            }

            if(this.neighborHandles === 'move') {
                const neighbors = this.getNeighbors(id, this.getSortedCores());

                switch(requestedPcnt < currentPcnt) {
                    case true:
                        if(requestedPcnt <= localLimits.min.pcnt && neighbors.prevId !== null) {
                            this.setValue(neighbors.prevId, 'pcnt', pcnt)}
                        break;
                    case false:
                        if(requestedPcnt >= localLimits.max.pcnt && neighbors.nextId !== null) {
                            this.setValue(neighbors.nextId, 'pcnt', pcnt)}
                        break;
                }
            }
        }

        return {value, pcnt}
    }

    getClosestId(pcnt) {
        const coresArr = Object.entries(this.cores);

        if(coresArr.length === 1) return coresArr[0][0];

        const closestCore = coresArr.reduce((prev, curr)  => 
            Math.abs(curr[1].pcnt - pcnt) < Math.abs(prev[1].pcnt - pcnt) ? curr : prev)

        return closestCore[0]
    }

    setValue(id, type, value) {
        if(id == undefined && type === 'pcnt') id = this.getClosestId(value);

        if(this.mode === 'select') {
            let requestedValue, requestedPcnt;
            switch (type) {
                case 'pcnt':
                    requestedPcnt = value;
                    requestedValue = this.calcValueFromPcnt(requestedPcnt);
                    break;
                case 'value':
                    requestedValue = value;
                    requestedPcnt = this.calcPcntFromValue(requestedValue);
            }
            const localLimits = this.calcLimits(id)
            const permittedCore = this.calcCore(id, requestedValue, requestedPcnt, localLimits);

            this.cores[id].value = permittedCore.value;
            this.cores[id].pcnt = permittedCore.pcnt;
        }
console.log(id, '= value: ', this.cores[id].value, ', pcnt:', this.cores[id].pcnt)
        return new Promise(resolve => {
            resolve(this.cores)
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

        for(let id in cores) {this.handles[id].moveCenterTo(...swapArgs(cores[id].pcnt))} // TODO check fool 0-100%
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