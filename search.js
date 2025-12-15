(
()=>{
    'use strict'
    const SITES = {
        zlib: {
            label:'Z-library',
            type:['book'],
            buildUrl: (title)=>{
                return `https://z-library.ec/s/${encodeURIComponent(title)}?&extensions%5B%5D=PDF`
            }
        },
        anna: {
            label:"Anna's Archive",
            type:['book'],
            buildUrl: (title)=>{
                return `https://yue.annas-archive.org/search?index=&page=1&sort=&ext=pdf&display=&q=${encodeURIComponent(title)}`
            }
        },
        cineb: {
            label: "cineb",
            type:['movie'],
            buildUrl: (title) => {        
                title = title.split(' ').join('-');
                return `https://cineb.gg/search/${title}`;
                // return `https://cineb.gg/search/${encodeURIComponent(slugify(title))}`;
            },
        },
    }

    const plugin = {
        root: null,
        siteSelect: null,
        langSelect: null,
        searchBtn: null,
        info: null,
        type: '',
        title: '', // 搜索时确定
        url: '',

        init(){
            this.createDom()
        },

         createDom(){
            
            this.info = document.querySelector('#info');
            this.root = document.createElement('div');
            this.siteSelect = document.createElement('select');
            this.langSelect = document.createElement('select');
            this.searchBtn = document.createElement('button');
            this.type = this.getPageType();

            this.root.className = 'douban-search-ext-root';
            this.siteSelect.className = 'site-select-box';
            this.langSelect.className = 'lang-select-box';
            this.searchBtn.className = 'search-btn';
            this.searchBtn.textContent = '搜索'

            this.root.appendChild(this.siteSelect);
            if (this.type === 'book') {
                this.root.appendChild(this.langSelect);    
                this.langSelect.appendChild(new Option('当前书名','title',true,true))
                this.langSelect.appendChild(new Option('原作名','origin'))
            }
            this.root.appendChild(this.searchBtn);
            this.siteSelect.appendChild(this.buildSiteOpts(this.type));       
            
            this.searchBtn.addEventListener('click', ()=>{ 
                this.title = this.getSearchTitle()
                const url = SITES[this.siteSelect.value].buildUrl(this.title);
                console.log(url)
                window.open(url, '_blank');
            });
            
            
            this.info.appendChild(this.root)
            
        },

        getPageType(){
            const href = window.location.href;
            if (href.includes('book')) return 'book';
            else if (href.includes('movie')) return 'movie';
        },

        buildSiteOpts(type){
            const entries = Object.entries(SITES).filter(([,site])=>site.type.includes(type))
            const fragment = document.createDocumentFragment();
            for (const [site,info] of entries){
                fragment.appendChild(new Option(info.label,site))
            }
            return fragment
        },

        getSearchTitle(){
            
            if (this.type === 'movie') {
                return this.getMovieTitle();
            } else if (this.type === 'book') {
                return this.getBookTitle();
            }
        },
        
        getMovieTitle(){
            const raw = document.querySelector('[property="v:itemreviewed"]').textContent
            const match = raw.match(/[A-Za-z][A-Za-z0-9\s:'".\-–—]+/);
            return match ? match[0].replace(/\(\d{4}\).*$/, '').trim() : raw;
        },

        getBookTitle(){
            const lang = this.langSelect.value;
            switch(lang){
                case 'title':
                    return document.querySelector('[property="v:itemreviewed"]').textContent;
                case 'origin':
                    const span = Array.from(document.querySelectorAll('span.pl'))
                                    .find(s => s.textContent.trim() === '原作名:');
                    if (span) {
                        let node = span.nextSibling;
                        while (node && node.nodeType !== Node.TEXT_NODE) {
                            node = node.nextSibling;
                        }
                        return node ? node.textContent.trim() : '';
                    }
            }
        },

    }

    plugin.init()

}
)();