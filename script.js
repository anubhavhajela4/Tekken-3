window.onload =function () {
    const canvasEl = document.querySelector('canvas');
    const context = canvasEl.getContext('2d');

    canvasEl.width = 1300;
    canvasEl.height = 600;

    const p1 = document.querySelector('#img1');
    const p2 = document.querySelector('#img2');
    context.drawImage(p1,400,450);
    context.save();
    context.scale(-1,1);
    context.drawImage(p2,-800-p2.width,450);
    context.restore();
}