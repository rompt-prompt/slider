'use strict'

const nav = document.querySelector('.nav');
const pages = document.querySelectorAll('.page');
const configBtn = nav.querySelector('.config-btn');
const demoSliders = [
    {
        name: 'slider1',
        mode: 'select',
        dataType: 'number',
        range: [0, 42000],
        step: 1000.5,
        handles: {
            'min': 10000,
            'max': 30000,
        },
        progressBars: [
            ['min', 'max'],
        ],
        neighborHandles: 'jumpover',
        tagsPositions: ['right', {min: 'left'}],
        tagsPostfix: ' ₽',
        isVertical: true,
    },
    {
        name: 'slider2',
        mode: 'select',
        dataType: 'date',
        range: [new Date('2021-01-01'), new Date('2023-12-31')],
        step: 1,
        stepMeasure: 'month',
        handles: {
            'Date1': new Date('2021-02-28'),
            'Date2': new Date('2022-10-31'),
            'Date3': new Date('2023-10-30')
        },
        neighborHandles: 'move',
        isVertical: false,
        progressBars: [
            ['sliderstart', 'Date1'], ['sliderend', 'Date2']
        ],
        tagsPositions: ['top', {'Date2': 'bottom'}],
    },
    {
        name: 'slider3',
        mode: 'select',
        dataType: 'array',
        range: ['😀', '🎿',  '😕', '🚀', '😁', '😅', '😎', '⛄'],
        step: 1,
        handles: {
            'Selected': 0
        },
        tagsPositions: 'top',
    }
]

nav.onclick = event => {
    const link = event.target.dataset.link || event.target.parentElement.dataset.link;
    if(!link) return;
    pages.forEach(page => {
        page.dataset.link === link ? 
            page.classList.add('page_active') : 
            page.classList.remove('page_active');
    })
}

configBtn.onclick = event => {
    const config = document.querySelector('.page_active .config');
    const overlay = document.querySelector('.overlay');
    const overlayHandler = event => {
        if(event.target !== overlay) return;
        toggleConfig();
        document.removeEventListener('click', overlayHandler);
    }
    const toggleConfig = () => {
        config.classList.toggle('config_mobile-show');
        document.body.classList.toggle('show-overlay');
    }

    toggleConfig();
    document.addEventListener('click', overlayHandler)
}

function getPage (dataType) {
    return Array.from(pages).find(page => 
        page.dataset.link === dataType);
}

class Demo {
    constructor(page, options) {
        this.page = page;
        this.options = options;
        this.init();
    }
    init() {
        this.createTemplate();
        this.options.root = this.sliderRoot;

        this.page.style.display = 'flex';
        this.slider = new SliderController(this.options, this.renderOutput.bind(this));
        this.page.style.display = '';
        this.configurator = new Configurator(this.slider, this.configContainer);

        this.renderOutput(this.slider.getValues());
    }
    createTemplate() {
        this.container = this.createElem(this.page, 'div', ['demo-container', 'card']);
        this.sliderRoot = this.createElem(this.container, 'div', ['slider-container']);
        this.outputContainer = this.createElem(this.container, 'div', ['output']);
        this.configContainer = this.createElem(this.container, 'div', ['config']);
    }

    createOutput(id, value) {
        const handleContainer = this.createElem(undefined, 'div', ['output__handle', 'handle']);
        handleContainer.innerHTML = `
            <span class="handle__name">${id}</span>
            <span class="handle__value">${value}</span>
        `
        return handleContainer;
    }

    createElem(parent, tag, cls, dataset) {
        const elem = document.createElement(tag);
        if(cls) elem.classList.add(...cls);
        if(dataset) {
            for(let name in dataset) {
                elem.dataset[name] = dataset[name]
            }
        };
        if(parent) parent.append(elem);

        return elem;
    }

    renderOutput(obj) {
        this.outputContainer.innerHTML = '';
        for(let id in obj) {
            this.outputContainer.append(this.createOutput(id, obj[id]));
        }
    }
}

demoSliders.forEach(demo => {
    const page = getPage(demo.dataType);
    window[demo.name] = new Demo(page, demo)
})