import { HElement, Position } from "stb-tools";

type IBoxfunc = () => HTMLElement;
type ITarfunc = () => HTMLElement;

/**
 * 跟随插件
 * @description 元素始终在可视区域，且支持动画效果
 */
export class Follow {
    private readonly boxfunc: IBoxfunc;
    private readonly tarfunc: ITarfunc;

    private boxarea: { left, top, right, bottom, width, height };
    private tararea: { left, top, right, bottom, width, height };

    constructor(box: IBoxfunc, target: ITarfunc) {
        this.boxfunc = box;
        this.tarfunc = target;
    }

    toMove(ele: HElement, set?: { complete?: () => void }) {
        if (!this.boxarea) {
            this.boxarea = Position(this.boxfunc());
        }
        if (!this.tararea) {
            this.tararea = Position(this.tarfunc());
        }
        let curarea = Position(ele.get(0));

        // 是否超出可视区
        if (curarea.top < this.boxarea.top) {

            this.tararea.top = this.tararea.top + (this.boxarea.top - curarea.top);

        }
        // 如果超出计算超出部分值
        else if (curarea.bottom > this.boxarea.bottom) {

            this.tararea.top = this.tararea.top - (curarea.bottom - this.boxarea.bottom);

        }

        Velocity(this.boxfunc(), "stop");
        Velocity(this.boxfunc(), {
            top: `${this.tararea.top}px`
        }, {
            duration: 250,
            complete: () => {
                (set && set.complete) && set.complete();
            }
        });
    }
    getStatus() {
        if (!this.tararea) {
            this.tararea = Position(this.tarfunc());
        }
        return this.tararea.top;
    }
    setStatus(status: number) {
        let ele = new HElement(`#${this.tarfunc}`);
        if (ele && ele.length) {
            if (!this.tararea) {
                this.tararea = Position(this.tarfunc());
            }
            this.tararea.top = status;
            ele.style("top", `${this.tararea.top}px`);
        }
    }
}