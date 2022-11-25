'use strict'

class SliderController {
    constructor(options) {
        this.init(options)
    }

    // isValidOptions(options) {
    //     let errors = '';

    //     checkRequired('Root', options.root)
    //     checkMode();
    //     checkDataType();
    //     checkRange();
    //     checkStep();
    //     checkHandles();
    //     checkIsVertical();
    //     checkNeighborHandles();
    //     checkProgressBars();
    //     checkTags();
    //     checkHandlesTextContent();

    //     function checkMode() {
    //         if(checkRequired('Mode', options.mode)) {
    //             if(!['select'].includes(options.mode)) errors += `\n>>> Incorrect mode. Specified <${options.mode}>`;
    //         };
    //     }
    //     function checkDataType() {
    //         if(checkRequired('DataType', options.dataType)) {
    //             if(!['number'].includes(options.dataType)) errors += `\n>>> Incorrect dataType. Specified <${options.dataType}>`;
    //         };
    //     }
    //     function checkRange() {
    //         if(checkRequired('Range', options.range)) {
    //             switch(options.dataType) {
    //                 case 'number':
    //                     if(options.range.length !== 2) {
    //                         errors += `\n>>> With datatype 'number' required array with only 2 values: ['start', 'end'].`; 
    //                         break;
    //                     }
    //                     if(options.range[0] >= options.range[1]) {
    //                         errors += `\n>>> Start value should be less than end value.`
    //                     }
    //                     break;
    //             }
    //         };
    //     }
    //     function checkStep() {
    //         if(checkRequired('Step', options.step)) {
    //             switch(options.dataType) {
    //                 case 'number':
    //                     if(options.step <= 0) {
    //                         errors += `\n>>> Step should be greater than 0.`
    //                     }
    //                     if(options.range[1] - options.range[0] < options.step) {
    //                         errors += `\n>>> Step should be less than ${options.range[1] - options.range[0]}.`
    //                     }
    //                     break;
    //             }
    
    //         };
    //     }
    //     function checkHandles() {
    //         if(checkRequired('Handles', options.handles)) {
    //             switch(options.dataType) {
    //                 case 'number':
    //                     if(Object.keys(options.handles).length < 1) {
    //                         errors += `\n>>> Empty handles.`
    //                     }
    //                     Object.entries(options.handles).forEach(entry => {
    //                         if(entry[1] < options.range[0] || options.range[1] < entry[1]) {
    //                         errors += `\n>>> Handle <${entry[0]}> value should be between ${options.range[0]} & ${options.range[1]}.`
    //                     }})
    //                     break;
    //             }
    //         };
    //     }
    //     function checkIsVertical() {
    //         if(options.isVertical === undefined) console.warn(`\n>>> Using horizontal layout. Define <isVertical: true> to use vertical.`);
    //     }
    //     function checkNeighborHandles() {
    //         if(!options.neighborHandles) console.warn(`\n>>> Is not specified how to treat with neighbour handles. Using default <jumpover>. Define <neighborHandles> as 'move' or 'stop' to change.`);
    //     }
    //     function checkProgressBars() {
    //         if(!options.progressBars) {
    //             console.warn(`\n>>> Progress bars are not in use. Define <progressBars> if necessary.`);
    //         } else {
    //             let checkProgressBarsSyntax = (progressBars, level = 1) => {
    //                 if(level > 2) return;
    //                 if(progressBars.constructor.name !== 'Array' && level <= 2) {
    //                     errors += `\n>>> To define progress bars use syntax: [[anchor1, anchor2], [anchor2, anchor3]]. Where anchor is handle ID or 'sliderstart', 'sliderend'
    //                     `
    //                 } else {
    //                     if(level === 2 && progressBars.length !== 2) {
    //                         errors += `\n>>> Incorrect progress bars setup <${progressBars}>. Only two anchors are allowed in each progress bar, ${progressBars.length} is provided.`
    //                     }
    //                     progressBars.forEach(progressBar => checkProgressBarsSyntax(progressBar, level + 1));
    //                 }
    //             }
    //             let checkProgressBarsAnchors = (anchor) => {
    //                 const allowedAnchors = ['sliderstart', 'sliderend'].concat(Object.keys(options.handles));
    //                 if(!allowedAnchors.includes(anchor)) errors += `\n>>> Anchor <${anchor}> is not valid. Progress bar anchor should be handle's ID or 'sliderstart', 'sliderend'`
    //             }
                
