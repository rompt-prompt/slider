'use strict'

class Configurator2 {
    constructor(slider, container) {
        this.slider = slider;
        this.configContainer = container;

        this.model = new ConfiguratorModel(slider);
        this.view = new ConfiguratorView(slider, container);
        this.view.form.onsubmit = () => false;
        this.view.form.onkeyup = (event) => {
            if(event.key === 'Enter') {
                event.target.blur();
            }
        }
        this.view.form.onchange = (event) => {
            this.onChangeHandler(event.target);
        };
    }

    onChangeHandler(target) {
        if(target.dataset.action !== 'optionChange') return
    
        let optionName = target.name;
        let value = target.value;

        switch (optionName) {
            case 'range-start':
                optionName = 'range';
                value = [
                    this.slider.options.dataType === 'date' ? new Date(value) : +value, 
                    this.slider.options.range[1]
                ];
                break;
            case 'range-end':
                optionName = 'range';
                value = [
                    this.slider.options.range[0],
                    this.slider.options.dataType === 'date' ? new Date(value) : +value
                ];
                break;
            case 'range-array': // TODO обновлять select в view бегунках
                optionName = 'range';
                value = value.split('|');
                break;
            case 'step':
                value = +value;
                break;
            case 'isVertical':
            case 'tagsPositions':
                value = 
                    value === 'true' ? true :
                    value === 'false' ? false  :
                    value;
                break;
            case 'handles':
                const id = target.dataset.id;
                const handlesCopy = Object.assign({}, this.slider.options.handles);
                handlesCopy[id] = 
                    this.slider.options.dataType === 'number' ? +value :
                    this.slider.options.dataType === 'date' ? new Date(value) : null // TODO fix array
                value = handlesCopy;
                break;
        }
    
        this.model.updateOption(optionName, value)
            .then(this.slider.reset())
    }
}

class ConfiguratorModel {
    constructor(slider) {
        this.slider = slider;
    }

    updateOption(optionName, value) {
        let optionsCopy = Object.assign({}, this.slider.options);
        optionsCopy[optionName] = value;
        const errors = this.getOptionsErrors(optionsCopy);
        return new Promise((resolve, reject) => {
            if(!errors) {
                this.slider.options = optionsCopy;
                resolve(this.slider.options);
            } else {
                optionsCopy = undefined;
                reject(errors)
            }
        })
    }

    addNewValue(optionName, value) {
        let optionCopy;

        if(optionName === 'handles') {
            optionCopy = Object.assign({}, this.slider.options.handles, value);
        } else if(optionName === 'progressBars') {
            optionCopy = [].concat(this.slider.options.progressBars || []);
            optionCopy.push(value);
        } else return;

        return this.updateOption(optionName, optionCopy)
    }

    removeHandle(id) {
        let optionCopy = Object.assign({}, this.slider.options.handles);
        delete optionCopy[id];

        return this.updateOption('handles', optionCopy)
    }

    removeProgressBar(anchor1, anchor2) {
        let optionCopy = this.slider.options.progressBars.filter(bar => {
            return !(bar.includes(anchor1) && bar.includes(anchor2));
        });

        return this.updateOption('progressBars', optionCopy)
    }

