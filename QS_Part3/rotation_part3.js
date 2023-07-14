// rotations.js

var delta_rot = 10 * DEGREE;

var obs = [];
var obs_XY = [];

var sphere_rotation = [];
var sphere_rotation_XY = [];

// Для комплексной плоскости
var point_cross;

pt_cross = new Point3D(0,0,0);
pt_cross2 = new Point3D(0,0,0);

var what_color = 0;

var spinor_line;
var spinor_line_2;

var point_cross_begin;

var axis_N;

function N_plus()
{
	var theta = polar_electron; // географическая широта вектора Блоха
	var fi = azimuth_electron;  // географическая долгота вектора Блоха
	var alpha = delta_rot;      // угол на который надо совершить поворот вектора Блоха

	var alpha_grad = alpha/DEGREE;

	var t = Math.cos(alpha/2);
	var u = Math.sin(alpha/2);
	
	// axis_rotation();
	
	var nx = Math.sin(polar) * Math.cos(azimuth);
	var ny = Math.sin(polar) * Math.sin(azimuth);
	var nz = Math.cos(polar);

	var c =   Math.cos(theta/2);
	var d =   Math.sin(theta/2);

	var real_1 = t*c + u*nx*Math.sin(fi)*d - u*ny*Math.cos(fi)*d;
	var imag_1 = -u*nz*c - u*nx*d*Math.cos(fi) - u*ny*Math.sin(fi)*d;

	var real_2 = u*ny*c + d*t*Math.cos(fi) - d*u*nz*Math.sin(fi);
	var imag_2 = d*t*Math.sin(fi) + d*u*nz*Math.cos(fi) - u*nx*c;

	/////////////////////////////////////////////////////////////

	var r1 = Math.sqrt(Math.abs(real_1)*Math.abs(real_1) +
					   Math.abs(imag_1)*Math.abs(imag_1));
	var fi_1 = Math.atan2(imag_1, real_1);

	var r2 = Math.sqrt(Math.abs(real_2)*Math.abs(real_2) +
					   Math.abs(imag_2)*Math.abs(imag_2));
	var fi_2 = Math.atan2(imag_2, real_2);

	var ang_fi = fi_2 - fi_1;
		

	var ang1 = Math.acos(r1);
	// var ang2 = Math.asin(r2);
	// var ang3 = Math.atan2(r1, r2);
	// var ang4 = Math.atan2(r2, r1);

	polar_electron = 2*ang1;
	
	if (polar_electron > 179*DEGREE)
	{
		azimuth_electron = 0.0;
	}
	else
	{
		azimuth_electron = ang_fi;
	}
	
	var r = 12; // радиус сферы Блоха

	var spinor_x = r * Math.sin(polar_electron) * Math.cos(azimuth_electron + Math.PI/2);
	var spinor_y = r * Math.sin(polar_electron) * Math.sin(azimuth_electron + Math.PI/2);
	var spinor_z = r * Math.cos(polar_electron);

	// приводим в соответствие системы координат
	var X = - spinor_x;
	var Y =   spinor_z;
	var Z =   spinor_y;
	
	// запоминаем для последующего стирания
	obs.push(new THREE.Vector3(X, Y, Z ));

	// перерисовываем и обновляем данные
	recalc();
	controller.polar_electron = 2 * ang1 / DEGREE;

	var angle_azim = azimuth_electron/DEGREE;

	if (angle_azim <= 0)
	{
		var n = Math.abs(Math.ceil(angle_azim/360));
		angle_azim = 360 + angle_azim + 360 * n;
	}
	if (angle_azim > 360)
	{
		var n = Math.floor(angle_azim/360);
		var angle_azim = angle_azim - 360 * n;
	}	
	controller.azimuth_electron = angle_azim;	
	gui.updateDisplay();	
}