    //             checkProgressBarsSyntax(options.progressBars);
    //             options.progressBars.forEach(progressBar => {
    //                 checkProgressBarsAnchors(progressBar[0]);
    //                 checkProgressBarsAnchors(progressBar[1]);
    //             })
    //         }  
    //     }
    //     function checkTags() {
    //         if(!options.tagsPositions) {
    //             console.warn(`\n>>> Tags are not in use. Define <tagsPositions> if necessary.`);
    //         } else {
    //             let checkPosition = position => ['top', 'right', 'left', 'bottom']
    //                 .includes(position) ? true :  errors += `\n>>> Tag position <${position}> is not valid. Choose 'top', 'right', 'left' or 'bottom'.`;

    //             let checkTagsPositionSyntax = data => {
    //                 switch(data.constructor.name) {
    //                     case 'String':
    //                         checkPosition(data);
    //                         break;
    //                     case 'Array':
    //                         if(data.length > 2) {
    //                             errors += `\n>>> To define tags use syntax: 'position' or ['position', {id1: 'position1', id2: 'position2'}] or [{id: 'position'}]`
    //                         } else {
    //                             let countDefault = 0;
    //                             data.forEach(position => {
    //                                 if(position.constructor.name === 'String') {
    //                                     checkPosition(position);
    //                                     countDefault++;
    //                                 } else if(position.constructor.name === 'Object') {
    //                                     Object.entries(position).forEach(entry => {
    //                                         if(!Object.keys(options.handles).includes(entry[0])) {
    //                                             errors += `\n>>> Tag error. Handle <${entry[0]}> not found.`
    //                                         }
    //                                         checkPosition(entry[1])
    //                                     })
    //                                 }
    //                             })
    //                             if(countDefault > 1) {
    //                                 errors += `\n>>> Only one default position is allowed. Provided <${countDefault}>.`;
    //                             }
    //                         }

    //                         break;

    //                 }
    //             }
                
    //             checkTagsPositionSyntax(options.tagsPositions)
    //         }
    //     }
    //     function checkHandlesTextContent() {
    //         if(!options.handlesTextContent) {
    //             console.warn(`\n>>> Text content in handles is not in use. Define <handlesTextContent> if necessary.`);
    //         } else {
    //             if(options.handlesTextContent.constructor.name !== "Object") {
    //                 errors += `\n>>> To define text content in handles use object {id: text}`
    //                 return;
    //             }

    //             Object.entries(options.handlesTextContent).forEach(entry => {
    //                 if(!Object.keys(options.handles).includes(entry[0])) {
    //                     errors += `\n>>> Handles text content error. Handle <${entry[0]}> not found.`
    //                 }
    //             })
    //         }
    //     }
    //     function checkRequired(name, option) {
    //         if(!option) {
    //             errors += `\n>>> ${name} required.`;
    //             return false;
    //         } else return true;
    //     }

    //     errors ? console.error(errors) : null;
    //     return errors ? false : true;
    // }

    isValidOptions(options) {return true}

    init(options) {
        if(!this.isValidOptions(options)) throw new Error('not valid options');
        
        this.options = options;
        this.view = new SliderView(options);
        if(options.dataType === 'number') {
            this.model = new SliderModel(options);
        } else {
            this.typeHandler = new TypeHandlerFactory().create(this.options);
            this.model = new SliderModel(this.typeHandler.resolveOptionsForModel());
        }

        this.setVerbalValue();
        this.view.renderModel(this.model.cores);
        this.watchEvents();
    }

