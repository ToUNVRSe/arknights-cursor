"use strict";
let need = "a,input,button,textarea";
function getElement(string, item = document.documentElement) {
    let tmp = item.querySelector(string);
    if (tmp === null) {
        throw new Error("Unknown HTML");
    }
    return tmp;
}
function getParent(item, level = 1) {
    while (level--) {
        let tmp = item.parentElement;
        if (tmp === null) {
            throw new Error("Unknown HTML");
        }
        item = tmp;
    }
    return item;
}
class Cursor {
    constructor() {
        this.now = new MouseEvent('');
        this.first = true;
        this.last = 0;
        this.moveIng = false;
        this.fadeIng = false;
        this.outer = getElement('#cursor-outer').style;
        this.effecter = getElement('#cursor-effect').style;
        this.attention = need;
        this.move = (timestamp) => {
            if (this.now !== undefined) {
                let SX = this.outer.left, SY = this.outer.top, preX = Number(SX.substring(0, SX.length - 2)), preY = Number(SY.substring(0, SY.length - 2)), delX = (this.now.x - preX) * 0.3, delY = (this.now.y - preY) * 0.3;
                if (timestamp - this.last > 15) {
                    preX += delX;
                    preY += delY;
                    this.outer.left = preX.toFixed(2) + 'px';
                    this.outer.top = preY.toFixed(2) + 'px';
                    this.last = timestamp;
                }
                if (Math.abs(delX) > 0.2 || Math.abs(delY) > 0.2) {
                    window.requestAnimationFrame(this.move);
                }
                else {
                    this.moveIng = false;
                }
            }
        };
        this.reset = (mouse) => {
            if (!this.moveIng) {
                this.moveIng = true;
                window.requestAnimationFrame(this.move);
            }
            this.now = mouse;
            if (this.first) {
                this.first = false;
                this.outer.left = String(this.now.x) + 'px';
                this.outer.top = String(this.now.y) + 'px';
            }
        };
        this.Aeffect = (mouse) => {
            if (this.fadeIng == false) {
                this.fadeIng = true;
                this.effecter.left = String(mouse.x) + 'px';
                this.effecter.top = String(mouse.y) + 'px';
                this.effecter.transition =
                    'transform .5s cubic-bezier(0.22, 0.61, 0.21, 1)\
        ,opacity .5s cubic-bezier(0.22, 0.61, 0.21, 1)';
                this.effecter.transform = 'translate(-50%, -50%) scale(1)';
                this.effecter.opacity = '0';
                setTimeout(() => {
                    this.fadeIng = false;
                    this.effecter.transition = '';
                    this.effecter.transform = 'translate(-50%, -50%) scale(0)';
                    this.effecter.opacity = '1';
                }, 500);
            }
        };
        this.hold = () => {
            this.outer.height = '24px';
            this.outer.width = '24px';
            this.outer.background = "rgba(255, 255, 255, 0.5)";
        };
        this.relax = () => {
            this.outer.height = '36px';
            this.outer.width = '36px';
            this.outer.background = "unset";
        };
        this.pushHolder = (items) => {
            items.forEach(item => {
                if (!item.classList.contains('is--active')) {
                    item.addEventListener('mouseover', this.hold, { passive: true });
                    item.addEventListener('mouseout', this.relax, { passive: true });
                }
            });
        };
        this.pushHolders = () => {
            this.pushHolder(document.querySelectorAll(this.attention));
        };
        this.effecter.transform = 'translate(-50%, -50%) scale(0)';
        this.effecter.opacity = '1';
        window.addEventListener('mousemove', this.reset, { passive: true });
        window.addEventListener('click', this.Aeffect, { passive: true });
        this.pushHolders();
        const observer = new MutationObserver(this.pushHolders);
        observer.observe(document, { childList: true, subtree: true });
    }
}
new Cursor();
