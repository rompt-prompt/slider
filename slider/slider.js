'use strict'

class SliderController {
    constructor(options) {
        this.init(options)
    }

    isValidOptions(options) {
        let errors = '';

        checkRequired('Root', options.root)
        checkMode();
        checkDataType();
        checkRange();
        checkStep();
        checkHandles();
        checkIsVertical();
        checkNeighborHandles();
        checkRanges();
        checkTags();

        function checkMode() {
            if(checkRequired('Mode', options.mode)) {
                if(!['select'].includes(options.mode)) errors += `\n>>> Incorrect mode. Specified <${options.mode}>`;
            };
        }
        function checkDataType() {
            if(checkRequired('DataType', options.dataType)) {
                if(!['number'].includes(options.dataType)) errors += `\n>>> Incorrect dataType. Specified <${options.dataType}>`;
            };
        }
        function checkRange() {
            if(checkRequired('Range', options.range)) {
                switch(options.dataType) {
                    case 'number':
                        if(options.range.length !== 2) {
                            errors += `\n>>> With datatype 'number' required array with only 2 values: ['start', 'end'].`; 
                            break;
                        }
                        if(options.range[0] >= options.range[1]) {
                            errors += `\n>>> Start value should be less than end value.`
                        }
                        break;
                }
            };
        }
        function checkStep() {
            if(checkRequired('Step', options.step)) {
                switch(options.dataType) {
                    case 'number':
                        if(options.step <= 0) {
                            errors += `\n>>> Step should be greater than 0.`
                        }
                        if(options.range[1] - options.range[0] < options.step) {
                            errors += `\n>>> Step should be less than ${options.range[1] - options.range[0]}.`
                        }
                        break;
                }
    
            };
        }
        function checkHandles() {
            if(checkRequired('Handles', options.handles)) {
                switch(options.dataType) {
                    case 'number':
                        if(Object.keys(options.handles).length < 1) {
                            errors += `\n>>> Empty handles.`
                        }
                        Object.entries(options.handles).forEach(entry => {
                            if(entry[1] < options.range[0] || options.range[1] < entry[1]) {
                            errors += `\n>>> Handle <${entry[0]}> value should be between ${options.range[0]} & ${options.range[1]}.`
                        }})
                        break;
                }
            };
        }
        function checkIsVertical() {
            if(options.isVertical === undefined) console.warn(`\n>>> Using horizontal layout. Define <isVertical: true> to use vertical.`);
        }
        function checkNeighborHandles() {
            if(!options.neighborHandles) console.warn(`\n>>> Is not specified how to treat with neighbour handles. Using default <jumpover>. Define <neighborHandles> as 'move' or 'stop' to change.`);
        }
        function checkRanges() {
            if(!options.ranges) {
                console.warn(`\n>>> Progress bars are not in use. Define <ranges> if necessary.`);
            } else {
                let checkProgressBarsSyntax = (ranges, level = 1) => {
                    if(level > 2) return;
                    if(ranges.constructor.name !== 'Array' && level <= 2) {
                        errors += `\n>>> To define progress bars use syntax: [[anchor1, anchor2], [anchor2, anchor3]]. Where anchor is handle ID or 'sliderstart', 'sliderend'
                        `
                    } else {
                        if(level === 2 && ranges.length !== 2) {
                            errors += `\n>>> Incorrect progress bars setup <${ranges}>. Only two anchors are allowed in each progress bar, ${ranges.length} is provided.`
                        }
                        ranges.forEach(range => checkProgressBarsSyntax(range, level + 1));
                    }
                }
                let checkProgressBarsAnchors = (anchor) => {
                    const allowedAnchors = ['sliderstart', 'sliderend'].concat(Object.keys(options.handles));
                    if(!allowedAnchors.includes(anchor)) errors += `\n>>> Anchor <${anchor}> is not valid. Progress bar anchor should be handle's ID or 'sliderstart', 'sliderend'`
                }
                
                checkProgressBarsSyntax(options.ranges);
                options.ranges.forEach(range => {
                    checkProgressBarsAnchors(range[0]);
                    checkProgressBarsAnchors(range[1]);
                })
            }  
        }
        function checkTags() {
            if(!options.tagsPositions) {
                console.warn(`\n>>> Tags are not in use. Define <tagsPositions> if necessary.`);
            } else {
                let checkPosition = position => ['top', 'right', 'left', 'bottom']
                    .includes(position) ? true :  errors += `\n>>> Tag position <${position}> is not valid. Choose 'top', 'right', 'left' or 'bottom'.`;

                let checkTagsPositionSyntax = data => {
                    switch(data.constructor.name) {
                        case 'String':
                            checkPosition(data);
                            break;
                        case 'Array':
                            if(data.length > 2) {
                                errors += `\n>>> To define tags use syntax: 'position' or ['position', {id1: 'position1', id2: 'position2'}] or [{id: 'position'}]`
                            } else {
                                let countDefault = 0;
                                data.forEach(position => {
                                    if(position.constructor.name === 'String') {
                                        checkPosition(position);
                                        countDefault++;
                                    } else if(position.constructor.name === 'Object') {
                                        Object.entries(position).forEach(entry => {
                                            if(!Object.keys(options.handles).includes(entry[0])) {
                                                errors += `\n>>> Tag error. Handle <${entry[0]}> not found.`
                                            }
                                            checkPosition(entry[1])
                                        })
                                    }
                                })
                                if(countDefault > 1) {
                                    errors += `\n>>> Only one default position is allowed. Provided <${countDefault}>.`;
                                }
                            }

                            break;

                    }
                }
                
                checkTagsPositionSyntax(options.tagsPositions)
            }
        }
        function checkRequired(name, option) {
            if(!option) {
                errors += `\n>>> ${name} required.`;
                return false;
            } else return true;
        }

        errors ? console.error(errors) : null;
        return errors ? false : true;
    }

