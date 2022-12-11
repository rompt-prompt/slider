'use strict'

const nav = document.querySelector('.nav');
const pages = document.querySelectorAll('.page');
const demoSliders = [
    {
        name: 'slider1',
        mode: 'select',
        dataType: 'number',
        range: [0, 170],
        step: 10,
        handles: {
            'min': 5,
            'max': 100,
        },
        progressBars: [['min', 'max']],
        neighborHandles: 'jumpover',
        tagsPositions: 'right',
        tagsPostfix: ' ₽',
        isVertical: true
    },
    // {
    //     name: 'slider2',
    //     mode: 'select',
    //     dataType: 'date',
    //     range: [new Date('2021-01-01'), new Date('2021-12-31')],
    //     step: 1,
    //     stepMeasure: 'month',
    //     handles: {
    //         '1': new Date('2021-02-28'),
    //         '2': new Date('2021-10-31')
    //     },
    //     neighborHandles: 'move',
    //     isVertical: false,
    //     progressBars: [
    //         ['sliderstart', '1'], ['sliderend', '2']
    //     ],
    //     tagsPositions: ['top', {2: 'bottom'}],
    //     handlesTextContent: {
    //         1: '1', 2: '2'
    //     },
    // },
    // {
    //     name: 'slider3',
    //     mode: 'select',
    //     dataType: 'array',
    //     range: ['Австралия', 'Австрия', 'Азербайджан', 'Албания', 
    //     'Алжир', 'Ангола', 'Андорра', 'Антигуа и Барбуда', 'Аргентина', 'Армения'],
    //     step: 1,
    //     handles: {
    //         '1': 1,
    //         '2': 2,
    //         '3': 3,
    //         '4': 4,
    //         '5': 5,
    //         '6': 6,
    //         // '7': 7,
    //         '8': 8,
    //     },
    //     neighborHandles: 'jumpover',
    //     tagsPositions: 'top',
    // },
    // {
    //     name: 'slider4',
    //     mode: 'select',
    //     dataType: 'array',
    //     range: ['Австралия', 'Австрия'],
    //     step: 1,
    //     handles: {
    //         '1': 0
    //     },
    //     tagsPositions: 'top',
    //     isVertical: true,
    // }
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
        this.configurator = new Configurator(this.slider, this.configContainer)
    }
    createTemplate() {
        this.container = this.createElem(this.page, 'div', ['demo-container', 'card']);
        this.sliderRoot = this.createElem(this.container, 'div', ['slider-container']);
        
        this.createOutput();
        this.configContainer = this.createElem(this.container, 'div', ['config']);
    }

    createOutput() {
        this.outputs = {};
        this.outputContainer = this.createElem(this.container, 'div', ['output']);
        
        for(let id in this.options.handles) {
            const handleElem = this.createElem(this.outputContainer, 'div', ['output__handle', 'handle']);
            const handleNameElem = this.createElem(handleElem, 'span', ['handle__name']);
            handleNameElem.textContent = id;
            this.outputs[id] = this.createElem(handleElem, 'span', ['handle__value']);
        }
    }

    createElem(parent, tag, cls, dataset) {
        const elem = document.createElement(tag);
        if(cls) elem.classList.add(...cls);
        if(dataset) elem.dataset = dataset;
        parent.append(elem);

        return elem;
    }

    renderOutput(obj) {
        for(let id in obj) {
            this.outputs[id].textContent = obj[id];
        }
    }
}

demoSliders.forEach(demo => {
    const page = getPage(demo.dataType);
    window[demo.name] = new Demo(page, demo)
})