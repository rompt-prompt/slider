'use strict'

class Configurator {
    constructor(slider, container) {
        this.slider = slider;
        this.configContainer = container;

        this.createConfigInstances();
        this.createForm();
        this.form.onchange = (event) => {
            this.onChange(event.target);
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

    onChange(target) {
        let optionsBackUp = Object.assign({}, this.slider.options)
        let name = target.name
        this.config.find(option => {
            if(option.optionName === name) {
                option.update()
                if(this.slider.validator.isValidOptions(this.slider.options)) {
                    this.slider.reset()
                } else {
                    this.slider.options = Object.assign(this.slider.options, optionsBackUp);
                    option.setValueAttr();
                    console.log(this.slider.validator.errors); // TODO in div output
                }
            }
        })
        

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
        const limits = this.calcLimits(slider);
        this.min = new Input(this.elem, 'Минимум', {
            name: this.optionName,
            type: slider.options.dataType,
            // value: slider.options.range[0],
            max: limits.min
        });
        this.max = new Input(this.elem, 'Максимум', {
            name: this.optionName,
            type: slider.options.dataType,
            // value: slider.options.range[1],
            min: limits.max
        });
        this.setValueAttr();
    }

    setValueAttr() {
        switch(this.slider.options.dataType) {
            case 'date':
                this.min.value = this.slider.typeHandler.formatDate(this.slider.options.range[0])
                this.max.value = this.slider.typeHandler.formatDate(this.slider.options.range[1])
                break;
            case 'number':
                this.min.value = this.slider.options.range[0];
                this.max.value = this.slider.options.range[1];
                break;
        }
    }

    update() {
        console.log(this.min.value, this.max.value)
        this.slider.options.range = [+this.min.value, +this.max.value];
        switch(this.slider.options.dataType) {
            case 'date':
                this.slider.options.range = [new Date(this.min.value), new Date(this.max.value)];
                break;
            case 'number':
                this.slider.options.range = [+this.min.value, +this.max.value];
                break;
        }
    }

    calcLimits(slider) {
        const minCore = slider.model.getClosestId(0);
        const maxCore = slider.model.getClosestId(100);

        let min = slider.model.cores[minCore].verbalValue;
        let max = slider.model.cores[maxCore].verbalValue;

        return {min, max}
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