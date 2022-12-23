'use strict'

class Configurator2 {
    constructor(slider, container) {
        this.slider = slider;
        this.configContainer = container;

        this.model = new ConfiguratorModel(slider);
        this.view = new ConfiguratorView(slider, container)
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
            new StepGr(),
            new IsVerticalGr(),
            new NeighborHandlesGr(),
            new TagsPositionsGr(),
            new AffixGr(),
            new HandlesGr(this.slider),
            new ProgressBarsGr(this.slider)
        ];

        if(this.slider.options.dataType === 'number') {
            this.formGroups.unshift(new RangeGr(this.slider.options));
        }
        if(this.slider.options.dataType === 'date') {
            this.formGroups.unshift(new RangeGr(this.slider.options), new StepMeasureGr);
        }
        if(this.slider.options.dataType === 'array') {
            this.formGroups.unshift(new RangeArrayGr());
        }
        return this.formGroups;
    }

}
class FromGroup {
    constructor(title) {
        this.group = this.createFormGroup(title);
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
            <select ${attr.join(' ')}>
                ${optionsValues.map(value => 
                    `<option value="${value}">${value}</option>`
                ).join('')}
            </select>
        `

        return lab;

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
}
class RangeGr extends FromGroup {
    constructor(sliderOptions) {
        super('Диапазон');
        const inputTypeAttr = sliderOptions.dataType === 'date' ? 'type="date"' : 'type="text"'
        this.group.append(
            this.createLabelInput('Минимум', ['name="range-start"', inputTypeAttr, 'data-option=true']),
            this.createLabelInput('Максимум', ['name="range-end"', inputTypeAttr, 'data-option=true'])
        );
    }
}

class RangeArrayGr extends FromGroup {
    constructor() {
        super('Диапазон');
        this.group.append(
            this.createLabelInput('Массив (разделитель "|")', ['name="range-array"', 'data-option=true']),
        );
    }
}
class StepGr extends FromGroup {
    constructor() {
        super('');
        this.group.append(
            this.createLabelInput('Шаг', ['name="step"', 'data-option=true']),
        );
    }
}
class AffixGr extends FromGroup {
    constructor() {
        super('Префикс и постфикс');
        this.group.append(
            this.createLabelInput('Префикс', ['name="tagsPrefix"', 'data-option=true']),
            this.createLabelInput('Постфикс', ['name="tagsPostfix"', 'data-option=true']),
        );
    }
}
class HandlesGr extends FromGroup {
    constructor(slider) {
        super('Бегунки');
        this.init(slider.options);
    }

    init(sliderOptions) {
        const dataType = sliderOptions.dataType;
        const sliderRange = sliderOptions.range;

        this.handleSubsContainer = document.createElement('div');

        for(let id in sliderOptions.handles) {
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
                this.createLabelSelect('Начальное значение', ['name="handles"'], sliderRange) : 
                this.createLabelInput('Начальное значение', [
                    `name="handles"`,
                    `data-id="${id}"`,
                    'data-option=true',
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
                this.createLabelSelect('Начальное значение', ['name="handles"'], sliderRange) :
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
        super('Progress bars');
        this.init(slider);
    }
    init(slider) {
        const validAnchors = slider.validator.unessentialOptions
            .find(option => option.name === 'progressBars').valid;

        this.barsContainer = document.createElement('div');

        if(slider.options.progressBars) {
            slider.options.progressBars.forEach(bar => this.createBarSubgroup(bar))
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
            this.createLabelSelect('Начало', ['name="progressBars"'], validAnchors),
            this.createLabelSelect('Конец', ['name="progressBars"'], validAnchors),
            this.createAddBtn({btn: 'add'})
        );
        return sub;
    }
}
class StepMeasureGr extends FromGroup {
    constructor() {
        super('Размерность шага');
        const commonAttrs = ['type="radio"', 'name="stepMeasure"', 'data-option=true'];
        this.group.append(
            this.createLabelInput('День', ['value="day"'].concat(commonAttrs)),
            this.createLabelInput('Месяц', ['value="month"'].concat(commonAttrs)),
            this.createLabelInput('Год', ['value="year"'].concat(commonAttrs)),
        );
    }
}
class IsVerticalGr extends FromGroup {
    constructor() {
        super('Ориентация');
        const commonAttrs = ['type="radio"', 'name="isVertical"', 'data-option=true'];
        this.group.append(
            this.createLabelInput('Вертикальная', ['value="true"'].concat(commonAttrs)),
            this.createLabelInput('Горизонтальная', ['value="false"'].concat(commonAttrs)),
        );
    }
}
class NeighborHandlesGr extends FromGroup {
    constructor() {
        super('Поведение соседних бегунков при одинаковых значениях');
        const commonAttrs = ['type="radio"', 'name="neighborHandles"', 'data-option=true'];
        this.group.append(
            this.createLabelInput('Не мешать', ['value="jumpover"'].concat(commonAttrs)),
            this.createLabelInput('Двигаться', ['value="move"'].concat(commonAttrs)),
            this.createLabelInput('Останавливать', ['value="stop"'].concat(commonAttrs)),
        );
    }
}
class TagsPositionsGr extends FromGroup {
    constructor() {
        super('Ярлыки');
        const commonAttrs = ['type="radio"', 'name="tagsPositions"', 'data-option=true'];
        this.group.append(
            this.createLabelInput('Не показывать', ['value="false"'].concat(commonAttrs)),
            this.createLabelInput('Сверху', ['value="top"'].concat(commonAttrs)),
            this.createLabelInput('Снизу', ['value="bottom"'].concat(commonAttrs)),
            this.createLabelInput('Справа', ['value="right"'].concat(commonAttrs)),
            this.createLabelInput('Слева', ['value="left"'].concat(commonAttrs)),
        );
    }
}