    init(options) {
        if(!this.isValidOptions(options)) throw new Error('not valid options');
        
        this.options = options;
        this.view = new SliderView(this.options.root, options.handles,
            this.options.isVertical, this.options.useRange, options.ranges, options.tagsPositions,
            options.tagsPrefix,
            options.tagsPostfix,
            );
       this.model = new SliderModel(options);

       this.view.renderModel(this.model.cores);
       this.watchEvents();
    }

    watchEvents() {
        this.view.widget.elem.onpointerdown = event => {
            event.preventDefault();
            let type = event.target.dataset.type
            if(type === 'bar' || type === 'range') this.onClick();
            if(type === 'handle') this.onMove(event);
        }
    }

    onClick() {
        let clickHandler = event => {
            const value = this.options.isVertical ? 
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
        );
        let moveHandler = event => {
            const value = this.options.isVertical 
                            ? inRange(this.view.bar.getRelativeCoords(event).y + shift.y, 0, 100)
                            : inRange( this.view.bar.getRelativeCoords(event).x + shift.x, 0, 100)
            this.requestModelChange(handleID, 'pcnt', value);
        }

        this.view.showAbove(handleID);

        document.addEventListener('pointermove', moveHandler);
        document.addEventListener('pointerup', () => {
            document.removeEventListener('pointermove', moveHandler)
        }, {once: true});
    }

    requestModelChange(id, type, value) {
        this.model.setValue(id, type, value)
            .then(cores => this.view.renderModel(cores))
    }

    setValue(id, type, value) {
        if(type !== 'value' && type !== 'pcnt') throw new Error(
            `Type <${type}> is not valid. Choose 'value' or 'pcnt'`
        );
        if(!Object.keys(this.model.cores).includes(id)) throw new Error(
            `Id <${id}> not found`
        );
        this.requestModelChange(id, type, value)
    }

    getValues(id) {
        let values = {}
        if(!id) Object.entries(this.model.cores).forEach(entry =>
            values[entry[0]] = entry[1].value);
        else if(id.constructor.name ===  'Array') id.forEach(id => 
            values[id] = this.model.cores[id].value); 
        else if(id.constructor.name === 'String') values = this.model.cores[id].value;

        return values
    }