    setVerbalValue() {
        if(this.options.dataType === 'number') {
            for(let id in this.model.cores) {
                this.model.cores[id].verbalValue = this.model.cores[id].value;
            }
        } else {
            for(let id in this.model.cores) {
                this.model.cores[id].verbalValue = this.typeHandler.getVerbalValue(this.model.cores[id].value);
            }
        }
    }

    watchEvents() {
        this.view.widget.elem.onpointerdown = event => {
            event.preventDefault();
            let type = event.target.dataset.type
            if(type === 'bar' || type === 'progressBar') this.onClick();
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

        this.resolveZIndex();
        this.view.bar.elem.addEventListener('pointerup', clickHandler, {once: true})
    }

    onMove(startEvent) {
        const handleID = startEvent.target.dataset.id;
        this.resolveZIndex(handleID);
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

        document.addEventListener('pointermove', moveHandler);
        document.addEventListener('pointerup', () => {
            document.removeEventListener('pointermove', moveHandler)
        }, {once: true});
    }

    resolveZIndex(activeHandleId) {
        for(let id in this.view.handles) {
            id === activeHandleId ? 
            this.view.handles[id].elem.classList.add('js-active') :
            this.view.handles[id].elem.classList.remove('js-active');

            this.view.handles[id].setZIndex();
        }
    }

    requestModelChange(id, type, value) {
        this.model.setValue(id, type, value)
            .then(this.setVerbalValue())
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
        const output = {}
        if(!id) Object.entries(this.model.cores).forEach(entry =>
            output[entry[0]] = entry[1].verbalValue);
        else if(id.constructor.name ===  'Array') id.forEach(id => 
            output[id] = this.model.cores[id].verbalValue); 
        else if(id.constructor.name === 'String') output = this.model.cores[id].verbalValue;

        return output
    }

    reset() {
        this.options.root.innerHTML = '';
        this.init(this.options);
    }
}

class SliderModel {
    constructor(options) {
        this.initModel(options);
    }

    initModel(options) {
        this.mode = options.mode;
        this.step = options.step;
        this.min = options.range[0];
        this.max = options.range[1];
        this.neighborHandles = options.neighborHandles || 'jumpover';
        this.cores = Object.fromEntries(Object.entries(options.handles).map(
            handle => {
                const id = handle[0];
                const value = handle[1];
                return [
                    id, 
                    {
                        value, 
                        pcnt: this.calcPcntFromValue(handle[1]),
                    }
                ]
            }    
        ))
        this.setCoreIndex()
    }

    setCoreIndex() {
        const sortedCores = Object.entries(this.cores).sort((a, b) => a[1].pcnt > b[1].pcnt ? 1 : a[1].pcnt < b[1].pcnt ? -1 : 0);
        sortedCores.forEach((core, index) => {
            const id = core[0]
            this.cores[id].index = index + 1;
        })
    }
    calcValueFromPcnt(pcnt) {
       return (pcnt * (this.max - this.min) / 100) + this.min;
    }

    calcPcntFromValue(value) {
        return (value - this.min) * 100 / (this.max - this.min);
    }

    getNeibIds(id) {
        let coresEntries = Object.entries(this.cores);
        let thisOrder = this.cores[id].index;
        let prevId = thisOrder === 1 ? '' : coresEntries.find( core => core[1].index === thisOrder - 1)[0];
        let nextId = thisOrder === coresEntries.length ? '' : coresEntries.find(core => core[1].index === thisOrder + 1)[0];

        return {prevId, nextId};
    }

    formatValueCapacity(value) {
        const stepCapacityDigs = this.step.toString().match(/\.(\d+)/)?.[1].length;
        return +value.toFixed(stepCapacityDigs) 
    }