function N_minus()
{
	var theta = polar_electron; // географическая широта вектора Блоха
	var fi = azimuth_electron;  // географическая долгота вектора Блоха
	var alpha = - delta_rot;      // угол на который надо совершить поворот вектора Блоха

	var alpha_grad = alpha/DEGREE;

	var t = Math.cos(alpha/2);
	var u = Math.sin(alpha/2);

	// axis_rotation();
	
	var nx = Math.sin(polar) * Math.cos(azimuth);
	var ny = Math.sin(polar) * Math.sin(azimuth);
	var nz = Math.cos(polar);

	var c =   Math.cos(theta/2);
	var d =   Math.sin(theta/2);

	var real_1 = t*c + u*nx*Math.sin(fi)*d - u*ny*Math.cos(fi)*d;
	var imag_1 = -u*nz*c - u*nx*d*Math.cos(fi) - u*ny*Math.sin(fi)*d;

	var real_2 = u*ny*c + d*t*Math.cos(fi) - d*u*nz*Math.sin(fi);
	var imag_2 = d*t*Math.sin(fi) + d*u*nz*Math.cos(fi) - u*nx*c;

	/////////////////////////////////////////////////////////////

	var r1 = Math.sqrt(Math.abs(real_1)*Math.abs(real_1) +
					   Math.abs(imag_1)*Math.abs(imag_1));
	var fi_1 = Math.atan2(imag_1, real_1);

	var r2 = Math.sqrt(Math.abs(real_2)*Math.abs(real_2) +
					   Math.abs(imag_2)*Math.abs(imag_2));
	var fi_2 = Math.atan2(imag_2, real_2);

	var ang_fi = fi_2 - fi_1;

	var ang1 = Math.acos(r1);
	// var ang2 = Math.asin(r2);
	// var ang3 = Math.atan2(r1, r2);
	// var ang4 = Math.atan2(r2, r1);

	polar_electron = 2*ang1;
	if (polar_electron > 179*DEGREE)
	{
		azimuth_electron = 0.0;
	}
	else
	{
		azimuth_electron = ang_fi;
	}
	// azimuth_electron = ang_fi;
	
	var r = 12; // радиус сферы Блоха

	var spinor_x = r * Math.sin(polar_electron) * Math.cos(azimuth_electron + Math.PI/2);
	var spinor_y = r * Math.sin(polar_electron) * Math.sin(azimuth_electron + Math.PI/2);
	var spinor_z = r * Math.cos(polar_electron);

	// приводим в соответствие системы координат
	var X = - spinor_x;
	var Y =   spinor_z;
	var Z =   spinor_y;
	
	// запоминаем для последующего стирания
	obs.push(new THREE.Vector3(X, Y, Z ));

	// перерисовываем и обновляем данные
	recalc();
	controller.polar_electron = 2 * ang1 / DEGREE;

	var angle_azim = azimuth_electron/DEGREE;

	if (angle_azim <= 0)
	{
		var n = Math.abs(Math.ceil(angle_azim/360));
		angle_azim = 360 + angle_azim + 360 * n;
	}
	if (angle_azim > 360)
	{
		var n = Math.floor(angle_azim/360);
		var angle_azim = angle_azim - 360 * n;
	}	
	controller.azimuth_electron = angle_azim;	
	gui.updateDisplay();	
}

function X_plus()
{
	var theta = polar_electron; // географическая широта вектора Блоха
	var fi = azimuth_electron;  // географическая долгота вектора Блоха
	var alpha = delta_rot;      // угол на который надо совершить поворот вектора Блоха

	//   Находим произведение квадратной  матрицы (2x2) [  a    i· b ] 
	//                                                  [i· b     a   ]
	//          на матрицу столбец (2x1) [c, d·exp(i*fi) ]
	//
	//           a    i· b                        c
	//  матрицу             умножаем на матрицу
	//           i· b   a                       d· exp(i· fi)
	
	var a =   Math.cos(alpha/2);
	var b = - Math.sin(alpha/2);  // !! берем со знаком "-"
	
	var c =   Math.cos(theta/2);
	var d =   Math.sin(theta/2);
	
	var real_1 = a*c - b*d*Math.sin(fi); // действительная часть верхнего элемента результ. матрицы
	var imag_1 = b*d*Math.cos(fi);       // мнимая часть верхнего элемента результ. матрицы
	
	var real_2 = a*d*Math.cos(fi);       // действительная часть нижнего элемента результ. матрицы
	var imag_2 = b*c + a*d*Math.sin(fi); // мнимая часть нижнего элемента результ. матрицы
	
	// верхний элемент в показат. форме
	var r1 = Math.sqrt(Math.abs(real_1)*Math.abs(real_1) +
					   Math.abs(imag_1)*Math.abs(imag_1));
					   
	var fi_1 = Math.atan2(imag_1, real_1);
	
	// нижний элемент в показат. форме
	var r2 = Math.sqrt(Math.abs(real_2)*Math.abs(real_2) +
					   Math.abs(imag_2)*Math.abs(imag_2));
					   
	var fi_2 = Math.atan2(imag_2, real_2);	
	
	// приращение угла
	var ang_fi = (fi_2 - fi_1);
	
	// ang2 = Math.acos(r1);
	ang1 = Math.asin(r2);
	
	polar_electron = 2*ang1;
	azimuth_electron = ang_fi;
	
	var r = 12; // радиус сферы Блоха

	var spinor_x = r * Math.sin(polar_electron) * Math.cos(azimuth_electron + Math.PI/2);
	var spinor_y = r * Math.sin(polar_electron) * Math.sin(azimuth_electron + Math.PI/2);
	var spinor_z = r * Math.cos(polar_electron);

	// приводим в соответствие системы координат
	var X = - spinor_x;
	var Y =   spinor_z;
	var Z =   spinor_y;
	
	// запоминаем для последующего стирания
	obs.push(new THREE.Vector3(X, Y, Z ));

	// перерисовываем и обновляем данные
	recalc();
	controller.polar_electron = 2 * ang1 / DEGREE;

	var angle_azim = azimuth_electron/DEGREE;

	if (angle_azim <= 0)
	{
		var n = Math.abs(Math.ceil(angle_azim/360));
		angle_azim = 360 + angle_azim + 360 * n;
	}
	if (angle_azim > 360)
	{
		var n = Math.floor(angle_azim/360);
		var angle_azim = angle_azim - 360 * n;
	}	
	controller.azimuth_electron = angle_azim;	
	gui.updateDisplay();
}

