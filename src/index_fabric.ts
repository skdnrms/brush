import { fabric } from 'fabric';

const COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'Indigo', 'purple'];
// let colorIndex = 1;

window.onload = function () {
    // const width = window.innerWidth;
    // const height = window.innerHeight - 25;

    const canvas = new fabric.Canvas('container', {
        isDrawingMode: true
    });

    fabric.Object.prototype.transparentCorners = false;
    const brush = new fabric.PencilBrush();
    brush.color = COLORS[0];
    brush.width = 10;
};