    calcCore(id, requestedValue, requestedPcnt) {
        let value, pcnt;
        const steps = Math.round((requestedValue - this.min) / this.step);
        const limitIds = this.getNeibIds(id);

        switch(this.neighborHandles) {
            case 'jumpover':
                value = inRange(
                    requestedValue === this.max ? this.max : this.min + (this.step * steps),
                    this.min, this.max
                );
                pcnt = inRange(requestedPcnt, 0, 100);
                break;
            case 'move':
                value = inRange(
                    requestedValue === this.max ? this.max : this.min + (this.step * steps),
                    this.min, this.max
                );
                pcnt = inRange(requestedPcnt, 0, 100);

                const getCoresToGlueWith = (forward, id, pcnt) => {
                    const coresToGlue = [];
                    const test = (forward, id, pcnt) => {
                        const testCoreId = forward ? this.getNeibIds(id).nextId : this.getNeibIds(id).prevId;
                        if(!testCoreId) return;
                        else if(forward && this.cores[testCoreId].pcnt > pcnt) return;
                        else if(!forward && this.cores[testCoreId].pcnt < pcnt) return;
                        else {
                            coresToGlue.push(testCoreId)
                            test(forward, testCoreId, pcnt);
                        }
                    }
                    test(forward, id, pcnt);
                    return coresToGlue;
                }

                const coresToGlue = pcnt > this.cores[id].pcnt ? 
                    getCoresToGlueWith(true, id, pcnt) : getCoresToGlueWith(false, id, pcnt);

                coresToGlue.forEach(id => {
                    this.cores[id].pcnt = pcnt;
                    this.cores[id].value = this.formatValueCapacity(this.calcValueFromPcnt(pcnt));
                })

                break;
            case 'stop':
                value = inRange(
                    requestedValue === this.max ? this.max : this.min + (this.step * steps),
                    limitIds.prevId ? this.cores[limitIds.prevId].value : this.min,
                    limitIds.nextId ? this.cores[limitIds.nextId].value : this.max
                );
                pcnt = inRange(
                    requestedPcnt, 
                    limitIds.prevId ? this.cores[limitIds.prevId].pcnt : 0, 
                    limitIds.nextId ? this.cores[limitIds.nextId].pcnt : 100
                );
                break;
        }

        value = this.formatValueCapacity(value)
        return {value, pcnt}
    }

    getClosestId(pcnt) {
        const coresArr = Object.entries(this.cores);

        if(coresArr.length === 1) return coresArr[0][0];

        const closestCore = coresArr.reduce((prev, curr)  => {
            if(Math.abs(curr[1].pcnt - pcnt) < Math.abs(prev[1].pcnt - pcnt)) {
                return curr;
            }
            else if(Math.abs(curr[1].pcnt - pcnt) === Math.abs(prev[1].pcnt - pcnt)) {
                if(pcnt >= curr[1].pcnt && curr[1].index > prev[1].index) return curr;
                if(pcnt < curr[1].pcnt && curr[1].index < prev[1].index) return curr;
                return prev
            }
            return prev;
        })
        return closestCore[0]
    }

    setValue(id, type, value) {
        if(id == undefined && type === 'pcnt') id = this.getClosestId(value);

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
        const permittedCore = this.calcCore(id, requestedValue, requestedPcnt);

        this.cores[id].value = permittedCore.value;
        this.cores[id].pcnt = permittedCore.pcnt;

        if(this.neighborHandles === 'jumpover') this.setCoreIndex();

        return new Promise(resolve => {
            resolve(this.cores)
        })
    }
}
class SliderView {
    constructor(options) {
        this.init(options)
        this.renderTamplate();
    }