function X_minus()
{
	var theta = polar_electron;
	var fi = azimuth_electron;
	var alpha = - delta_rot;
	
	var a =   Math.cos(alpha/2);
	var b = - Math.sin(alpha/2);
	
	var c =   Math.cos(theta/2);
	var d =   Math.sin(theta/2);
	
	var real_1 = a*c - b*d*Math.sin(fi);
	var imag_1 = b*d*Math.cos(fi);
	
	var real_2 = a*d*Math.cos(fi);
	var imag_2 = b*c + a*d*Math.sin(fi);	
	
	var r1 = Math.sqrt(Math.abs(real_1)*Math.abs(real_1) +
					   Math.abs(imag_1)*Math.abs(imag_1));
					   
	var fi_1 = Math.atan2(imag_1, real_1);
	
	var r2 = Math.sqrt(Math.abs(real_2)*Math.abs(real_2) +
					   Math.abs(imag_2)*Math.abs(imag_2));
					   
	var fi_2 = Math.atan2(imag_2, real_2);	
	
	var ang_fi = (fi_2 - fi_1);
	
	ang2 = Math.acos(r1);
	ang1 = Math.asin(r2);
	
	polar_electron = 2*ang1;
	azimuth_electron = ang_fi;
	
	var r = 12;
	var spinor_x = r * Math.sin(polar_electron) * Math.cos(azimuth_electron + Math.PI/2);
	var spinor_y = r * Math.sin(polar_electron) * Math.sin(azimuth_electron + Math.PI/2);
	var spinor_z = r * Math.cos(polar_electron);

	// приводим в соответствие системы координат
	var X = - spinor_x;
	var Y =   spinor_z;
	var Z =   spinor_y;

	obs.push(new THREE.Vector3(X, Y, Z ));

	recalc();
	controller.polar_electron = 2 * ang1 / DEGREE;
	
	var angle_azim = azimuth_electron/DEGREE;

	if (angle_azim <= 0)
	{
		var n = Math.abs(Math.ceil(angle_azim/360));
		angle_azim = 360 + angle_azim + 360 * n;
	}
	if (angle_azim > 360)
	{
		var n = Math.floor(angle_azim/360);
		var angle_azim = angle_azim - 360 * n;
	}	
	controller.azimuth_electron = angle_azim;
	gui.updateDisplay();
}

