export class Rectangle { // XXX: Create a base shape and move common functionality to base object for better DRY(er) code
    x: number;
    y: number;
    width: number;
    height: number
    color: string;
    isNew: boolean;
    isActive: boolean;
    isValid: boolean;

    constructor(x: number, y: number, color:string, width: number = 350, height: number = 120) {
        this.x = x - Math.floor(width >> 1);
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isNew = true;
        this.isActive = false; 
        this.isValid = true;
    }
    
    draw = (ctx: CanvasRenderingContext2D) => {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "#CBCBCB";
        ctx.fillRect(0, 0, this.width, 17);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "#FFF";
        ctx.fillRect(0, this.height - 17, this.width, 17);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        if (this.isActive) {
            this.drawActive(ctx);
        } else {
            this.drawFrame(ctx);
        }
    }

    setActive = (ctx: CanvasRenderingContext2D, isActive: boolean) => {
        this.isActive = isActive;
        if (isActive) {
            this.drawActive(ctx);
        } else {
            this.drawFrame(ctx);
        }
    }

    drawFrame = (ctx: CanvasRenderingContext2D) => {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.x, this.y);
        if (this.isValid) {
            ctx.strokeStyle = "#93C01F";
        } else {
            ctx.strokeStyle = "red";
        }
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, this.width, this.height);
        ctx.closePath();
        ctx.restore();
    }

    drawActive = (ctx: CanvasRenderingContext2D) => {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.x, this.y);
        ctx.strokeStyle = "#93C01F";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, this.width, this.height);
        ctx.closePath();
        ctx.restore();
    }
}