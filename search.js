(
()=>{
    const searchEBook = {
        info: document.querySelector('#info'),
        bookName: document.querySelector('[property="v:itemreviewed"]').textContent.trim(),
        root: document.createElement('div'),
        searchBtn: document.createElement('button'),
        selectBox: document.createElement('select'),
        url: '',

        init(){
            
            const zLibOption = new Option('Z-library','0',true,true)
            const annasArchiveOption = new Option("Anna's Archive",'1')
            
            this.root.className = 'search-for-ebook-ext-root'
            this.searchBtn.className = 'search-btn'
            this.selectBox.className = 'search-select-box'
            this.searchBtn.innerHTML = '搜索'
            
            this.selectBox.addEventListener('change', (e)=>{ this.setURL(e) })
            this.searchBtn.addEventListener('click',()=>{ this.searchOnURL() });
            
            this.root.appendChild(this.selectBox);
            this.root.appendChild(this.searchBtn);
            this.selectBox.appendChild(zLibOption)
            this.selectBox.appendChild(annasArchiveOption)
            
            this.info.appendChild(this.root);

            this.setURL({target:this.selectBox});

            console.log(this.url)
        },
        
        setURL(e){
            const value = e.target.value;
            switch (value){
                case '0': this.url = `https://z-library.ec/s/${encodeURIComponent(this.bookName)}?extensions%5B%5D=PDF`;return;
                case '1': this.url = `https://yue.annas-archive.org/search?index=&page=1&sort=&ext=pdf&display=&q=${encodeURIComponent(this.bookName)}`
                    return;
                default: this.url = `https://z-library.ec/s/${encodeURIComponent(this.bookName)}?extensions%5B%5D=PDF`;return;
            }
        },

        searchOnURL(){
            window.open(this.url,'_blank');
            
        },

    }
    
    searchEBook.init();

}
)();