function Y_plus()
{
	var theta = polar_electron;
	var fi = azimuth_electron;
	var alpha = delta_rot;
	
	var a =   Math.cos(alpha/2);
	var b =   Math.sin(alpha/2);
	
	var c =   Math.cos(theta/2);
	var d =   Math.sin(theta/2);
	
	var real_1 = a*c - b*d*Math.cos(fi);
	var imag_1 = - b*d*Math.sin(fi); // !!!!!
	
	var real_2 = b*c + a*d*Math.cos(fi);
	var imag_2 = a*d*Math.sin(fi);
	
	
	var r1 = Math.sqrt(Math.abs(real_1)*Math.abs(real_1) +
					   Math.abs(imag_1)*Math.abs(imag_1));
					   
	var fi_1 = Math.atan2(imag_1, real_1);
	
	var r2 = Math.sqrt(Math.abs(real_2)*Math.abs(real_2) +
					   Math.abs(imag_2)*Math.abs(imag_2));
					   
	var fi_2 = Math.atan2(imag_2, real_2);	
	
	var ang_fi = fi_2 - fi_1;
	
	ang1 = Math.acos(r1);
	ang2 = Math.asin(r2);
	
	polar_electron = 2*ang1;
	azimuth_electron = ang_fi;
	
	var r = 12;
	var spinor_x = r * Math.sin(polar_electron) * Math.cos(azimuth_electron + Math.PI/2);
	var spinor_y = r * Math.sin(polar_electron) * Math.sin(azimuth_electron + Math.PI/2);
	var spinor_z = r * Math.cos(polar_electron);

	// приводим в соответствие системы координат
	var X = - spinor_x;
	var Y =   spinor_z;
	var Z =   spinor_y;
	
	obs.push(new THREE.Vector3(X, Y, Z ));

	recalc();
	controller.polar_electron = 2 * ang1 / DEGREE;
	
	var angle_azim = azimuth_electron/DEGREE;

	if (angle_azim <= 0)
	{
		var n = Math.abs(Math.ceil(angle_azim/360));
		angle_azim = 360 + angle_azim + 360 * n;
	}
	if (angle_azim > 360)
	{
		var n = Math.floor(angle_azim/360);
		var angle_azim = angle_azim - 360 * n;
	}	

	controller.azimuth_electron = angle_azim;
	gui.updateDisplay();
}

function Y_minus()
{
	var theta = polar_electron;
	var fi = azimuth_electron;
	var alpha = - delta_rot;
	
	var a =   Math.cos(alpha/2);
	var b =   Math.sin(alpha/2);
	
	var c =   Math.cos(theta/2);
	var d =   Math.sin(theta/2);
	
	var real_1 = a*c - b*d*Math.cos(fi);
	var imag_1 = - b*d*Math.sin(fi);
	
	var real_2 = b*c + a*d*Math.cos(fi);
	var imag_2 = a*d*Math.sin(fi);
	
	var r1 = Math.sqrt(Math.abs(real_1)*Math.abs(real_1) +
					   Math.abs(imag_1)*Math.abs(imag_1));
					   
	var fi_1 = Math.atan2(imag_1, real_1);
	
	var r2 = Math.sqrt(Math.abs(real_2)*Math.abs(real_2) +
					   Math.abs(imag_2)*Math.abs(imag_2));
					   
	var fi_2 = Math.atan2(imag_2, real_2);	
	
	var ang_fi = fi_2 - fi_1;
	
	ang1 = Math.acos(r1);
	ang2 = Math.asin(r2);
	
	polar_electron = 2*ang1;
	azimuth_electron = ang_fi;
	
	var r = 12;
	var spinor_x = r * Math.sin(polar_electron) * Math.cos(azimuth_electron + Math.PI/2);
	var spinor_y = r * Math.sin(polar_electron) * Math.sin(azimuth_electron + Math.PI/2);
	var spinor_z = r * Math.cos(polar_electron);

	// приводим в соответствие системы координат
	var X = - spinor_x;
	var Y =   spinor_z;
	var Z =   spinor_y;
	
	obs.push(new THREE.Vector3(X, Y, Z ));

	recalc();
	controller.polar_electron = 2 * ang1 / DEGREE;
	
	var angle_azim = azimuth_electron/DEGREE;

	if (angle_azim <= 0)
	{
		var n = Math.abs(Math.ceil(angle_azim/360));
		angle_azim = 360 + angle_azim + 360 * n;
	}
	if (angle_azim > 360)
	{
		var n = Math.floor(angle_azim/360);
		var angle_azim = angle_azim - 360 * n;
	}	
	controller.azimuth_electron = angle_azim;

	gui.updateDisplay();
}

