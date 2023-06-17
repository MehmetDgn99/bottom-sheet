class Mata_BottomSheet {
    constructor(data,name) {
        this.data = data;
        this.name = name;
        this.element = null;
        this.closeHeight = 25;
        this.defaultHeight = 50;
        this.maxHeight = 75;
        this.sheetHeight = 0;
        this._ = document.querySelector.bind(document);
        this.sheet = null
        this.sheetContents = null
        this.draggableArea = null
        this.dragPosition = undefined
    }
    create() {
        let html = 
        `
        <div class="overlay"></div>
            <div class="contents" id="contents-${this.name}">
            <header class="controls">
                <div class="draggable-area" id="draggable-area-${this.name}">
                <div class="draggable-thumb"></div>
                </div>
                <button class="close-sheet" id="close-sheet-${this.name}" type="button" title="Close the sheet">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0,0,256,256"><g fill-opacity="0" fill="#dddddd" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,256v-256h256v256z" id="bgRectangle"></path></g><g fill="#dcdcdc" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(10.66667,10.66667)"><path d="M4.99023,3.99023c-0.40692,0.00011 -0.77321,0.24676 -0.92633,0.62377c-0.15312,0.37701 -0.06255,0.80921 0.22907,1.09303l6.29297,6.29297l-6.29297,6.29297c-0.26124,0.25082 -0.36647,0.62327 -0.27511,0.97371c0.09136,0.35044 0.36503,0.62411 0.71547,0.71547c0.35044,0.09136 0.72289,-0.01388 0.97371,-0.27511l6.29297,-6.29297l6.29297,6.29297c0.25082,0.26124 0.62327,0.36648 0.97371,0.27512c0.35044,-0.09136 0.62411,-0.36503 0.71547,-0.71547c0.09136,-0.35044 -0.01388,-0.72289 -0.27512,-0.97371l-6.29297,-6.29297l6.29297,-6.29297c0.29576,-0.28749 0.38469,-0.72707 0.22393,-1.10691c-0.16075,-0.37985 -0.53821,-0.62204 -0.9505,-0.60988c-0.2598,0.00774 -0.50638,0.11632 -0.6875,0.30273l-6.29297,6.29297l-6.29297,-6.29297c-0.18827,-0.19353 -0.4468,-0.30272 -0.7168,-0.30273z"></path></g></g></svg>
                </button>
            </header>
            <main class="body">
                ${this.data}
            </main>
        </div>
        `
        this.element = document.createElement('mata-bottom-sheet');
        this.element.id = `sheet-${this.name}`;
        this.element.className ='sheet';
        this.element.ariaHidden = true;
        this.element.innerHTML = html;

        document.body.appendChild(this.element);
        this.created = true;
        this.sheet = this._(`#sheet-${this.name}`);
        this.draggableArea = this._(`#draggable-area-${this.name}`);


        // Hide the sheet when clicking the 'close' button
        this.sheet.querySelector(`#close-sheet-${this.name}`).addEventListener("click", () => {
            this.close()
        })

        // Hide the sheet when clicking the background
        this.sheet.querySelector(".overlay").addEventListener("click", () => {
            this.close()
        })

        // Hide the sheet when pressing Escape if the target element
        window.addEventListener("keyup", (event) => {
            const isSheetElementFocused = this.sheet.contains(event.target) && this.isFocused(event.target)
            
            if (event.key === "Escape" && !isSheetElementFocused) {
                this.close()
            }
        })

        this.draggableArea.addEventListener("mousedown", (event) => this.onDragStart(event))
        this.draggableArea.addEventListener("touchstart", (event) => this.onDragStart(event))

        window.addEventListener("mousemove", (event) => this.onDragMove(event))
        window.addEventListener("touchmove", (event) => this.onDragMove(event))

        window.addEventListener("mouseup", (event) => this.onDragEnd(event))
        window.addEventListener("touchend", (event) => this.onDragEnd(event))
    }
    close(){
        this.setIsSheetShown(false)
    }
    remove(){
        let item = this._(`#sheet-${this.name}`)
        this.element = null;
        item.remove();
    }
    open(){
        this.setSheetHeight(Math.min(50, 720 / window.innerHeight * 100))
        this.setIsSheetShown(true)
    }
    setSheetHeight(value){
        this.sheetContents = this._(`#contents-${this.name}`);
        this.sheetHeight = Math.max(0, Math.min(100, value))
        this.sheetContents.style.height = `${this.sheetHeight}vh`
      
        if (this.sheetHeight === 100) {
            this.sheetContents.classList.add("fullscreen")
        } else {
            this.sheetContents.classList.remove("fullscreen")
        }
    }
    setIsSheetShown(isShown) {
        this.sheet = this._(`#sheet-${this.name}`)
        this.sheet.setAttribute("aria-hidden", String(!isShown))
    }

    isFocused(element) {
        document.activeElement === element
    }

    touchPosition(event){
        return event.touches ? event.touches[0] : event
    }
    onDragStart (event) {
        this.dragPosition = this.touchPosition(event).pageY
        this.sheetContents = this._(`#contents-${this.name}`);
        this.draggableArea = this._(`#draggable-area-${this.name}`);

        this.sheetContents.classList.add("not-selectable")
        this.draggableArea.style.cursor = document.body.style.cursor = "grabbing"
        this.draggableArea.style.cursor = document.body.style.overscrollBehaviorY = "contain"
    }
    onDragMove(event) {
        if (this.dragPosition === undefined) return
        
        const y = this.touchPosition(event).pageY
        const deltaY = this.dragPosition - y
        const deltaHeight = deltaY / window.innerHeight * 100
        
        this.setSheetHeight(this.sheetHeight + deltaHeight)
        this.dragPosition = y
    }
    onDragEnd() {
        this.dragPosition = undefined
        
        this.sheetContents = this._(`#contents-${this.name}`);
        this.draggableArea = this._(`#draggable-area-${this.name}`);

        this.sheetContents.classList.remove("not-selectable")
        this.draggableArea.style.cursor = document.body.style.cursor = ""
        this.draggableArea.style.cursor = document.body.style.overscrollBehaviorY = ""

        if (this.sheetHeight < this.closeHeight) {
            this.close()
        } else if (this.sheetHeight > this.defaultHeight) {
            this.setSheetHeight(this.maxHeight)
        }  else {
            this.setSheetHeight(this.defaultHeight)
        }
    }
}