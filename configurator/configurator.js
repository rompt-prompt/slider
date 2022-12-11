'use strict'

class Configurator {
    constructor(slider, container) {
        this.slider = slider;
        this.configContainer = container;

        this.createConfigInstances();
        this.createForm();
        this.form.onchange = (event) => {
            this.onChange(event.target.name);
        };
    }

    createForm() {
        this.form = document.createElement('form');
        this.configContainer.append(this.form);

        this.config.forEach(option => {
            this.form.append(option.elem)
        });
    }

    createConfigInstances() {
        this.config = [];
        this.config.push(new RangeOption(this.slider))
    }

    onChange(name) {
        this.config.find(option => {
            if(option.optionName === name) {
                option.update()
            }
        })
        this.slider.reset()

    }

}

class ConfigurableOption {
    constructor(slider, optionName, groupTitle) {
        this.optionName = optionName;
        this.slider = slider;
        this.createElement(groupTitle);
    }
    createElement(groupTitle) {
        this.elem = document.createElement('div');
        this.elem.classList.add('config__group', 'group');
        this.elem.innerHTML = `
            <h3 class="group__name">${groupTitle}</h3>
        `
    }
}

class RangeOption extends ConfigurableOption {
    constructor(slider) {
        super(slider, 'range', 'Диапазон');
        this.min = new Input(this.elem, 'Минимум', {
            name: this.optionName,
            type: slider.options.dataType,
            value: slider.options.range[0],
            max: slider.options.range[1]
        });
        this.max = new Input(this.elem, 'Максимум', {
            name: this.optionName,
            type: slider.options.dataType,
            value: slider.options.range[1],
            min: slider.options.range[0]
        });
    }

    update() {
        console.log(+this.min.value, +this.max.value)
        this.slider.options.range = [+this.min.value, +this.max.value];
    }
}

class Input {
    constructor(containerElem, title, attributes) {
        this.createLabel(title);
        this.createInput(attributes);

        this.labelElem.append(this.inputElem);
        containerElem.append(this.labelElem);

        return this.inputElem;
    }
    createLabel(title) {
        this.labelElem = document.createElement('label');
        this.labelElem.classList.add('option');
        title ? this.labelElem.innerHTML = `<span class="option__name">${title}</span>` : null;
    }
    createInput(attributes) {
        this.inputElem = document.createElement('input');
        
        for(let attr in attributes) {
            this.inputElem[attr] = attributes[attr];
        }
    }
}