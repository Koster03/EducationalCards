export class FlippedCard {
  lastElement: any = null;
  cloneFlipped = false;
  cloneStyle: any = {};
  cloneFrontStyle: any = {};
  cloneBackStyle: any = {};

  target: any;

  onCardClick(event: any): void {
    // debugger
    if (!this.cloneFlipped) {
      const offset = event.target.getBoundingClientRect();
      this.target = event.target;
      this.target.style.display = 'none';
      this.lastElement = {
        top: offset.top,
        left: offset.left - 30,
        width: offset.width,
        height: offset.height,
      };

      const rotateFront =
        this.lastElement.left + this.lastElement.width / 2 >
        window.innerWidth / 2
          ? 'rotateY(-180deg)'
          : 'rotateY(180deg)';
      const rotateBack =
        this.lastElement.left + this.lastElement.width / 2 >
        window.innerWidth / 2
          ? 'rotateY(-360deg)'
          : 'rotateY(0deg)';

      this.cloneStyle = {
        display: 'block',
        top: this.lastElement.top + 'px',
        left: this.lastElement.left + 'px',
        width: this.lastElement.width + 'px',
        height: this.lastElement.height + 'px',
      };

      setTimeout(() => {
        const wdth = document.getElementById('scrollDemo')!.offsetWidth / 2;
        const lft = document.getElementById('scrollDemo')!.offsetWidth / 2 - wdth / 2;
        this.cloneStyle = {
          ...this.cloneStyle,
          top: '55px',
          left: `${lft}px`,
          width: `${wdth}px`,
          height: '550px',
        };
        
        this.cloneFrontStyle = {
          transform: rotateFront,
        };
        this.cloneBackStyle = {
          transform: rotateBack,
        };
      }, 100);
    }
  }

  onCloneTransitionEnd(event: any): void {
    if (event.propertyName === 'top') {
      this.cloneFlipped = !this.cloneFlipped;
      if (!this.cloneFlipped) {
        this.cloneStyle = {
          display: 'none',
        };

        this.target.style.display = 'flex';
      }
    }
  }

  onBodyClick(event: any): void {
    if (this.cloneFlipped && event.target.className !== 'card') {
      this.cloneStyle = {
        ...this.cloneStyle,
        top: this.lastElement.top + 'px',
        left: this.lastElement.left + 'px',
        width: this.lastElement.width + 'px',
        height: this.lastElement.height + 'px',
      };
      this.cloneFrontStyle = {
        transform: 'rotateY(0deg)',
      };
      this.cloneBackStyle = {
        transform: 'rotateY(-180deg)',
      };
    }
  }
}
