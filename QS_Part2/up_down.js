function lines2()
{
	
//rotate.js

var PI = Math.PI;

var elem; // ссылка на элемент canvas_draw
var ctx; // контекст рисования на холсте

var gui;
var controller;

var theta = 60*DEGREE;
var theta_2 = 70*DEGREE;

// SCALE задает ИСХОДНЫЙ масштаб при рисовании проекции модели на плоскость OXY,
// Представим, что значения координат модели в WebGeometry по X и Y
// находятся в пределах от -3.0 до + 3.0, а холст имеет размеры 770 x 400.
// Для приведения в соответствии значений в этих двух системах координат 
// используется коэффициент масштабирования SCALE. 
//SCALE = 1;
// xC и yC задают координаты точки на на холсте в пикселах 
// имеющую координаты (0, 0) в системе координат WebGeometry
/*
xC = 23; // 23 пиксела вправо по холсту
yC = 400 - 15;	// 400 - 15  - пикселов вниз по холсту 
				// 400 - размер холста по вертикали в пикселах
*/
//xC = 2;
//yC = 400 - 2;

///

function draw()
{
	
	// очистка канваса от ранее нанесенных на него линий, отрезков, текстов и т.п.
	ctx.clearRect(0, 0, 820, 500);	// 720 x 500 - размеры холста
	
	// Рисуем координатные оси черным цветом и толщиной 1 пиксель
	// с размером по осям (WG) равным 20 (и влево/вниз и вправо/вверх)
	axes(ctx, 20, 20, 1.0, "Black");
	
	var point;
	
	point = new Point2D(50, 380);
	text_ang_fi = "φ = 0°";
	text1(ctx, text_ang_fi, point, "rt", "mid", "Black", "italic bold 18px Courier New");	
	
	var r = 150; // радиус большой окружности
	
	// Центр левой окружности
	var point_center_left = new Point2D(200, 200);
	csp(ctx, point_center_left, 6, "Black");
	// Левая окружность
	drawEllipse2(ctx, point_center_left, r, r, 2, "Black");
	
	// Рисуем углы на левой окружности
	var x = r * Math.sin(theta/2) + point_center_left[0];
	var y = r * Math.cos(theta/2) + point_center_left[1];
	point = new Point2D(x, y);
	csp(ctx, point, 7, "B");
	segment_arrow(ctx, point_center_left, point, 2, 0.3, "B");
	draw_angle_2(ctx, point_center_left, +PI/2, -theta/2 + PI/2, r, 4, "B");
	
	// Два оборота на левой
	var temp_angle_left = 0;
	if (theta < 2*PI)
	{
		// первый оборот
		draw_angle_2(ctx, point_center_left, PI/2, (-theta + PI/2), 50, 1, "R");
	}
	else
	{
		// второй оборот
		drawEllipse2(ctx, point_center_left, 50, 50, 1, "R");
		temp_angle_left = theta - 2*PI;
		draw_angle_2(ctx, point_center_left, PI/2, (-temp_angle_left + PI/2), 70, 1, "R");
	}

	// Левая маленькая окружность
	var r1 = 100;
	var x1 = Math.sin(theta) + point_center_left[0];
	var y1 = Math.cos(theta) + point_center_left[1];
	point = new Point2D(x1, y1);
	if (theta < 2*PI)
	{
		var x1 = r * Math.sin(theta) + point_center_left[0];
		var y1 = r * Math.cos(theta) + point_center_left[1];
		point = new Point2D(x1, y1);
		segment_arrow(ctx, point_center_left, point, 1, 0.2, "R");
	}
	else
	{
		var x1 = r  *Math.sin(theta) + point_center_left[0];
		var y1 = r * Math.cos(theta) + point_center_left[1];
		point = new Point2D(x1, y1);
		segment_arrow(ctx, point_center_left, point, 1, 0.2, "R");		
	}

	// Точки на левой окружности
	// |u〉 // !!
	point = new Point2D(point_center_left[0], point_center_left[1] + r);		
	csp(ctx, point, 8, "Black");	
	text1(ctx, "|up〉", point, "rt", "up", "Black", "bold 14px Courier New");
	text1(ctx, "1.0", point, "lt", "up", "Black", "14px Ariel");
	
	// |r〉
	point = new Point2D(point_center_left[0] + r * 0.707, point_center_left[1] + r * 0.707);		
	csp(ctx, point, 8, "Black");
	text1(ctx, "|right〉", point, "rt", "up", "Black", "bold 14px Courier New");
	
	// |d〉
	point = new Point2D(point_center_left[0] + r, point_center_left[1]);		
	csp(ctx, point, 8, "Black");
	text1(ctx, "|dn〉", point, "rt", "up", "Black", "bold 14px Courier New");
	text1(ctx, "1.0", point, "rt", "dn", "Black", "14px Ariel");
	
	// |l〉
	point = new Point2D(point_center_left[0] + r * 0.707, point_center_left[1] - r * 0.707);		
	csp(ctx, point, 8, "Black");
	text1(ctx, "|left〉", point, "rt", "mid", "Black", "bold 14px Courier New");
	
	// -|u〉    // !!
	point = new Point2D(point_center_left[0], point_center_left[1] - r);		
	csp(ctx, point, 8, "Black");	
	text1(ctx, "-|up〉", point, "rt", "dn", "Black", "bold 14px Courier New");
	text1(ctx, "-1.0", point, "lt", "dn", "Black", "14px Ariel");
	
	// -|r〉
	point = new Point2D(point_center_left[0] - r * 0.707, point_center_left[1] - r * 0.707);		
	csp(ctx, point, 8, "Black");
	text1(ctx, "-|right〉", point, "lt", "dn", "Black", "bold 14px Courier New");
	
	// -|d〉
	point = new Point2D(point_center_left[0] - r, point_center_left[1]);		
	csp(ctx, point, 8, "Black");
	text1(ctx, "-|dn〉", point, "lt", "up", "Black", "bold 14px Courier New");
	text1(ctx, "-1.0", point, "lt", "dn", "Black", "14px Ariel");
	
	// -|l〉
	point = new Point2D(point_center_left[0] - r * 0.707, point_center_left[1] + r * 0.707);		
	csp(ctx, point, 8, "Black");
	text1(ctx, "-|left〉", point, "lt", "up", "Black", "bold 14px Courier New");
	
	// Оси
	pt_b = new Point2D(point_center_left[0], point_center_left[1] + 1.1 * r);
	pt_e = new Point2D(point_center_left[0], point_center_left[1] - 1.1 * r);
	line_segment(ctx, pt_b, pt_e, 0.5, "Black");

	pt_b = new Point2D(point_center_left[0] - 1.1 * r, point_center_left[1]);
	pt_e = new Point2D(point_center_left[0] + 1.1 * r, point_center_left[1]);
	line_segment(ctx, pt_b, pt_e, 0.5, "Black");
	
	pt_b = new Point2D(point_center_left[0] - 1.05 * r * 0.707, point_center_left[1] - 1.05 * r * 0.707);
	pt_e = new Point2D(point_center_left[0] + 1.05 * r * 0.707, point_center_left[1] + 1.05 * r * 0.707);
	line_segment(ctx, pt_b, pt_e, 0.5, "Black");
	
	pt_b = new Point2D(point_center_left[0] - 1.05 * r * 0.707, point_center_left[1] + 1.05 * r * 0.707);
	pt_e = new Point2D(point_center_left[0] + 1.05 * r * 0.707, point_center_left[1] - 1.05 * r * 0.707);
	line_segment(ctx, pt_b, pt_e, 0.5, "Black");	
	
	// Проекции на оси
	pt_b = new Point2D(x, y);
	pt_e = new Point2D(x, 200);	
	line_segment(ctx, pt_b, pt_e, 0.5, "B");
	csp(ctx, pt_e, 8, "B");
	
	pt_b = new Point2D(x, y);
	pt_e = new Point2D(200, y);	
	line_segment(ctx, pt_b, pt_e, 0.5, "B");
	csp(ctx, pt_e, 8, "B");
	
	
	var a = Math.cos(theta/2);
	var b = Math.sin(theta/2);
	var point_left = new Point2D(10, 200);
	
	//////////////////////////////////////////////////////////////
	var a_left = roundNumber(a, 3);
	var b_left = roundNumber(b, 3);
	var text_a_left = "a = " + a_left;
	var text_b_left = "b = " + b_left;
	var point = new Point2D(230, -40);
	text1(ctx, text_a_left, point, "rt", "mid", "Black", "italic bold 14px Courier New");
	point = new Point2D(230, -60);
	text1(ctx, text_b_left, point, "rt", "mid", "Black", "italic bold 14px Courier New");
	
	
	var text_ang_teta = roundNumber(theta/DEGREE, 0) + "°";
	text_ang_teta = "θ = " + text_ang_teta;
	point = new Point2D(100, -20);
	text1(ctx, text_ang_teta, point, "rt", "mid", "R", "italic bold 14px Courier New");
	
	text_ang_teta = roundNumber((theta/2)/DEGREE, 0) + "°";
	text_ang_teta = "θ/2 = " + text_ang_teta;
	point = new Point2D(100, -40);
	text1(ctx, text_ang_teta, point, "rt", "mid", "B", "italic bold 14px Courier New");
	
	
	////////////////////////////////////////////////////////////////////////
	//                       RIGHT
	////////////////////////////////////////////////////////////////////////

	point = new Point2D(440, 380);
	text_ang_fi = "φ = 90°";
	text1(ctx, text_ang_fi, point, "rt", "mid", "Black", "italic bold 18px Courier New");	
	
	// Центр правой окружности
	var point_center_right = new Point2D(600, 200);
	csp(ctx, point_center_right, 6, "Black");
	// Правая окружность
	drawEllipse2(ctx, point_center_right, r, r, 2, "Black");
	
	// Рисуем углы на правой окружности
	var x = r * Math.sin(theta/2) + point_center_right[0];
	var y = r * Math.cos(theta/2) + point_center_right[1];
	point = new Point2D(x, y);
	csp(ctx, point, 5, "B");
	segment_arrow(ctx, point_center_right, point, 2, 0.3, "B");
	draw_angle_2(ctx, point_center_right, +PI/2, -theta/2 + PI/2, r, 4, "B");
	
	// Два оборота на правой
	var temp_angle_right = 0;
	if (theta < 2*PI)
	{
		// первый оборот
		draw_angle_2(ctx, point_center_right, PI/2, (-theta + PI/2), 50, 1, "R");
	}
	else
	{
		// второй оборот
		drawEllipse2(ctx, point_center_right, 50, 50, 1, "R");
		temp_angle_right = theta - 2*PI;
		draw_angle_2(ctx, point_center_right, PI/2, (-temp_angle_right + PI/2), 70, 1, "R")
	}

	// Правая маленькая окружность
	var r1 = 100;
	var x1 = Math.sin(theta) + point_center_right[0];
	var y1 = Math.cos(theta) + point_center_right[1];
	point = new Point2D(x1, y1);
	if (theta < 2*PI)
	{
		var x1 = r * Math.sin(theta) + point_center_right[0];
		var y1 = r * Math.cos(theta) + point_center_right[1];
		point = new Point2D(x1, y1);
		segment_arrow(ctx, point_center_right, point, 1, 0.2, "R");
	}
	else
	{
		var x1 = r  *Math.sin(theta) + point_center_right[0];
		var y1 = r * Math.cos(theta) + point_center_right[1];
		point = new Point2D(x1, y1);
		segment_arrow(ctx, point_center_right, point, 1, 0.2, "R");		
	}

	// Точки на правой окружности
	// |u〉
	point = new Point2D(point_center_right[0], point_center_right[1] + r);		
	csp(ctx, point, 8, "B");	
	text1(ctx, "|up〉", point, "rt", "up", "Black", "bold 14px Courier New");
	text1(ctx, "1.0", point, "lt", "up", "Black", "bold 14px Courier New");
	
	// |f〉
	point = new Point2D(point_center_right[0] + r * 0.707, point_center_right[1] + r * 0.707);		
	csp(ctx, point, 8, "B");
	text1(ctx, "|forward〉", point, "rt", "up", "Black", "bold 14px Courier New");
	
	// |di〉
	point = new Point2D(point_center_right[0] + r, point_center_right[1]);		
	csp(ctx, point, 8, "B");
	text1(ctx, "i⋅|dn〉", point, "rt", "up", "DarkOrchid", "bold 14px Courier New");
	text1(ctx, "+i", point, "rt", "dn", "Black", "bold 16px Courier New");
	
	// |b〉
	point = new Point2D(point_center_right[0] + r * 0.707, point_center_right[1] - r * 0.707);		
	csp(ctx, point, 8, "B");
	text1(ctx, "|back〉", point, "rt", "mid", "Black", "bold 14px Courier New");
	
	// -|u〉
	point = new Point2D(point_center_right[0], point_center_right[1] - r);		
	csp(ctx, point, 8, "B");	
	text1(ctx, "-|up〉", point, "rt", "dn", "Black", "bold 14px Courier New");
	text1(ctx, "-1.0", point, "lt", "dn", "Black", "14px Ariel");
	
	// -|f〉
	point = new Point2D(point_center_right[0] - r * 0.707, point_center_right[1] - r * 0.707);		
	csp(ctx, point, 8, "Black");
	text1(ctx, "-|forward〉", point, "lt", "dn", "Black", "bold 14px Courier New");
	
	// -|u〉
	point = new Point2D(point_center_right[0] - r, point_center_right[1]);		
	csp(ctx, point, 8, "B");
	text1(ctx, "-i⋅|dn〉", point, "lt", "up", "DarkOrchid", "bold 14px Courier New");// purple
	text1(ctx, "-i", point, "lt", "dn", "Black", "bold 16px Courier New");
	
	// -|b〉
	point = new Point2D(point_center_right[0] - r * 0.707, point_center_right[1] + r * 0.707);		
	csp(ctx, point, 8, "B");
	text1(ctx, "-|back〉", point, "lt", "up", "Black", "bold 14px Courier New");
	
	// Оси
	pt_b = new Point2D(point_center_right[0], point_center_right[1] + 1.1 * r);
	pt_e = new Point2D(point_center_right[0], point_center_right[1] - 1.1 * r);
	line_segment(ctx, pt_b, pt_e, 0.5, "Black");

	pt_b = new Point2D(point_center_right[0] - 1.1 * r, point_center_right[1]);
	pt_e = new Point2D(point_center_right[0] + 1.1 * r, point_center_right[1]);
	line_segment(ctx, pt_b, pt_e, 0.5, "Black");
	
	pt_b = new Point2D(point_center_right[0] - 1.05 * r * 0.707, point_center_right[1] - 1.05 * r * 0.707);
	pt_e = new Point2D(point_center_right[0] + 1.05 * r * 0.707, point_center_right[1] + 1.05 * r * 0.707);
	line_segment(ctx, pt_b, pt_e, 0.5, "Black");
	
	pt_b = new Point2D(point_center_right[0] - 1.05 * r * 0.707, point_center_right[1] + 1.05 * r * 0.707);
	pt_e = new Point2D(point_center_right[0] + 1.05 * r * 0.707, point_center_right[1] - 1.05 * r * 0.707);
	line_segment(ctx, pt_b, pt_e, 0.5, "Black");	
	
	// Проекции на оси
	pt_b = new Point2D(x, y);
	pt_e = new Point2D(x, 200);	
	line_segment(ctx, pt_b, pt_e, 0.5, "B");
	csp(ctx, pt_e, 8, "B");
	
	pt_b = new Point2D(x, y);
	pt_e = new Point2D(600, y);	
	line_segment(ctx, pt_b, pt_e, 0.5, "B");
	csp(ctx, pt_e, 8, "B");
	
	
	a = Math.cos(theta/2);
	b = Math.sin(theta/2);
	
	var a_right = roundNumber(a, 3);
	var b_right = roundNumber(b, 3) + "i";
	var text_a_right = "a = " + a_right;
	var text_b_right = "b = " + b_right;
	point = new Point2D(650, -40);
	text1(ctx, text_a_right, point, "rt", "mid", "Black", "italic bold 14px Courier New");
	point = new Point2D(650, -60);
	text1(ctx, text_b_right, point, "rt", "mid", "Black", "italic bold 14px Courier New");
	

	var text_ang_teta = roundNumber(theta/DEGREE, 0) + "°";
	text_ang_teta = "θ = " + text_ang_teta;
	point = new Point2D(500, -20);
	text1(ctx, text_ang_teta, point, "rt", "mid", "R", "italic bold 14px Courier New");
	
	text_ang_teta = roundNumber((theta/2)/DEGREE, 0) + "°";
	text_ang_teta = "θ/2 = " + text_ang_teta;
	point = new Point2D(500, -40);
	text1(ctx, text_ang_teta, point, "rt", "mid", "B", "italic bold 14px Courier New");

	/////////////////////////////////////
	point = new Point2D(270, 15);
	text1(ctx, "|Ψ〉 = a⋅|up〉 + b⋅|dn〉", point, "rt", "mid", "Black", "bold 22px Courier New");
}


// Этой функции нет в файле canvas2D.js
function draw_angle_2(ctx, point, ang_b, ang_e, radius, width, color)
{
	ctx.save();
	
	if (color == "R")
		ctx.strokeStyle = '#f00';
	else if (color == "G")
		ctx.strokeStyle = '#0f0';
	else if (color == "B")
		ctx.strokeStyle = '#00f';		
	
	else if (color == "Brown") 
		ctx.strokeStyle = '#A52A2A';	
	else if (color == "DarkOrchid") 
		ctx.strokeStyle = '#9932CC';
	else if (color == "Gray") 
		ctx.strokeStyle = '#808080';
	else if (color == "Black") 
		ctx.strokeStyle = '#000';	
	else
		ctx.strokeStyle = color;

	ctx.beginPath();
	ctx.arc(fx(point[0]), fy(point[1]), radius*SCALE, -ang_b, -ang_e, false);
	ctx.lineWidth = width;
	ctx.stroke();
	
	ctx.restore();	
}

// *********************************************************************
// Отображает эллипс с центром в точке point
// a и b - размеры полуосей эллипса
function drawEllipse2(ctx, point, a, b, width, color)
{
	ctx.save();
	
	// Запоминаем положение системы координат (CК) и масштаб
	if (color == "R")
		ctx.strokeStyle = '#f00';
	else if (color == "G")
		ctx.strokeStyle = '#0f0';
	else if (color == "B")
		ctx.strokeStyle = '#00f';		
	
	else if (color == "Brown") 
		ctx.strokeStyle = '#A52A2A';
	else if (color == "DarkOrchid") 
		ctx.strokeStyle = '#9932CC';
	else if (color == "Gray") 
		ctx.strokeStyle = '#808080';
	else if (color == "Black") 
		ctx.strokeStyle = '#000';	
	else if (color == "Maroon")
		ctx.strokeStyle = '#800000';
	else if (color == "Purple")
		ctx.strokeStyle = '#800080';
	else
		ctx.strokeStyle = color;	
	
	ctx.lineWidth = width;
	
	ctx.beginPath();

	// Переносим СК в центр будущего эллипса
	ctx.translate(fx(point[0]), fy(point[1]));

	/*
	* Масштабируем по х.
	* Теперь нарисованная окружность вытянется в a / b раз
	* и станет эллипсом
	*/

	ctx.scale(a / b, 1);

	// Рисуем окружность, которая благодаря масштабированию станет эллипсом
	ctx.arc(0, 0, b*SCALE, 0, Math.PI * 2, true);

	ctx.closePath();
	ctx.stroke();
	// Восстанавливаем СК и масштаб
	ctx.restore();
}			


///
	
	
	( function() {
		

	elem = document.getElementById('canvas_01'); // получаем ссылку на элемент canvas_draw 
	elem.style.position = "relative";
	elem.style.border = "1px solid";
	ctx = elem.getContext("2d"); // получаем 2D-контекст рисования на холсте
	
	ctx.font = "italic 10pt Arial";
	ctx.fillStyle = '#0000ff';	

	// Установка первоначальных значений в dat.GUI.
    controller = new function() 
	{
		this.theta = theta / DEGREE;
		// this.theta_2 = theta_2 / DEGREE;
    }();
	
	// Создаем новый объект dat.GUI с правой стороны от canvas.
	// В dat.GUI будут отображаться значения параметров модели, углы поворота модели и т.д.
	gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'gui';
	gui_container1.appendChild(gui.domElement);
	
	var f1 = gui.addFolder('Angle  θ (°)');
	f1.add( controller, 'theta', 0.0, 720 ).onChange( function() 
	{
		theta = (controller.theta)* DEGREE;
		draw();
	});
/*	
	f1.add( controller, 'theta_2', 0.0, 720 ).onChange( function() 
	{
		theta_2 = (controller.theta_2)* DEGREE;
		draw();
	});
*/
	f1.open();
	draw();

	} () );

}	

//window.onload = lines2;