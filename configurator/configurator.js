'use strict'

class Configurator {
    constructor(slider, container) {
        this.slider = slider;
        this.configContainer = container;

        this.createConfigInstances();
        this.createForm();
        this.form.onsubmit = () => false;
        this.form.onkeyup = (event) => {
            if(event.key === 'Enter') {
                this.onChange(event.target);
                event.target.blur();
            }
        }
        this.form.onchange = (event) => {
            this.onChange(event.target);
        };
    }

    createForm() {
        this.form = document.createElement('form');
        this.configContainer.append(this.form);

        this.config.forEach(option => {
            this.form.append(this.createFormGroup(option.groupTitle, option.elements))
        });
    }

    createFormGroup(title, elements) {
        const group = document.createElement('div');
        group.classList.add('config__group', 'group');
        group.innerHTML = `
            <h3 class="group__name">${title}</h3>
        `;

        elements.forEach(elem => group.append(elem));

        return group;
    }

    createConfigInstances() {
        this.config = [
            
            new Option(this.slider, 'step', 'Шаг', [
                {
                    attributes: {type: 'number', value: this.slider.options.step},
                },
            ], (val) => +val),
            new RadioOption(this.slider, 'isVertical', 'Ориентация', [
                {
                    title: 'Вертикальная', 
                    attributes: {value: true}
                },
                {
                    title: 'Горизонтальная', 
                    attributes: {value: false}
                }
            ], val => val === 'true' && !(val === 'false')
            ),
            new RadioOption(this.slider, 'neighborHandles', 'Поведение соседних бегунков при одинаковых значениях', [
                {
                    title: 'Не мешать', 
                    attributes: {value: 'jumpover'}
                },
                {   title: 'Двигаться', 
                    attributes: {value: 'move'}
                },
                {   title: 'Останавливать', 
                    attributes: {value: 'stop'}
                },
            ]),
            new RadioOption(this.slider,'tagsPositions', 'Ярлыки', [
                {
                    title: 'Не показывать', 
                    attributes: {value: false}
                },
                {   
                    title: 'Сверху', 
                    attributes: {value: 'top'}
                },
                {   
                    title: 'Снизу', 
                    attributes: {value: 'bottom'}
                },
                {   
                    title: 'Справа', 
                    attributes: {value: 'right'}
                },
                {
                    title: 'Слева', 
                    attributes: {value: 'left'}
                },
            ]),
            new Option(this.slider, 'tagsPrefix', 'Префикс', [
                {
                    attributes: {value: this.slider.options.tagsPrefix || ''}
                },
            ]),
            new Option(this.slider, 'tagsPostfix', 'Постфикс', [
                {
                    attributes: {value: this.slider.options.tagsPostfix || ''}
                },
            ]),
        ];

        if(this.slider.options.dataType === 'number') {
            this.config.unshift(
                new RangeOption(this.slider),
            )
        }

        if(this.slider.options.dataType === 'date') {
            this.config.unshift(
                new RangeOption(this.slider),
                new RadioOption(this.slider, 'stepMeasure', 'Размерность шага', [
                    {
                        title: 'День', 
                        attributes: {value: 'day'}
                    },
                    {
                        title: 'Месяц', 
                        attributes: {value: 'month'}
                    },
                    {
                        title: 'Год', 
                        attributes: {value: 'year'}
                    }
                ])
            )
        }
        if(this.slider.options.dataType === 'array') {
            this.config.unshift(
                new RangeArrayOption(this.slider),
            )
        }
    }

    calcRangeLimits(slider) {
        const minCore = slider.model.getClosestId(0);
        const maxCore = slider.model.getClosestId(100);

        let min = slider.model.cores[minCore].verbalValue;
        let max = slider.model.cores[maxCore].verbalValue;

        return {min, max}
    }

