'use strict'

const nav = document.querySelector('.nav');
const pages = document.querySelectorAll('.page');
const demoSliders = [
    {
        name: 'slider1',
        mode: 'select',
        dataType: 'number',
        range: [0, 100],
        step: 1,
        handles: {
            '1': 1,
            '2': 5,
        },
        neighborHandles: 'jumpover',
        tagsPositions: 'top',
    },
    {
        name: 'slider2',
        mode: 'select',
        dataType: 'date',
        range: [new Date('2021-01-01'), new Date('2021-12-31')],
        step: 1,
        stepMeasure: 'month',
        handles: {
            '1': new Date('2021-02-28'),
            '2': new Date('2021-10-31')
        },
        neighborHandles: 'move',
        isVertical: false,
        progressBars: [
            ['sliderstart', '1'], ['sliderend', '2']
        ],
        tagsPositions: ['top', {2: 'bottom'}],
        handlesTextContent: {
            1: 'first', 2: 'second'
        },
        tagsPrefix: '$',
        tagsPostfix: 'P'
    },
    {
        name: 'slider3',
        mode: 'select',
        dataType: 'array',
        range: ['Австралия', 'Австрия', 'Азербайджан', 'Албания', 
        'Алжир', 'Ангола', 'Андорра', 'Антигуа и Барбуда', 'Аргентина', 'Армения'],
        step: 1,
        handles: {
            '1': 3,
            '2': 8
        },
        neighborHandles: 'stop',
        tagsPositions: 'top',
    },
    {
        name: 'slider4',
        mode: 'select',
        dataType: 'array',
        range: ['Австралия', 'Австрия'],
        step: 1,
        handles: {
            '1': 0
        },
        tagsPositions: 'top',
        isVertical: true,
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

function getPage (dataType) {
    return Array.from(pages).find(page => 
        page.dataset.link === dataType);
}

class Demo {
    constructor(page, options) {
        this.page = page;
        this.options = options;
        this.createDemo();
    }
    createDemo() {
        const demoElems = this.createTemplate();
    
        this.options.root = demoElems.root;
        this.page.style.display = 'flex';
        this.slider = new SliderController(this.options);
        this.page.style.display = '';
    }
    createTemplate() {
        const container = this.createElem('div', ['demo-container', 'card']);
        const sliderRoot = this.createElem('div', ['slider']);
        const output = this.createElem('div', ['output']);
        const config = this.createElem('div', ['config']);
    
        container.append(sliderRoot, output, config);
        this.page.append(container);
        this.output = output
        return {root: sliderRoot, output, config};
    }

    createElem(tag, cls) {
        const elem = document.createElement(tag);
        elem.classList.add(...cls);

        return elem;
    }
}

demoSliders.forEach(demo => {
    const page = getPage(demo.dataType);
    window[demo.name] = new Demo(page, demo)
})