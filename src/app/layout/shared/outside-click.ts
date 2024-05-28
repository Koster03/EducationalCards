import { Directive, ElementRef, EventEmitter, HostListener, Output } from "@angular/core";

@Directive({
    standalone: true,
    selector: "[clickOutside]"
})
export class ClickOutsideDirective {

    constructor(private readonly elementRef: ElementRef) {
    }

    @Output()
    public clickOutside = new EventEmitter<MouseEvent>();

    @HostListener("document:mousedown", ["$event", "$event.target"])
    public onClick(event: MouseEvent, targetElement: HTMLElement): void {
        if (!targetElement) {
            return;
        }

        if (targetElement.classList.contains("select2-results__option")) return;
        if (targetElement.closest(".modal-prevent-click-outside")) return;
        //if (targetElement.closest(".modal")) return;

        const clickedInside = this.elementRef.nativeElement.contains(targetElement);
        const attachedtoDom = document.body.contains(targetElement);
        if (attachedtoDom && !clickedInside) {
            this.clickOutside.emit(event);
        }
    }

}