function Z_plus()
{
	azimuth_electron = azimuth_electron + delta_rot;

	var r = 12;
	var spinor_x = r * Math.sin(polar_electron) * Math.cos(azimuth_electron + Math.PI/2);
	var spinor_y = r * Math.sin(polar_electron) * Math.sin(azimuth_electron + Math.PI/2);
	var spinor_z = r * Math.cos(polar_electron);

	// приводим в соответствие системы координат
	var X = - spinor_x;
	var Y =   spinor_z;
	var Z =   spinor_y;

	obs.push(new THREE.Vector3(X, Y, Z ));   

	recalc();

	var angle_azim = azimuth_electron/DEGREE;

	if (angle_azim < 0)
	{
		var n = Math.abs(Math.ceil(angle_azim/360));
		angle_azim = 360 + angle_azim + 360 * n;
	}
	if (angle_azim > 360)
	{
		var n = Math.floor(angle_azim/360);
		angle_azim = angle_azim - 360 * n;
	}	
	controller.azimuth_electron = angle_azim;
	gui.updateDisplay();		
}

function Z_minus()
{
	azimuth_electron = azimuth_electron - delta_rot;

	var r = 12;
	var spinor_x = r * Math.sin(polar_electron) * Math.cos(azimuth_electron + Math.PI/2);
	var spinor_y = r * Math.sin(polar_electron) * Math.sin(azimuth_electron + Math.PI/2);
	var spinor_z = r * Math.cos(polar_electron);

	// приводим в соответствие системы координат
	var X = - spinor_x;
	var Y =   spinor_z;
	var Z =   spinor_y;

	obs.push(new THREE.Vector3(X, Y, Z ));   

	recalc();

	var angle_azim = azimuth_electron/DEGREE;

	if (angle_azim <= 0)
	{
		var n = Math.abs(Math.ceil(angle_azim/360));
		angle_azim = 360 + angle_azim + 360 * n;
	}
	if (angle_azim > 360)
	{
		var n = Math.floor(angle_azim/360);
		var angle_azim = angle_azim - 360 * n;
	}	
	controller.azimuth_electron = angle_azim;
	gui.updateDisplay();		
}

function Deg2()
{	
	var bt = document.getElementById('btn_Deg2');
	bt.style.background = '#44dd44';
	
	bt = document.getElementById('btn_Deg5');
	bt.style.background = '#bbbbbb';
	
	bt = document.getElementById('btn_Deg10');
	bt.style.background = '#bbbbbb';
	
	delta_rot = DEGREE*2;
	recalc();
}

function Deg5()
{	
	var bt = document.getElementById('btn_Deg5');
	bt.style.background = '#44dd44';
	
	bt = document.getElementById('btn_Deg10');
	bt.style.background = '#bbbbbb';
	
	bt = document.getElementById('btn_Deg2');
	bt.style.background = '#bbbbbb';
	
	delta_rot = DEGREE*5;
	recalc();
}

function Deg10()
{		
	var bt = document.getElementById('btn_Deg10');
	bt.style.background = '#44dd44';
	
	bt = document.getElementById('btn_Deg5');
	bt.style.background = '#bbbbbb';
	
	bt = document.getElementById('btn_Deg2');
	bt.style.background = '#bbbbbb';
	
	delta_rot = DEGREE*10;
	recalc();
}

function clear_rotation()
{	
	var i = 0;
	var yyy = sphere_rotation.length;
	var rrr = obs.length;
	for (i = 0; i < sphere_rotation.length; i++)
	{
		scene.remove(sphere_rotation[i]);
	}
	
	for (i = 0; i < sphere_rotation_XY.length; i++)
	{
		scene.remove(sphere_rotation_XY[i]);
	}
	
	obs.length = 0;
	sphere_rotation.length = 0;
	obs_XY.length = 0;
	sphere_rotation_XY.length = 0;
	recalc();
	
	scene.remove(axis_N);
}

function X_Pauli()
{
	polar_electron = Math.PI - polar_electron;
	azimuth_electron = -azimuth_electron;
	
	recalc();
	controller.polar_electron = polar_electron / DEGREE;
	controller.azimuth_electron = azimuth_electron/DEGREE;
	gui.updateDisplay();		
}

function Y_Pauli()
{
	polar_electron = Math.PI - polar_electron;
	azimuth_electron = Math.PI - azimuth_electron;

	recalc();
	controller.polar_electron = 2 * ang1 / DEGREE;
	controller.azimuth_electron = azimuth_electron/DEGREE;
	gui.updateDisplay();		
}