    onChange(target) {
        let optionsBackUp = Object.assign({}, this.slider.options)

        // this.config.find(option => {
        //     if(option.optionName === name) {
        //         option.update()
        //         if(this.slider.validator.isValidOptions(this.slider.options)) {
        //             this.slider.reset()
        //         } else {
        //             this.slider.options = Object.assign(this.slider.options, optionsBackUp);
        //             option.setValueAttr();
        //             console.log(this.slider.validator.errors); // TODO in div output
        //         }
        //     }
        // })
        this.config.find(option => {
            if(option.optionName === target.name) {
                option.update(target).then(this.slider.reset());
            }
        })
    }

}
class Option {
    constructor(slider, optionName, groupTitle, inputs, converter) {
        this.groupTitle = groupTitle;
        this.optionName = optionName;
        this.slider = slider;
        this.converter = converter;
        this.createInputs(inputs);
    }

    createInputs(inputs) {
        this.elements = [];
        inputs.forEach(input => {
            const labelElem = document.createElement('label');
            labelElem.classList.add('option');
            input.title ? labelElem.innerHTML = `<span class="option__name">${input.title}</span>` : null;

            const inputElem = document.createElement('input');
            for(let attr in input.attributes) {
                inputElem.setAttribute(attr, input.attributes[attr]);
            }
            inputElem.setAttribute('name', this.optionName)
            labelElem.append(inputElem);

            this.elements.push(labelElem)
        })
    }
    update(target, value) {
        let val = target.value || value;
        if(this.converter) val = this.converter(val);
        return new Promise(resolve => this.slider.options[this.optionName] = val);
    }
}
class RangeOption extends Option {
    constructor(slider) {
        const optionName = 'range';
        const groupTitle = 'Диапазон';
        const calcLimit = (pcnt) => {
            return slider.model.cores[slider.model.getClosestId(pcnt)].verbalValue;
        };
        const formatValue = (value) => {
            return slider.options.dataType === 'date' ?
                        slider.typeHandler.formatDate(value) :
                        +value;
        }
        const type = slider.options.dataType === 'date' ? 'date' : 'number';

        const inputs = [
            {
                title: 'Минимум', 
                attributes: {
                    type, 'data-range': 'start', 
                    value: formatValue(slider.options.range[0]), max: calcLimit(0),
                }
            }, 
            {
                title: 'Максимум', 
                attributes: {
                    type, 'data-range': 'end', 
                    value: formatValue(slider.options.range[1]), min: calcLimit(100),
                }
            }
        ]
        if(type === 'number') inputs.forEach(input => {
            Object.assign(input.attributes, {step: 0.25})
        })
            
        super(slider, optionName, groupTitle, inputs);
    }

    update(target) {
        const value = 
            this.slider.options.dataType === 'date' ?
            new Date(target.value) :
            this.slider.options.dataType === 'number' ?
            +target.value :
            null;

        return new Promise(resolve => {
            if(target.dataset.range === 'start') this.slider.options.range[0] = value;
            if(target.dataset.range === 'end') this.slider.options.range[1] = value;
        })
        
    }
}

class RangeArrayOption extends Option {
    constructor(slider) {
        const optionName = 'range-array';
        const groupTitle = 'Диапазон';
        const value = slider.options.range.join('|')
        const inputs = [{
            title: 'Массив (разделитель "|")', 
            attributes: {type: 'text', value}
        }]
        super(slider, optionName, groupTitle, inputs)
    }

    update(target) {
        const value = target.value.split('|');
        value.forEach(item => item.trim());

        return new Promise(resolve => {
            this.slider.options.range = value;
        })
    }
}

class RadioOption extends Option {
    constructor(slider, optionName, groupTitle, inputs, converter) {
        const isChecked = inputValue => {
            const current = 
                slider.options[optionName] || 
                slider.validator.unessentialOptions
                    .find(option => option.name === optionName).default;
            return inputValue.toString() === current.toString();
        }
        inputs.forEach(input => {
            Object.assign(input.attributes, {type: 'radio'},
                isChecked(input.attributes.value) ? {checked: true} : null)
        });
        super(slider, optionName, groupTitle, inputs, converter);
        this.setCheckedAttr
    }
}