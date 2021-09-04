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

/**
 * 
 * @param rectA the "moving" rect to check on
 * @param rectB "set" rect to check against
 * @returns Whether a collision is occuring between two shapes
 */
export function isColliding(rectA: Rectangle, rectB: Rectangle): boolean {
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