    init(options) {
        this.root = options.root;
        this.isVertical = options.isVertical;
        this.tagsPrefix = options.tagsPrefix || '';
        this.tagsPostfix = options.tagsPostfix || '';

        this.widget = new SliderElement(['slider', `${this.isVertical ? 'slider_v': 'slider_h'}`])
        this.bar = new Bar(['slider__bar', 'js-slider-bar']);
        this.handles = Object.fromEntries(Object.entries(options.handles).map(handle => [
            handle[0], 
            new Handle(handle[0], 
                ['slider__handle', 'js-slider-handle', `slider__handle_${handle[0]}`],
                options.tagsPositions,
                options.handlesTextContent,
            )
        ]))
        if(options.progressBars) this.progressBars = options.progressBars.map(progressBar => progressBar = new ProgressBar(
            progressBar, 
            ['slider__progressBar', `js-progressBar-${progressBar[0]}_${progressBar[1]}`]
        ))
    }

    renderTamplate() {
        this.root.innerHTML = '';
        this.root.append(this.widget.elem);
        this.widget.elem.append(this.bar.elem);
        this.progressBars?.forEach(progressBar => {
            this.bar.elem.append(progressBar.elem);
        });
        for(let handle in this.handles) {
            this.bar.elem.append(this.handles[handle].elem);
        };
    }

