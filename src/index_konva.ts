import Konva from 'konva';
import { Vector2d } from 'konva/types/types';

const COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'Indigo', 'purple'];
let colorIndex = 1;

window.onload = function () {
    const width = window.innerWidth;
    const height = window.innerHeight - 25;

    // first we need Konva core things: stage and layer
    const stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    // then we are going to draw into special canvas element
    const canvas = document.createElement('canvas');
    canvas.width = stage.width();
    canvas.height = stage.height();

    // created canvas we can add to layer as "Konva.Image" element
    const circle = new Konva.Circle({
        radius: 4,
        fill: COLORS[0],
        stroke: 'black',
        strokeWidth: 1,
        index: 100
    });
    layer.add(circle);
    stage.draw();

    // Good. Now we need to get access to context element
    const context = canvas.getContext('2d');
    if (context) {
        context.lineJoin = 'round';
        context.lineWidth = 5;
    }

    let image: Konva.Image;
    let mode = 'brush';
    let isPaint = false;
    let lastPointerPosition: Vector2d | null;

    // now we need to bind some events
    // we need to start drawing on mousedown
    // and stop drawing on mouseup
    stage.on('mousedown touchstart', function () {
        isPaint = true;
        lastPointerPosition = stage.getPointerPosition();
        image = new Konva.Image({
            image: canvas,
            x: 0,
            y: 0
        });
        if (context) {
            context.strokeStyle = circle.attrs.fill;
        }
        layer.add(image);
    });

    // will it be better to listen move/end events on the window?
    stage.on('mouseup touchend', function () {
        isPaint = false;
        if (context && mode !== 'eraser') {
            circle.fill(COLORS[colorIndex++ % COLORS.length]);
        }
    });

    // and core function - drawing
    stage.on('mousemove touchmove', function () {
        const pos = stage.getPointerPosition();
        if (pos) {
            circle.absolutePosition(pos);
        }
        if (!isPaint || !context) {
            layer.batchDraw();
            return;
        }

        if (mode === 'brush') {
            context.globalCompositeOperation = 'source-over';
        }
        if (mode === 'eraser') {
            context.globalCompositeOperation = 'destination-out';
        }
        context.beginPath();

        const lastPointerPositionX = lastPointerPosition ? lastPointerPosition.x : 0;
        const lastPointerPositionY = lastPointerPosition ? lastPointerPosition.y : 0;
        let localPos = {
            x: lastPointerPositionX - image.x(),
            y: lastPointerPositionY - image.y()
        };
        context.moveTo(localPos.x, localPos.y);

        if (pos) {
            localPos = {
                x: pos.x - image.x(),
                y: pos.y - image.y()
            };
        }
        context.lineTo(localPos.x, localPos.y);
        context.closePath();
        context.stroke();

        lastPointerPosition = pos;
        layer.batchDraw();
    });

    window.addEventListener('keyup', function (e) {
        if (!context) {
            layer.batchDraw();
            return;
        }

        if (!isPaint && e.key === 'e') {
            mode = 'eraser';
            circle.fill('white');
            layer.batchDraw();
        } else if (e.key === 'Escape') {
            mode = 'brush'
            circle.fill(COLORS[colorIndex % COLORS.length]);
            layer.batchDraw();
        }
    });
};