    getOptionsErrors(options) {
        const validator = new Validator(options, false);
        validator.isValidOptions();

        return validator.errors;
    }
}
class ConfiguratorView {
    constructor(slider, container) {
        this.slider = slider;
        this.form = document.createElement('form');
        this.form.append(...this.getFormTemplate().map(elem => elem.group));
        container.append(this.form);
    }
    getFormTemplate() {
        this.formGroups = [
            new StepGr(this.slider),
            new IsVerticalGr(this.slider),
            new NeighborHandlesGr(this.slider),
            new TagsPositionsGr(this.slider),
            new AffixGr(this.slider),
            new HandlesGr(this.slider),
            new ProgressBarsGr(this.slider)
        ];

        if(this.slider.options.dataType === 'number') {
            this.formGroups.unshift(new RangeGr(this.slider));
        }
        if(this.slider.options.dataType === 'date') {
            this.formGroups.unshift(new RangeGr(this.slider), new StepMeasureGr(this.slider));
        }
        if(this.slider.options.dataType === 'array') {
            this.formGroups.unshift(new RangeArrayGr(this.slider));
        }
        return this.formGroups;
    }
}
class FromGroup {
    constructor(title, slider) {
        this.group = this.createFormGroup(title);
        this.slider = slider;
    }
    createFormGroup(title) {
        const group = document.createElement('div');
        group.classList.add('config__group', 'group');
        if(title) group.innerHTML = `<h3 class="group__name">${title}</h3>`;

        return group;
    }
    createFormSubgroup(title) {
        const sub = document.createElement('div');
        sub.classList.add('subgroup');
        sub.innerHTML = `<h4 class="subgroup__name">${title}</h4>`;
        
        return sub;
    }
    createLabelInput(label, attr) {
        const lab = document.createElement('label');
        lab.classList.add('option');
        lab.innerHTML = `
            <span class="option__name">${label}</span>
            <input ${attr.join(' ')}>
        `

        return lab;
    }
    createLabelSelect(label, attr, optionsValues) {
        const lab = document.createElement('label');
        lab.classList.add('option');
        lab.innerHTML = `
            <span class="option__name">${label}</span>
            <select ${attr.join(' ')}></select>
        `
        if(optionsValues) {
            this.renderSelectOptions(lab.querySelector('select'), optionsValues);
        }

        return lab;
    }
    renderSelectOptions(parentElem, optionsValues) {
        parentElem.innerHTML = `${optionsValues.map(option => 
            `<option value="${option.value}">${option.content}</option>`
        ).join('')}`;
    }
    createAddBtn(data) {
        const btn = document.createElement('i');
        btn.classList.add('bi', 'bi-plus-square');
        for(let key in data) {
            btn.dataset[key] = data[key];
        }

        return btn;
    }
    createRemoveBtn(data) {
        const btn = document.createElement('i');
        btn.classList.add('bi', 'bi-trash');
        for(let key in data) {
            btn.dataset[key] = data[key];
        }

        return btn;
    }
    convertDateToAttr(date) {
        const addLeadingSymbol = (num, requiredCapacity, symbol) => {
            let str = num.toString()
            if(str.length >= requiredCapacity) return str;
            return symbol.toString().repeat(requiredCapacity - str.length) + str;
        }
        const d = addLeadingSymbol(date.getDate(), 2, 0);
        const m = addLeadingSymbol(date.getMonth() + 1, 2, 0);
        const y = date.getFullYear();

        return [y, m, d].join('-')
    }
    setRadioCheck(optionName) {
        let current = 
            this.slider.options[optionName] || 
            this.slider.validator.unessentialOptions
                .find(option => option.name === optionName).default;
        current = current.toString();
        
        const inputs = this.group.querySelectorAll(`[name="${optionName}"]`);
        inputs.forEach(input => {
            if(input.value === current) {
                input.setAttribute('checked', 'checked')
            } else {
                input.removeAttribute('checked')
            }
        })
    }
}
class RangeGr extends FromGroup {
    constructor(slider) {
        super('Диапазон', slider);
        this.inputTypeAttr = this.slider.options.dataType === 'date' ? 'type="date"' : 'type="text"'
        this.group.append(
            this.createLabelInput('Минимум', ['name="range-start"', this.inputTypeAttr, 'data-action=optionChange']),
            this.createLabelInput('Максимум', ['name="range-end"', this.inputTypeAttr, 'data-action=optionChange'])
        );
        this.setValue();
    }
    setValue() {
        let rangeStart = this.slider.options.range[0];
        let rangeEnd = this.slider.options.range[1];
        if(this.slider.options.dataType === 'date') {
            rangeStart = this.convertDateToAttr(rangeStart);
            rangeEnd = this.convertDateToAttr(rangeEnd);
        }
        this.group.querySelector('[name="range-start"]').value = rangeStart;
        this.group.querySelector('[name="range-end"]').value = rangeEnd;
    }
}