    renderModel(cores) {
        let swapArgs = arg => this.isVertical ? ['', arg] : [arg, ''];

        for(let id in cores) {
            this.handles[id].moveCenterTo(...swapArgs(cores[id].pcnt));

            this.handles[id].pcnt = cores[id].pcnt;
            this.handles[id].index = cores[id].index;
            this.handles[id].setZIndex();

            this.handles[id].tag ? this.handles[id].tag.displayValue(
                this.tagsPrefix + cores[id].verbalValue + this.tagsPostfix) : null;
        }
        this.progressBars?.forEach(progressBar => {
            const calcStartEndPcnt = id => {switch(id) {
                case 'sliderstart': return 0;
                case 'sliderend': return 100;
                default: return cores[id].pcnt;
            }}
            let startPcnt = calcStartEndPcnt(progressBar.startId);
            let endPcnt = calcStartEndPcnt(progressBar.endId);
            if(startPcnt > endPcnt) [startPcnt, endPcnt] = [endPcnt, startPcnt]
            const length = Math.abs(endPcnt - startPcnt);

            progressBar.moveLeftEdgeTo(...swapArgs(startPcnt));
            progressBar.setRelativeSize(...swapArgs(length));
        });
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

class ProgressBar extends SliderElement {
    constructor(anchorsId, classes) {
        super(classes, 'progressBar');
        this.startId = anchorsId[0];
        this.endId = anchorsId[1];
    }

    moveCenterTo(x, y) {
        throw new Error('method moveCenterTo is not allowed for progress bars');
    }

    setRelativeSize(width, height) {
        if(height || height === 0) this.elem.style.height = height + '%'
        if(width || width === 0) this.elem.style.width = width + '%';
    }
}

class Handle extends SliderElement {
    constructor(id, classes, tagsPositions, textContent) { 
        super(classes, 'handle');
        this.elem.dataset.id = id;
        if(textContent) this.elem.textContent = textContent[id];
        if(tagsPositions) this.createTagInstance(tagsPositions);
    }

    createTagInstance(tagsPositions) {
        this.tag = new Tag(tagsPositions, this.elem.dataset.id);
        this.elem.append(this.tag.elem)
    }

    setZIndex() {
        if(this.elem.classList.contains('js-active')) this.elem.style.zIndex = 1000;
        else if(this.pcnt <= 50) this.elem.style.zIndex = 100 + this.index;
        else if(this.pcnt > 50)  this.elem.style.zIndex = 100 - this.index;

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

class DateHandler {
    constructor(options) {
        this.options = options;
        if(this.options.stepMeasure === 'month') {
            this.outputDay = this.isLastDayOfMonth(this.options.range[0]) ?
                'last' : this.options.range[0].getDate();
        }
    }

    resolveOptionsForModel() {
        const modelOptions = {
            mode: this.options.mode,
            step: this.options.step,
            neighborHandles: this.options.neighborHandles,
            handles: {},
        };

        const callback = 
            this.options.stepMeasure === 'day' ? this.calcDaysAmount.bind(this) :
            this.options.stepMeasure === 'month' ? this.calcMonthsAmount.bind(this) :
            this.options.stepMeasure === 'year' ? this.calcYearsAmount.bind(this) : null;

        for(let id in this.options.handles) {
            modelOptions.handles[id] = callback(this.options.range[0], this.options.handles[id])
        }
        modelOptions.range = [0, callback(...this.options.range)];
        return modelOptions
    }

    getVerbalValue(value) {
        const callback = 
            this.options.stepMeasure === 'day' ? this.addDays.bind(this) :
            this.options.stepMeasure === 'month' ? this.addMonths.bind(this) :
            this.options.stepMeasure === 'year' ? this.addYears.bind(this) : null;
        const verbal = new Date(
            Math.min(+callback(this.options.range[0], value), +this.options.range[1]));
        return this.formatDate(verbal);
    }

    formatDate(date) {
        const addLeadingSymbol = (num, requiredCapacity, symbol) => {
            let str = num.toString()
            if(str.length >= requiredCapacity) return str;
            return symbol.toString().repeat(requiredCapacity - str.length) + str;
        }
        const d = addLeadingSymbol(date.getDate(), 2, 0);
        const m = addLeadingSymbol(date.getMonth() + 1, 2, 0);
        const y = date.getFullYear();

        return [d, m, y].join('.')
    }

    calcDaysAmount(date1, date2) {
        return Math.abs(+date1 - +date2) / (1000 * 60 * 60 * 24);
    }

    addDays(date, days) {
        return +date + (days * 1000 * 60 * 60 * 24);
    }

    getLastDayOfMonth(month, year) {
        const date = new Date(year, month + 1, 0)
        return date.getDate();
    }

    isLastDayOfMonth(date) {
        const day = date.getDate();
        const lastDay = this.getLastDayOfMonth(date.getMonth(), date.getFullYear());
        return day === lastDay;
    }

    calcMonthsAmount(date1, date2) {
        const totalMonths = date2.getMonth() - date1.getMonth() + 
            (12 * (date2.getFullYear() - date1.getFullYear()));
        const daysDate2 = date2.getDate();
        return totalMonths + (daysDate2 / 100);
    }

    addMonths(date, months) {
        const year = date.getFullYear();
        const month =  date.getMonth() + Math.floor(months);

        let newDate = new Date(date).setFullYear(year, month, 1);

        let day;
        if(months % 1 !== 0) {
            day = +((months % 1) * 100).toFixed(0);
        } else if(this.outputDay !== 1) {
           day = this.outputDay === 'last' ? this.getLastDayOfMonth(month, year) : this.outputDay;
        }
        day ? newDate = new Date(newDate).setDate(day) : null;

        return newDate
    }

    calcYearsAmount(date1, date2) {
        const totalYears = (date2.getFullYear() - date1.getFullYear());
        const daysDate2 = this.calcDaysAmount(
            new Date(date2).setMonth(0, 0), date2)
            console.log(totalYears, daysDate2)
        return totalYears + (daysDate2 / 1000);
    }

    addYears(date, years) {
        const year = date.getFullYear() + Math.floor(years);
        const month = date.getMonth();
        const day = date.getDate();

        let newDate = new Date(date).setFullYear(year, 0 , 1);

        if(years % 1 !== 0) {
            newDate = new Date(newDate).setDate(+((years % 1) * 1000).toFixed(0));
        } else {
            newDate = new Date(newDate).setMonth(month, day);
        }

        return newDate;
    }
}

class TypeHandlerFactory {
    static types = {
        date: DateHandler
    }

    create(options) {
        const TypeHandler = TypeHandlerFactory.types[options.dataType];
        return new TypeHandler(options);

    }
}

function inRange(value, min, max) {
    return Math.min(max, Math.max(min, value))
}