class Resizer {
    constructor(element) {
        this.element = element;
        this.resizing = false;
        this.resizeDirection = null;
        this.startX = 0;
        this.startY = 0;
        this.startLeft = 0;
        this.startTop = 0;
        this.startWidth = 0;
        this.startHeight = 0;
        this.BORDER_SIZE = 8;
        this.isMouseDown = false;
        document.addEventListener('mousedown', this.startResize.bind(this));
        document.addEventListener('mousemove', this.checkBorder.bind(this));
        document.addEventListener('mouseup', this.stopResize.bind(this));
        document.addEventListener('mousemove', this.changeCursor.bind(this));
    }

    startResize(e) {
        e.preventDefault();
        if (e.target !== this.element) return; // Vérifier si l'événement est déclenché à l'intérieur de l'élément cible
        const rect = this.element.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
    
        if (offsetX < this.BORDER_SIZE && offsetY < this.BORDER_SIZE) {
            this.resizing = true;
            this.resizeDirection = 'top-left';
        } else if (offsetX > rect.width - this.BORDER_SIZE && offsetY < this.BORDER_SIZE) {
            this.resizing = true;
            this.resizeDirection = 'top-right';
        } else if (offsetX < this.BORDER_SIZE && offsetY > rect.height - this.BORDER_SIZE) {
            this.resizing = true;
            this.resizeDirection = 'bottom-left';
        } else if (offsetX > rect.width - this.BORDER_SIZE && offsetY > rect.height - this.BORDER_SIZE) {
            this.resizing = true;
            this.resizeDirection = 'bottom-right';
        } else if (offsetX < this.BORDER_SIZE) {
            this.resizing = true;
            this.resizeDirection = 'left';
        } else if (offsetX > rect.width - this.BORDER_SIZE) {
            this.resizing = true;
            this.resizeDirection = 'right';
        } else if (offsetY < this.BORDER_SIZE) {
            this.resizing = true;
            this.resizeDirection = 'top';
        } else if (offsetY > rect.height - this.BORDER_SIZE) {
            this.resizing = true;
            this.resizeDirection = 'bottom';
        }
    
        if (this.resizing) {
            this.startX = e.clientX;
            this.startY = e.clientY;
            this.startLeft = this.element.getBoundingClientRect().left;
            this.startTop = this.element.getBoundingClientRect().top;
            this.startWidth = this.element.offsetWidth;
            this.startHeight = this.element.offsetHeight;
            this.isMouseDown = true;
            this.updateWindowSize();
        }
    }
    

    checkBorder(e) {
        e.preventDefault();
        if (!this.resizing) return;

        const dx = e.clientX - this.startX;
        const dy = e.clientY - this.startY;

        let newWidth = this.startWidth;
        let newLeft = this.startLeft;
        let newHeight = this.startHeight;
        let newTop = this.startTop;

        switch (this.resizeDirection) {
            case 'left':
                newWidth -= dx;
                newLeft += dx;
                break;
            case 'right':
                newWidth += dx;
                break;
            case 'top':
                newHeight -= dy;
                newTop += dy;
                break;
            case 'bottom':
                newHeight += dy;
                break;
            case 'top-left':
                newWidth -= dx;
                newLeft += dx;
                newHeight -= dy;
                newTop += dy;
                break;
            case 'top-right':
                newWidth += dx;
                newHeight -= dy;
                newTop += dy;
                break;
            case 'bottom-left':
                newWidth -= dx;
                newLeft += dx;
                newHeight += dy;
                break;
            case 'bottom-right':
                newWidth += dx;
                newHeight += dy;
                break;
        }

        newWidth = Math.max(newWidth, this.BORDER_SIZE * 2);
        newHeight = Math.max(newHeight, this.BORDER_SIZE * 2);

        const windowRect = document.documentElement.getBoundingClientRect();
        newLeft = Math.max(Math.min(newLeft, windowRect.width - newWidth), 0);
        newTop = Math.max(Math.min(newTop, windowRect.height - newHeight), 0);

        this.element.style.width = `${newWidth}px`;
        this.element.style.height = `${newHeight}px`;
        this.element.style.left = `${newLeft}px`;
        this.element.style.top = `${newTop}px`;
        this.updateWindowSize();
    }

    stopResize() {
        if (this.resizing) {
            this.resizing = false;
            this.resizeDirection = null;
            this.isMouseDown = false;
            this.element.style.cursor = 'auto';
        }
    }

    changeCursor(e) {
        if (this.resizing) return;

        const rect = this.element.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        if (offsetX < this.BORDER_SIZE && offsetY < this.BORDER_SIZE) {
            this.element.style.cursor = 'nwse-resize'; // Diagonale haut-gauche
        } else if (offsetX > rect.width - this.BORDER_SIZE && offsetY < this.BORDER_SIZE) {
            this.element.style.cursor = 'nesw-resize'; // Diagonale haut-droite
        } else if (offsetX < this.BORDER_SIZE && offsetY > rect.height - this.BORDER_SIZE) {
            this.element.style.cursor = 'nesw-resize'; // Diagonale bas-gauche
        } else if (offsetX > rect.width - this.BORDER_SIZE && offsetY > rect.height - this.BORDER_SIZE) {
            this.element.style.cursor = 'nwse-resize'; // Diagonale bas-droite
        } else if (offsetX < this.BORDER_SIZE) {
            this.element.style.cursor = 'ew-resize'; // Redimensionnement horizontal
        } else if (offsetX > rect.width - this.BORDER_SIZE) {
            this.element.style.cursor = 'ew-resize'; // Redimensionnement horizontal
        } else if (offsetY < this.BORDER_SIZE) {
            this.element.style.cursor = 'ns-resize'; // Redimensionnement vertical
        } else if (offsetY > rect.height - this.BORDER_SIZE) {
            this.element.style.cursor = 'ns-resize'; // Redimensionnement vertical
        } else {
            this.element.style.cursor = 'auto';
        }
    }

    updateWindowSize() {
        // Ne pas mettre à jour la taille de l'élément ici, cela pourrait entraîner des problèmes de saut pendant le redimensionnement
    }
}