import * as styles from './index.scss';

interface Point {
  clientX: number;
  clientY: number;
}

export interface SelectAreaPosion {
  leftTop?: Point;
  rightBottom?: Point;
}

export default class AreaSelector {

  private startClip: boolean
  private endClip: boolean
  private mousedownPoint: Point
  private mouseupPoint: Point

  constructor() {
    this.startClip = false;
    this.endClip = false;
  }

  public start() {
    return new Promise((resolve, _) => {
      const element = document.createElement('div');
      element.setAttribute('id', styles.crossLine);
      document.body.appendChild(element);
      $('html').one('mousedown', (event) => {
        this.mousedownPoint = {
          clientX: event.clientX!,
          clientY: event.clientY!
        };
        $(`#${styles.crossLine}`).remove();
        this.startClip = true;
        $('html').one('mouseup', (event) => {
          this.mouseupPoint = {
            clientX: event.clientX!,
            clientY: event.clientY!
          };
          this.endClip = true;
          $(document).unbind('mousemove', this.mousemoveEvent);
          const result = this.getpoint(this.mousedownPoint, this.mouseupPoint);
          $(`#${styles.selectArea}`).remove();
          resolve(result);
        });
      });
      $('html').bind('mousemove', this.mousemoveEvent);
    });
  }

  private getpoint(first: Point, second: Point): SelectAreaPosion {
    return {
      leftTop: {
        clientX: Math.min(first.clientX, second.clientX),
        clientY: Math.min(first.clientY, second.clientY)
      },
      rightBottom: {
        clientX: Math.max(first.clientX, second.clientX),
        clientY: Math.max(first.clientY, second.clientY)
      }
    };
  }

  private getOrCreate(id: string) {
    const element = document.querySelector(`#${id}`);
    if (element) {
      return element;
    } else {
      const element = document.createElement('div');
      element.setAttribute('id', id);
      document.body.appendChild(element);
      return element;
    }
  }

  private mousemoveEvent = (event: any) => {

    event.preventDefault();

    if (this.startClip && this.endClip) {
      return;
    }
    const moustPosion = {
      clientX: event.clientX!,
      clientY: event.clientY!
    };

    if (!this.startClip) {
      const elemsent = this.getOrCreate(styles.crossLine);
      $(elemsent).css('top', moustPosion.clientY);
      $(elemsent).css('left', moustPosion.clientX);
    } else {
      const elemsent = this.getOrCreate(styles.selectArea);
      const area = this.getpoint(this.mousedownPoint, {
        clientX: event.clientX!,
        clientY: event.clientY!
      });
      $(elemsent).css('top', area.leftTop!.clientY);
      $(elemsent).css('left', area.leftTop!.clientX);
      $(elemsent).css('height', area.rightBottom!.clientY - area.leftTop!.clientY);
      $(elemsent).css('width', area.rightBottom!.clientX - area.leftTop!.clientX);
    }

  };

}