function Z_Pauli()
{
	polar_electron = polar_electron;
	azimuth_electron = Math.PI + azimuth_electron;	

	recalc();
	controller.polar_electron = 2 * ang1 / DEGREE;
	controller.azimuth_electron = azimuth_electron/DEGREE;
	gui.updateDisplay();		
}

function Hadamard()
{
	var theta = polar_electron;
	var fi = azimuth_electron;
	
	var k = 1 / Math.sqrt(2);
	// после умножения на матрицу Адамара получаем вектор из одного столбца и двух строк в нем
	var real_1 = k * Math.cos(theta/2) + k * Math.sin(theta/2) * Math.cos(fi);  // real первая строка
	var imag_1 = k * Math.sin(theta/2) * Math.sin(fi);                          // imgine  первая строка
	var real_2 = k * Math.cos(theta/2) - k * Math.sin(theta/2) * Math.cos(fi);  // real вторая строка
	var imag_2 = - k * Math.sin(theta/2) * Math.sin(fi);                        // imgine вторая строка
	
	// переводим в экспоненциальную форму обе строки
	var r1 = Math.sqrt(Math.abs(real_1)*Math.abs(real_1) +
					   Math.abs(imag_1)*Math.abs(imag_1));
					   
	var fi_1 = Math.atan2(imag_1, real_1);
	
	var r2 = Math.sqrt(Math.abs(real_2)*Math.abs(real_2) +
					   Math.abs(imag_2)*Math.abs(imag_2));
					   
	var fi_2 = Math.atan2(imag_2, real_2);	
	
	var ang_fi = fi_2 - fi_1;  // находим азимут вектора Блоха
	
	ang1 = Math.acos(r1); // находим половину угла наклона (географическая широта) 
	ang2 = Math.asin(r2); // находим ang2, для того чтобы 
	                      // проверить, что ang1 = ang2
	
	polar_electron = 2*ang1;
	azimuth_electron = ang_fi;
	
	recalc();
	controller.polar_electron = 2 * ang1 / DEGREE;
	controller.azimuth_electron = azimuth_electron/DEGREE;
	gui.updateDisplay();		
}