class RangeArrayGr extends FromGroup {
    constructor(slider) {
        super('Диапазон', slider);
        this.group.append(
            this.createLabelInput('Массив (разделитель "|")', ['name="range-array"', 'data-action=optionChange']),
        );
        this.setValue();
    }
    setValue() {
        const val = this.slider.options.range.join('|');
        this.group.querySelector('[name="range-array"]').value = val;
    }
}
class StepGr extends FromGroup {
    constructor(slider) {
        super('', slider);
        this.group.append(
            this.createLabelInput('Шаг', ['name="step"', 'data-action=optionChange']),
        );
        this.setValue();
    }
    setValue() {
        this.group.querySelector('[name="step"]').value = this.slider.options.step;;
    }
}
class AffixGr extends FromGroup {
    constructor(slider) {
        super('Префикс и постфикс', slider);
        this.group.append(
            this.createLabelInput('Префикс', ['name="tagsPrefix"', 'data-action=optionChange']),
            this.createLabelInput('Постфикс', ['name="tagsPostfix"', 'data-action=optionChange']),
        );
        this.setValue();
    }
    setValue() {
        this.group.querySelector('[name="tagsPrefix"]').value = this.slider.options.tagsPrefix || '';
        this.group.querySelector('[name="tagsPostfix"]').value = this.slider.options.tagsPostfix || '';
    }
}
class HandlesGr extends FromGroup {
    constructor(slider) {
        super('Бегунки', slider);
        this.init();
        this.updateHandlesSelect(slider.options);
        this.setValue();
    }

