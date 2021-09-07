import { ComponentRef } from "@angular/core";
import { ContainerComponent } from "src/app/shared/components/container/container.component";
import { Rectangle } from "../canvas-models/rectangle.model";

/**
 * 
 * @param a -> first object on canvas
 * @param b -> second object on canvas
 * @returns -> do coordinates overlap
 */
export function detectCollision(a: any, b: any) {
    return (
        a.x < b.x + b.width &&
        b.x < a.x + a.width &&
        a.y < b.y + b.height &&
        b.y < a.y + a.height
    ); 
} 

// ============================== COLLISION DETECTION ============================== //
/**
 * 
 * @param rectA the "moving" rect to check on
 * @param rectB "set" rect to check against
 * @returns Whether a collision is occuring between two shapes
 */
export const isColliding = (rectA: Rectangle, rectB: Rectangle): boolean => {
    return (LRCollide(rectA, rectB) || RLCollide(rectA, rectB) || UDCollide(rectA, rectB) || DUCollide(rectA, rectB));
}

const LRCollide = (rectA: Rectangle, rectB: Rectangle): boolean => {
    return (isTouchingLeft(rectA, rectB) && (isTouchingTop(rectA, rectB) || isTouchingBottom(rectA, rectB)))
}

const RLCollide = (rectA: Rectangle, rectB: Rectangle): boolean => {
    return (isTouchingRight(rectA, rectB) && (isTouchingTop(rectA, rectB) || isTouchingBottom(rectA, rectB)))
}

const UDCollide = (rectA: Rectangle, rectB: Rectangle): boolean => {
    return (isTouchingTop(rectA, rectB) && (isTouchingRight(rectA, rectB) || isTouchingLeft(rectA, rectB)))
}

const DUCollide = (rectA: Rectangle, rectB: Rectangle): boolean => {
    return (isTouchingBottom(rectA, rectB) && (isTouchingRight(rectA, rectB) || isTouchingLeft(rectA, rectB)))
}

const isTouchingTop = (rectA: Rectangle, rectB: Rectangle): boolean => {
    return (rectA.y + rectA.height >= rectB.y && rectA.y <= rectB.y + rectB.height);
}

const isTouchingBottom = (rectA: Rectangle, rectB: Rectangle): boolean => {
    return (rectA.y <= rectB.y + rectB.height && rectA.y >= rectB.y);
}

const isTouchingRight = (rectA: Rectangle, rectB: Rectangle): boolean => {
    return (rectA.x <= rectB.x + rectB.width && rectA.x >= rectB.x);
}

const isTouchingLeft = (rectA: Rectangle, rectB: Rectangle): boolean => {
    return (rectA.x + rectA.width >= rectB.x && rectA.x <= rectB.x);
}

// ============================== HTML TO SVG CONVERSION  (NOT WORKING MOTHER FUCKER!!!!!!)============================== //
const svgTemplate = `
<svg xmlns="http://www.w3.org/2000/svg" width="{{width}}" height="{{height}}">
    <foreignObject width="100%" height="100%">
        {{content}}
    </foreignObject>
</svg>;
`

export const htmlToSvg = (widget: ComponentRef<ContainerComponent>): string => {
    const doc = document.implementation.createHTMLDocument("");
    let template = svgTemplate.toString(); // get a copy of the template;
    const outerContainer: HTMLDivElement = (widget.location.nativeElement as HTMLElement).firstChild as unknown as HTMLDivElement;
    template = template.replace('{{width}}', outerContainer.style.width);
    template = template.replace('{{height}}', outerContainer.style.height);
    template = template.replace('{{content}}', widget.location.nativeElement.innerHTML);
    doc.write(template);
    const validXml = (new XMLSerializer).serializeToString(outerContainer);
    doc.documentElement.setAttribute("xmlns", (doc.documentElement as any).namespaceURI);
    (new XMLSerializer).serializeToString(doc);

    return URL.createObjectURL(new Blob([template], {type: 'image/svg+xml;charset=utf-8'}));
}