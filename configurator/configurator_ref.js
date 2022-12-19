'use strict'

class Configurator2 {
    constructor(slider, container) {
        this.slider = slider;
        this.configContainer = container;

        this.model = new ConfiguratorModel(slider);
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