    setValue() {
        const handles = this.group.querySelectorAll('[name="handles"][data-action=optionChange]')
        for(let id in this.slider.options.handles) {
            const elem = this.group.querySelector(`[name="handles"][data-action=optionChange][data-id="${id}"]`);
            let val = this.slider.options.handles[id];
            if(this.slider.options.dataType === 'date') {
                val = this.convertDateToAttr(val);
            }
            elem.value = val;
        }
    }
    updateHandlesSelect(sliderOptions) {
        if(this.slider.options.dataType !== 'array') return;

        const optionsValues = sliderOptions.range.map((elem, index) => {
            return {value: index, content: elem}
        });

        this.group.querySelectorAll('select[name="handles"]')
            .forEach(select => this.renderSelectOptions(select, optionsValues));
    }
    init() {
        const dataType = this.slider.options.dataType;
        const sliderRange = this.slider.options.range;

        this.handleSubsContainer = document.createElement('div');

        for(let id in this.slider.options.handles) {
            this.createHandleSubgroup(dataType, id, sliderRange);
        }

        this.group.append(this.handleSubsContainer, this.createExpandSubgroup(dataType, sliderRange));
    }
    removeHandleSub(id) {
        this.handleSubsContainer
            .querySelector(`[data-id="${id}"]`).remove();
    }
    createHandleSubgroup(dataType, id, sliderRange) {
        const sub = this.createFormSubgroup(id);
        sub.dataset.id = id;
        sub.append(
            dataType === 'array' ? 
                this.createLabelSelect('Начальное значение', [
                    'name="handles"',
                    `data-id="${id}"`,
                    'data-action=optionChange',
                ]) : 
                this.createLabelInput('Начальное значение', [
                    `name="handles"`,
                    `data-id="${id}"`,
                    'data-action=optionChange',
                    dataType === 'date' ? 'type="date"' : null
                ]),
            this.createRemoveBtn({handleId: id})
        );

        this.handleSubsContainer.append(sub);
    }
    createExpandSubgroup(dataType, sliderRange) {
        const addSub = this.createFormSubgroup('Добавить бегунок');
        addSub.append(
            this.createLabelInput('ID', [`data-add="id"`]),
            dataType === 'array' ? 
                this.createLabelSelect('Начальное значение', ['name="handles"']) :
                this.createLabelInput('Начальное значение', [
                    'data-add="value"',
                    dataType === 'date' ? 'type="date"' : null
                ]),
            this.createAddBtn({btn: 'add'})
        )
        return addSub;
    }
}
class ProgressBarsGr extends FromGroup {
    constructor(slider) {
        super('Progress bars', slider);
        this.init();
        this.updateValidAnchorsSelect(slider.options);
    }
    updateValidAnchorsSelect(sliderOptions) {
        const validAnchors = this.slider.validator.unessentialOptions
            .find(option => option.name === 'progressBars').valid
            .map(anchor => {
                return {value: anchor, content: anchor};
            });

        this.group.querySelectorAll('select[name="progressBars"]')
            .forEach(select => this.renderSelectOptions(select, validAnchors));
    }
    init() {
        const validAnchors = this.slider.validator.unessentialOptions
            .find(option => option.name === 'progressBars').valid
            .map(anchor => {
                return {value: anchor, content: anchor};
            });

        this.barsContainer = document.createElement('div');

        if(this.slider.options.progressBars) {
            this.slider.options.progressBars.forEach(bar => this.createBarSubgroup(bar))
        }
        this.group.append(this.barsContainer, this.createExpandSubgroup(validAnchors));
    }
    removeBarSubgroup(bar){
        const id = bar[0] + '_' + bar[1];
        this.barsContainer.querySelector(`[data-id="${id}"]`).remove();
    }
    createBarSubgroup(bar) {
        const id = bar[0] + '_' + bar[1];
        const sub = this.createFormSubgroup(id);
        sub.dataset.id = id;
        sub.append(this.createRemoveBtn({anchor1: bar[0], anchor2: bar[1]}));

        this.barsContainer.append(sub);
    }
    createExpandSubgroup(validAnchors) {
        const sub = this.createFormSubgroup('Добавить progress bar');
        sub.append(
            this.createLabelSelect('Начальный id', ['name="progressBars"']),
            this.createLabelSelect('Конечный id', ['name="progressBars"']),
            this.createAddBtn({btn: 'add'})
        );
        return sub;
    }
}
class StepMeasureGr extends FromGroup {
    constructor(slider) {
        super('Размерность шага', slider);
        const commonAttrs = ['type="radio"', 'name="stepMeasure"', 'data-action=optionChange'];
        this.group.append(
            this.createLabelInput('День', ['value="day"'].concat(commonAttrs)),
            this.createLabelInput('Месяц', ['value="month"'].concat(commonAttrs)),
            this.createLabelInput('Год', ['value="year"'].concat(commonAttrs)),
        );
        this.setValue();
    }
    setValue() {
        this.setRadioCheck('stepMeasure');
    }
}
class IsVerticalGr extends FromGroup {
    constructor(slider) {
        super('Ориентация', slider);
        const commonAttrs = ['type="radio"', 'name="isVertical"', 'data-action=optionChange'];
        this.group.append(
            this.createLabelInput('Вертикальная', ['value="true"'].concat(commonAttrs)),
            this.createLabelInput('Горизонтальная', ['value="false"'].concat(commonAttrs)),
        );
        this.setValue();
    }
    setValue() {
        this.setRadioCheck('isVertical');
    }
}
class NeighborHandlesGr extends FromGroup {
    constructor(slider) {
        super('Поведение соседних бегунков при одинаковых значениях', slider);
        const commonAttrs = ['type="radio"', 'name="neighborHandles"', 'data-action=optionChange'];
        this.group.append(
            this.createLabelInput('Не мешать', ['value="jumpover"'].concat(commonAttrs)),
            this.createLabelInput('Двигаться', ['value="move"'].concat(commonAttrs)),
            this.createLabelInput('Останавливать', ['value="stop"'].concat(commonAttrs)),
        );
        this.setValue();
    }
    setValue() {
        this.setRadioCheck('neighborHandles');
    }
}
class TagsPositionsGr extends FromGroup {
    constructor(slider) {
        super('Ярлыки', slider);
        const commonAttrs = ['type="radio"', 'name="tagsPositions"', 'data-action=optionChange'];
        this.group.append(
            this.createLabelInput('Не показывать', ['value="false"'].concat(commonAttrs)),
            this.createLabelInput('Сверху', ['value="top"'].concat(commonAttrs)),
            this.createLabelInput('Снизу', ['value="bottom"'].concat(commonAttrs)),
            this.createLabelInput('Справа', ['value="right"'].concat(commonAttrs)),
            this.createLabelInput('Слева', ['value="left"'].concat(commonAttrs)),
        );
        this.setValue();
    }
    setValue() {
        this.setRadioCheck('tagsPositions');
    }
}
