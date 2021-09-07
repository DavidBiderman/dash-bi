export class Rectangle { // XXX: Create a base shape and move common functionality to base object for better DRY(er) code
    x: number;
    y: number;
    width: number;
    height: number
    color: string;
    isNew: boolean;
    isActive: boolean;
    isValid: boolean;
    isDragging: boolean;
    imgSrc?: string;
    img?: any;

    constructor(x: number, y: number, color:string, width: number = 350, height: number = 120) {
        this.x = x - Math.floor(width >> 1);
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isNew = true;
        this.isActive = false; 
        this.isValid = true;
        this.isDragging = false;
    }
    
    draw = (ctx: CanvasRenderingContext2D): void => {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.isDragging) {
            this.drawMove(ctx);
        } else {
            this.drawStatic(ctx);
        }
        ctx.restore();
        if (this.isActive) {
            // this.drawActive(ctx);
        } else {
            // this.drawFrame(ctx);
        }
    }

    setImg = (imgSrc: string): void => {
        this.imgSrc = imgSrc;
        this.img = new Image();
        this.img.src = this.imgSrc
        this.img.height = this.height;
        this.img.width = this.width;
    }

    removeImg = (): void => {
        delete this.imgSrc;
    }

    drawMove = (ctx: CanvasRenderingContext2D): void => {
        const bgColor: string = this.isValid ? 'rgb(64, 211, 83, 0.45)' : 'rgba(245, 41, 30, 0.45)';
        // ctx.drawImage(this.img, 0, 0);
        this.drawRoundedRect(ctx, bgColor);
    }

    drawStatic = (ctx: CanvasRenderingContext2D): void => {
        this.drawRoundedRect(ctx, this.color);
    }

    drawRoundedRect = (ctx: CanvasRenderingContext2D, bgColor: string): void => {
        ctx.beginPath();
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 3;
        ctx.fillStyle = bgColor;
        ctx.arcTo(this.width, 0, this.width, this.height, 7);
        ctx.arcTo(this.width, this.height, 0, this.height, 7);
        ctx.arcTo(0, this.height, 0, 0, 7);
        ctx.arcTo(0, 0, this.width, 0, 7);
        ctx.arcTo(this.width, 0, this.width, this.height, 7);
        ctx.closePath();
        ctx.fill()
    }

    drawImg = (ctx: CanvasRenderingContext2D): void => {
        if (this.imgSrc && this.imgSrc.length) {
            this.img.onload = () => {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.drawImage(this.img, 0, 0);
                ctx.restore();
            }
        }
    }

    setActive = (isActive: boolean): void => {
        this.isActive = isActive;
    }
}