function rotation_all_points()
{
	// квантовые вращения на сфере Блоха
	var r = 12;
	
	var spinor_teta = 0.5 * polar_electron;
	var spinor_teta = polar_electron;
	// var spinor_fi = azimuth_electron + Math.PI/2;
	var spinor_fi = azimuth_electron;

	var spinor_x = r * Math.sin(spinor_teta) * Math.cos(spinor_fi);
	var spinor_y = r * Math.sin(spinor_teta) * Math.sin(spinor_fi);
	var spinor_z = r * Math.cos(spinor_teta);
	//console.log("****SPIN x = ", spinor_x);
	//console.log("****SPIN y = ", spinor_y);
	//console.log("****SPIN z = ", spinor_z);	
	//console.log("******");	
	
	var X = spinor_y;
	var Y = spinor_z;
	var Z = spinor_x;

	if (polar_electron > 179*DEGREE)
	{
		pt_cross[0] = 200;
		pt_cross[1] = 0;
		pt_cross[2] = 200;
		
		pt_cross2[0] = 200;
		pt_cross2[1] = 0;
		pt_cross2[2] = 200;
	}
	else
	{
		var line_sp = new Line3D(new Point3D(0, -r, 0), new Point3D(X, Y, Z));
		var line_sp2 = new Line3D(new Point3D(0, -1, 0), new Point3D(X/r, Y/r, Z/r));
	
		var pt1 = new Point3D(0, 0, 0);
		var pt2 = new Point3D(1, 0, 0);
		var pt3 = new Point3D(0, 0, 1);
		var plane = new Plane3D();
		plane.CreatePlaneThreePoints(pt1, pt2, pt3);
		pt_cross = line_sp.IntersectionLinePlane(plane);
	
		pt_cross2 = line_sp2.IntersectionLinePlane(plane);
	}
	
	console.log("pt_cross[0] = ", pt_cross[0]);
	console.log("pt_cross[1] = ", pt_cross[1]);
	console.log("pt_cross[2] = ", pt_cross[2]);	
	console.log("******");	
		
	scene.remove(spinor_line);
	scene.remove(spinor_line_2);

	var material_line = new THREE.LineBasicMaterial( { color: 0xff0000 } );
	points = [];
	points.push( new THREE.Vector3(0, -r, 0 ) );
	points.push( new THREE.Vector3(pt_cross[0], pt_cross[1], pt_cross[2]));
	var geometry_line = new THREE.BufferGeometry().setFromPoints( points );
	spinor_line = new THREE.Line( geometry_line, material_line  );
	scene.add( spinor_line );
	
	points = [];
	points.push( new THREE.Vector3(X, Y, Z) );
	points.push( new THREE.Vector3(pt_cross[0], pt_cross[1], pt_cross[2]));
	geometry_line = new THREE.BufferGeometry().setFromPoints( points );
	spinor_line_2 = new THREE.Line( geometry_line, material_line  );
	scene.add( spinor_line_2 );
	
	var pointGeometry = new THREE.SphereGeometry(0.2, 32, 12);
	var pointMaterial = new THREE.MeshBasicMaterial({color: 0x000000, opacity: 0.5, transparent: false });
	pointMaterial.side = THREE.FrontSide;
	pointMaterial.shading = THREE.FlatShading;
	point_cross = new THREE.Mesh(pointGeometry, pointMaterial);
	point_cross.position.set(pt_cross[0], pt_cross[1], pt_cross[2]);
	
	obs_XY.push(new THREE.Vector3(pt_cross[0], pt_cross[1], pt_cross[2] ));
	
	print_complex();  // Вывод текста в левой части окна
	
	var i = 0;
	for (i = 0; i < obs.length; i++)
	{
		var sphere_point;
		var rs_point = 0.2; // sphere_point radius
		var sphereGeometry = new THREE.SphereGeometry(rs_point, 6, 6);
		var sphereMaterial = new THREE.MeshBasicMaterial({color: 0xcc0000});

		sphereMaterial.side = THREE.FrontSide;
		sphereMaterial.shading = THREE.FlatShading;
		sphere_point = new THREE.Mesh(sphereGeometry, sphereMaterial);

		// position the sphere
		var point_i = obs[i];
		
		sphere_point.position.x = point_i.x;
		sphere_point.position.y = point_i.y;
		sphere_point.position.z = point_i.z;
		
		sphere_rotation.push(sphere_point);
		scene.add(sphere_point);
	}
	
	for (i = 0; i < obs_XY.length; i++)
	{
		var rs_pt = 0.3; // Sphere radius
		var sphereGeometry = new THREE.SphereGeometry(rs_pt, 6, 6);
		var sphereMaterial = new THREE.MeshBasicMaterial({color: 0x000000});

		sphereMaterial.side = THREE.FrontSide;
		sphereMaterial.shading = THREE.FlatShading;
		var sphere_pt = new THREE.Mesh(sphereGeometry, sphereMaterial);

		// position the sphere
		var point_i = obs_XY[i];
		
		sphere_pt.position.x = point_i.x;
		sphere_pt.position.y = point_i.y;
		sphere_pt.position.z = point_i.z;
		
		sphere_rotation_XY.push(sphere_pt);
		scene.add(sphere_pt);
	}
}

