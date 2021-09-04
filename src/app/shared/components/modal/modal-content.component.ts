import { Component, OnInit } from "@angular/core";

@Component({
    template: `
        <div>THIS WILL BE INJECTED AS MODAL CONTENT</div>
    `
})
export class ModalContent implements OnInit {
    
    constructor() {

    }

    ngOnInit() {

    }
}