    reset() {
        this.options.root.innerHTML = '';
        this.init(this.options);
    }
}

class SliderModel {
    constructor(options) {
        this.mode = options.mode;
        this.dataType = options.dataType;
        this.step = options.step;
        this.min = options.range[0];
        this.max = options.range[1];
        this.neighborHandles = options.neighborHandles;
        this.initCores(options.handles);
    }

    initCores(handles) {
        this.cores = Object.fromEntries(Object.entries(handles).map(handle =>[
            handle[0], {
                value: handle[1],
                pcnt: this.calcPcntFromValue(handle[1])
            }
        ]))
    }
    calcValueFromPcnt(pcnt) {
        if(this.dataType === 'number') return (pcnt * (this.max - this.min) / 100) + this.min;
    }

    calcPcntFromValue(value) {
        if(this.dataType === 'number') return (value - this.min) * 100 / (this.max - this.min);
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

    calcCore(id, requestedValue, requestedPcnt, localLimits) {
        let value, pcnt;
        if(this.dataType === 'number') {
            const steps = Math.round((requestedValue - this.min) / this.step);
            value = inRange(
                requestedValue === this.max ? this.max : this.min + (this.step * steps),
                this.min,
                this.max);
            pcnt = inRange(requestedPcnt, 0, 100);
            switch(this.neighborHandles) {
                case 'move':
                    const neighbors = this.getNeighbors(id, this.getSortedCores());
        
                    if(
                        requestedPcnt < this.cores[id].pcnt &&
                        requestedPcnt <= localLimits.min.pcnt && 
                        neighbors.prevId !== null
                    ) this.setValue(neighbors.prevId, 'pcnt', pcnt);
                    else if(
                        requestedPcnt >= this.cores[id].pcnt &&
                        requestedPcnt >= localLimits.max.pcnt &&
                        neighbors.nextId !== null
                    ) this.setValue(neighbors.nextId, 'pcnt', pcnt)
                    break;
                    
                case 'stop':
                    value = inRange(value, localLimits.min.value, localLimits.max.value);
                    pcnt = inRange(requestedPcnt, localLimits.min.pcnt, localLimits.max.pcnt);
                    break;
            }

            let stepCapicityDigs = this.step.toString().match(/\.(\d+)/)?.[1].length;
            value = +value.toFixed(stepCapicityDigs)
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
// console.log(id, '= value: ', this.cores[id].value, ', pcnt:', this.cores[id].pcnt)
        return new Promise(resolve => {
            resolve(this.cores)
        })
    }
}
class SliderView {
    constructor(root, handles, isVertical, useRange, ranges, tagsPositions, tagsPrefix, tagsPostfix) {
        this.root = root;
        this.isVertical = isVertical;
        this.useRange = useRange;
        this.tagsPrefix = tagsPrefix || '';
        this.tagsPostfix = tagsPostfix || '';

        this.init(handles, tagsPositions, ranges)
        this.renderTamplate();
    }

    init(handles, tagsPositions, ranges) {
        this.widget = new SliderElement(['slider', `${this.isVertical ? 'slider_v': 'slider_h'}`])
        this.bar = new Bar(['slider__bar', 'js-slider-bar']);
        this.handles = Object.fromEntries(Object.entries(handles).map(handle => [
            handle[0], 
            new Handle(handle[0], handle[1], 
                ['slider__handle', 'js-slider-handle', `slider__handle_${handle[0]}`],
                tagsPositions
            )
        ]))
        if(ranges) this.ranges = ranges.map(range => range = new SelectedRange(
            range, 
            ['slider__range', `js-range-${range[0]}_${range[1]}`]
        ))
    }


    renderTamplate() {
        this.root.innerHTML = '';
        this.root.append(this.widget.elem);
        this.widget.elem.append(this.bar.elem);
        this.ranges?.forEach(range => {
            this.bar.elem.append(range.elem);
        });
        for(let handle in this.handles) {
            this.bar.elem.append(this.handles[handle].elem);
        };
    }

    renderModel(cores) {
        let swapArgs = arg => this.isVertical ? ['', arg] : [arg, ''];

        for(let id in cores) {
            this.handles[id].moveCenterTo(...swapArgs(cores[id].pcnt));
            this.handles[id].tag ? this.handles[id].tag.displayValue(
                this.tagsPrefix + cores[id].value + this.tagsPostfix) : null;
        } // TODO check fool 0-100%
        this.ranges?.forEach(range => {
            const calcStartEndPcnt = id => {switch(id) {
                case 'sliderstart': return 0;
                case 'sliderend': return 100;
                default: return cores[id].pcnt
            }}
            let startPcnt = calcStartEndPcnt(range.startId);
            let endPcnt = calcStartEndPcnt(range.endId);
            if(startPcnt > endPcnt) [startPcnt, endPcnt] = [endPcnt, startPcnt]
            const length = Math.abs(endPcnt - startPcnt);

            range.moveLeftEdgeTo(...swapArgs(startPcnt));
            range.setRelativeSize(...swapArgs(length));
        });
    }

    showAbove(handleID) { // TODO fix in stop-mode neighborHandles
        for(let id in this.handles) {this.handles[id].elem.style.zIndex = ''}
        this.handles[handleID].elem.style.zIndex = 1000;
    }
}

class SliderElement {
    constructor(classes, type) {
        this.elem = document.createElement('div');
        type ? this.elem.dataset.type = type : null;
        this.elem.classList.add(...classes);
    }

    getRelativeCoords(event, normalize) {
        let x = (event.pageX - (window.pageXOffset + this.elem.getBoundingClientRect().left) - this.elem.clientLeft) / this.elem.clientWidth * 100;
        let y = (event.pageY - (window.pageYOffset + this.elem.getBoundingClientRect().top) - this.elem.clientTop) / this.elem.clientHeight * 100;

        if(normalize) {
            x = inRange(x, 0, 100);
            y = inRange(y, 0, 100);
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
        super(classes, 'bar');
    }
}

class SelectedRange extends SliderElement {
    constructor(anchorsId, classes) {
        super(classes, 'range');
        this.startId = anchorsId[0];
        this.endId = anchorsId[1];
    }

    moveCenterTo(x, y) {
        throw new Error('method moveCenterTo is not allowed for range');
    }

    setRelativeSize(width, height) {
        if(height || height === 0) this.elem.style.height = height + '%'
        if(width || width === 0) this.elem.style.width = width + '%';
    }
}

class Handle extends SliderElement {
    constructor(id, initValue, classes, tagsPositions) { 
        super(classes, 'handle');
        this.elem.dataset.id = id;
        this.initValue = initValue;
        if(tagsPositions) this.createTagInstance(tagsPositions);
    }

    createTagInstance(tagsPositions) {
        this.tag = new Tag(tagsPositions, this.elem.dataset.id);
        this.elem.append(this.tag.elem)
    }
}

class Tag extends SliderElement {
    constructor(tagsPositions, id) {
        super(['slider__tag-container']);
        this.DEFAULT_POSITION = 'top';
        this.elem.classList.add(this.resolveTagPosition(tagsPositions, id));
        this.elem.innerHTML = `
            <div class="tag">
                <div class="tag__value js-tag-value"></div>
            </div>
        `
    }

    resolveTagPosition(tagsPositions, id) {
        let position;
        switch(tagsPositions.constructor.name) {
            case 'String': position = tagsPositions; break;
            case 'Array':
                const defaultPosotion = tagsPositions.find(
                    item => item.constructor.name === 'String'
                    ) || this.DEFAULT_POSITION;
                const privatePosition = tagsPositions.find(
                    item => item.constructor.name === 'Object'
                    )?.[id];
                position = privatePosition || defaultPosotion
                break;
        }
        return `slider__tag-container_${position}`;

    }

    displayValue(value) {
        this.elem.querySelector('.js-tag-value').textContent = value;
    }
}

function inRange(value, min, max) {
    return Math.min(max, Math.max(min, value))
}