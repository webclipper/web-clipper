import * as styles from './index.scss';

const highlight_class = styles.simpreadHighlightSelector;

export default class Highlighter {
  private previous: any;

  constructor() {
    this.previous = null;
  }

  public start() {
    return new Promise((resolve, reject) => {
      $('html').one('click', event => {
        if (!this.previous) return;
        $(event.target).removeClass(highlight_class);
        $('html').off('mousemove', this.mousemoveEvent);
        this.previous = null;
        resolve(event.target);
        return false;
      });
      $('html').one('keydown', event => {
        if (event.keyCode === 27 && this.previous) {
          $('html')
            .find(`.${highlight_class}`)
            .removeClass(highlight_class);
          $('html').off('mousemove', this.mousemoveEvent);
          this.previous = null;
          event.preventDefault();
          reject(new Error('用户取消'));
        }
      });
      $('html').on('mousemove', this.mousemoveEvent);
    });
  }

  private mousemoveEvent = (event: any) => {
    if (!this.previous) {
      $(event.target).addClass(highlight_class);
    } else {
      this.previous.removeClass(highlight_class);
      $(event.target).addClass(highlight_class);
    }
    this.previous = $(event.target);
  };
}