function print_complex()
{
	var elem = document.getElementById('canvas_draw');
	ctx_hud_1.clearRect(0, 0, elem.width, elem.height);
	
	var cos_teta = Math.cos(polar_electron/2);
	var sin_teta = Math.sin(polar_electron/2);
	var b = Math.sin(polar_electron/2) * Math.cos(azimuth_electron);
	var c = Math.sin(polar_electron/2) * Math.sin(azimuth_electron);
	
	var text_cos_teta = roundNumber(cos_teta, 3);
	var text_sin_teta = roundNumber(sin_teta, 3);
	text_b = roundNumber(b, 3);
	text_c = roundNumber(c, 3);	
	
	ctx_hud_1.font = 'bold 18px "Times New Roman"';
	var text_color = "#000";
	var value_color = "#00f";
	ctx_hud_1.fillStyle = text_color;
	
	var azimuth_electron_DEGREE = azimuth_electron/DEGREE;

	if (azimuth_electron_DEGREE < 0)
	{
		var n = Math.abs(Math.ceil(azimuth_electron_DEGREE/360));
		azimuth_electron_DEGREE = 360 + azimuth_electron_DEGREE + 360 * n;
	}
	if (azimuth_electron_DEGREE > 360)
	{
		var n = Math.floor(azimuth_electron_DEGREE/360);
		azimuth_electron_DEGREE = azimuth_electron_DEGREE - 360 * n;
	}	
	
	var fi = roundNumber(azimuth_electron_DEGREE, 0) + "°) · |1〉";
	
	var rez = "|ψ〉  =  " + 
				"(" + text_cos_teta + ") · |0〉 " + " + " +
			" (" + text_sin_teta + ") ";
	var rez = rez + "· exp(i·" + fi;
	
	ctx_hud_1.fillText(rez, 50, 515);	
	
	//////////////////////////////////////////////////
	// complex plane
	//////////////////////////////////////////////////
	if (polar_electron > 179.0 * DEGREE)
	{	
		ctx_hud_1.font = 'bold 32px "Times New Roman"'; 
		ctx_hud_1.fillStyle = "#ff0000";	
		ctx_hud_1.fillText("ζ = ∞ ", 480, 515);
		return;
	}

	// точки пересечения прямой с плоскостью OXY
	var y = pt_cross2[0];  // x
	var z = pt_cross2[1];  // y //////!!!!!!
	var x = pt_cross2[2];  // z

	var text_y = roundNumber(y, 3);
	var text_z = roundNumber(z, 3);	
	var text_x = roundNumber(x, 3);	
	
	var text_x_abs = Math.abs(roundNumber(x, 3));
	var text_y_abs = Math.abs(roundNumber(y, 3));
	
	if (x >= 0)
	{
		text_x_abs = text_x_abs;
	}
	else
	{
		text_x_abs = "- " + text_x_abs;
	}
	
	if (y >= 0)
	{
		text_y_abs = " + " + text_y_abs;
	}
	else
	{
		text_y_abs = " - " + text_y_abs;
	}
	
	ctx_hud_1.font = '24px "Times New Roman"'; 
	ctx_hud_1.fillStyle = "#000000";
	//ctx_hud_1.fillText("ζ = " + text_pp_x + " - " + text_pp_y_abs + "·i", 480, 515);
	
	ctx_hud_1.fillText("ζ = " + text_x_abs + text_y_abs + "·i", 480, 515);
}

function PointCross()
{
	if (polar_electron > 179*DEGREE)
	{
		pt_cross[0] = 200;
		pt_cross[1] = 0;
		pt_cross[2] = 200;
		
		pt_cross2[0] = 200;
		pt_cross2[1] = 0;
		pt_cross2[2] = 200;
	}
	else
	{
		var line_sp = new Line3D(new Point3D(0, -r, 0), new Point3D(X, Y, Z));
		var line_sp2 = new Line3D(new Point3D(0, -1, 0), new Point3D(X/r, Y/r, Z/r));
	
		var pt1 = new Point3D(0, 0, 0);
		var pt2 = new Point3D(1, 0, 0);
		var pt3 = new Point3D(0, 0, 1);
		var plane = new Plane3D();
		plane.CreatePlaneThreePoints(pt1, pt2, pt3);
		pt_cross = line_sp.IntersectionLinePlane(plane);
	
		pt_cross2 = line_sp2.IntersectionLinePlane(plane);
	}
	
	
	var pointGeometry = new THREE.SphereGeometry(0.2, 6, 6);
	var pointMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
	point_cross_begin = new THREE.Mesh(pointGeometry, pointMaterial);
	point_cross_begin.position.set(pt_cross[0], pt_cross[1], pt_cross[2]);
	
	scene.add(point_cross_begin);
}		

function axis_rotation()
{
	if (psi == false)
		return;
	// var gamma = polar;
	// var omega = azimuth;

	var nx = Math.sin(polar) * Math.cos(azimuth);
	var ny = Math.sin(polar) * Math.sin(azimuth);
	var nz = Math.cos(polar);

	scene.remove(axis_N);
	var rs = 12;
	
	var lineMaterial = new THREE.LineBasicMaterial({ color: 0x005500 });

	var startVector = new THREE.Vector3( -rs*ny, -rs*nz, -rs*nx );
	var endVector = new THREE.Vector3( rs*ny, rs*nz, rs*nx );

	var linePoints = [];
	linePoints.push(startVector, endVector);

	  // Create Tube Geometry
	var tubeGeometry = new THREE.TubeGeometry
	(		
		new THREE.CatmullRomCurve3(linePoints),
		256,// path segments
		0.2,// THICKNESS
		4, //Roundness of Tube
		false //closed
	);

	axis_N = new THREE.Line(tubeGeometry, lineMaterial);
	scene.add(axis_N);
}