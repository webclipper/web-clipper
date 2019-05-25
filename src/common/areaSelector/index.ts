import * as styles from './index.scss';

interface Point {
  clientX: number;
  clientY: number;
}

export interface SelectAreaPosition {
  leftTop: Point;
  rightBottom: Point;
}

export default class AreaSelector {
  private startClip: boolean;
  private endClip: boolean;
  private mousedownPoint?: Point;
  private mouseupPoint?: Point;

  constructor() {
    this.startClip = false;
    this.endClip = false;
  }

  public start() {
    return new Promise((resolve, _) => {
      const element = document.createElement('div');
      element.setAttribute('id', styles.crossLine);
      document.body.appendChild(element);
      $('html').one('mousedown', event => {
        this.mousedownPoint = {
          clientX: event.clientX!,
          clientY: event.clientY!,
        };
        $(`#${styles.crossLine}`).remove();
        this.startClip = true;
        $('html').one('mouseup', event => {
          this.mouseupPoint = {
            clientX: event.clientX!,
            clientY: event.clientY!,
          };
          this.endClip = true;
          $(document).unbind('mousemove', this.mousemoveEvent);
          const result = this.getPoint(this.mousedownPoint!, this.mouseupPoint);
          $(`#${styles.selectArea}`).remove();
          setTimeout(() => {
            resolve(result);
          });
        });
      });
      $('html').bind('mousemove', this.mousemoveEvent);
    });
  }

  private getPoint(first: Point, second: Point): SelectAreaPosition {
    return {
      leftTop: {
        clientX: Math.min(first.clientX, second.clientX),
        clientY: Math.min(first.clientY, second.clientY),
      },
      rightBottom: {
        clientX: Math.max(first.clientX, second.clientX),
        clientY: Math.max(first.clientY, second.clientY),
      },
    };
  }

  private getOrCreate(id: string) {
    let element = document.querySelector(`#${id}`);
    if (element) {
      return element;
    }
    element = document.createElement('div');
    element.setAttribute('id', id);
    document.body.appendChild(element);
    return element;
  }

  private mousemoveEvent = (event: any) => {
    event.preventDefault();

    if (this.startClip && this.endClip) {
      return;
    }
    const mousePosition = {
      clientX: event.clientX!,
      clientY: event.clientY!,
    };

    if (!this.startClip) {
      const element = this.getOrCreate(styles.crossLine);
      $(element).css('top', mousePosition.clientY);
      $(element).css('left', mousePosition.clientX);
    } else {
      const element = this.getOrCreate(styles.selectArea);
      const area = this.getPoint(this.mousedownPoint!, {
        clientX: event.clientX!,
        clientY: event.clientY!,
      });
      $(element).css('top', area.leftTop!.clientY);
      $(element).css('left', area.leftTop!.clientX);
      $(element).css('height', area.rightBottom!.clientY - area.leftTop!.clientY);
      $(element).css('width', area.rightBottom!.clientX - area.leftTop!.clientX);
    }
  };
}
