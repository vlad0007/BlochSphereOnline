// sg.js

// var DEGREE = 0.01745329251994; // величина углового градуса в радианах
var DEGREE = Math.PI/180;

var canvas; 	// Ссылка на элемент по его идентификатору (id = "canvas_draw") для отображения 3D-модели.

var hud_1; 		// Ссылка на элемент id = "hud_1". Двумерный канвас для отображения текста в левой части окна.
var ctx_hud_1;	// контекст для рисования на холсте в левой части окна.
				// Положение hud_1 совпадает с положением canvas_draw. Но у canvas_draw z-index = 1, а у hud_1 z-index = 0.

var hud_2; 		// Ссылка на элемент id = "hud_2". Двумерный канвас для отображения текста в средней части окна.
var ctx_hud_2; 	// контекст для рисования на холсте в средней части окна.

var hud_3; 		// правый нижний холст для отображеня значений |ψ〉 
var ctx_hud_3;	// контекст для рисования значений |ψ〉 

var gui; 		// объект dat.GUI
var controller; // В объекте controller определяем свойства для параметров модели и их начальные значения.
				
var scene, camera, renderer, orbitControl;

var sphere; // объект сферы S-G или Bloch sphere - главная сфера в этой программе

var azimuth_electron = 0 * DEGREE;
var polar_electron = Math.PI/6; // начальное значение

var azimuth = 0;
var polar = 0;

var mesh_spin_arrow;
var mesh_device_arrow;
var cube_measurement; // включается по нажатию кнопки "Measurement"

var meshText_A;
var meshText_B;
var meshText_D;

var prb;

var cos_alpha;

var psi = false; // false - S-G, true - Bloch sphere

// 3D-символы
var meshText_0, meshText_1, meshText_plus_i, meshText_minus_i;
var meshText_plus_1x, meshText_minus_1x;
var meshText_plus_1y, meshText_minus_1y;
var meshText_minus_1z;

var complexText; // Complex plane

var meshText_X_plus, meshText_X_minus, meshText_Y_plus, meshText_Y_minus;

var color_psi = 0x0000aa; // цвет текста 3D символов осей

var axis_X, axis_X_BS, axis_Y_BS, axis_Y_BS1;
var plane_OXY;

var down_SG, down_BS; // цвета точки пересечения оси OZ с главной сферой

var f2; // в контроллере GUI относится к device или оси вращения N

var axis_N; // ось вращения N

var img1, img2;

function init()
{
	hud_3 = document.getElementById("quant_params");

	ctx_hud_3 = hud_3.getContext('2d');
	if (!ctx_hud_3) 
	{
		console.log('Failed to get rendering context');
		return;
	}	

	canvas = document.getElementById("canvas_draw");
	hud_1 = document.getElementById("hud_1");
	ctx_hud_1 = hud_1.getContext('2d');
	if (!ctx_hud_1) 
	{
		console.log('Failed to get rendering context');
		return;
	}	
	
	hud_2 = document.getElementById("hud_2");
	ctx_hud_2 = hud_2.getContext('2d');
	if (!ctx_hud_2) 
	{
		console.log('Failed to get rendering context');
		return;
	}		
	
	/////////////////////////////////////////////////////////////////////////
	// Для задания значений параметров будем использовать библиотеку dat.GUI
	// В объекте controller определяем свойства для параметров модели и их
	// начальные значения.
	/////////////////////////////////////////////////////////////////////////
    controller = new function() 
	{
		this.azimuth_electron = azimuth_electron / DEGREE;
		this.polar_electron = polar_electron / DEGREE;
		
		this.azimuth = azimuth / DEGREE;
		this.polar = polar / DEGREE;
    }();	
	
	// Создаем новый объект dat.GUI.
	gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'gui';
	gui_container.appendChild(gui.domElement);  // id = "gui_container"
	
    var f1 = gui.addFolder('Angles electron (°)');	
	f1.add(controller, 'polar_electron', 0.0, 180.0).onChange( function() 
	{
	   orbitControl.enabled = false;
       polar_electron = (controller.polar_electron)* DEGREE;
	   recalc();
	   gui.updateDisplay();
	   clear_rotation();
		spin_polar_background();
		// spin_az_background();
    });		
    f1.add(controller, 'azimuth_electron', 0.0, 360.0).onChange( function() 
	{
	   orbitControl.enabled = false;
       azimuth_electron = (controller.azimuth_electron) * DEGREE;
	   recalc();
	   gui.updateDisplay();
	   clear_rotation();
		// spin_polar_background();
		spin_az_background();
    });
	f1.open();
	
	f2 = gui.addFolder('Angles S-G device(°) / Angles axis rotation (°)');	
	f2.add(controller, 'polar', 0.0, 180.0).onChange( function() 
	{
		orbitControl.enabled = false;
		polar = (controller.polar)* DEGREE;
		recalc();
		gui.updateDisplay();
		clear_rotation();
		polar_background();
		// az_background();
		axis_rotation();
	});	
	f2.add(controller, 'azimuth', 0.0, 360.0).onChange( function() 
	{
		orbitControl.enabled = false;
		azimuth = (controller.azimuth)* DEGREE;
		recalc();
		gui.updateDisplay();
		clear_rotation();
		// polar_background();
		az_background();
		axis_rotation();
	});
	f2.open();
	
	///////////////////////////////////////////////	
	// Создаем трехмерную сцену, камеру и рендерер
	///////////////////////////////////////////////
	scene = new THREE.Scene();

	var width = canvas.width;
	var height = canvas.height;
	var aspect = width / height;
	
	camera = new THREE.OrthographicCamera( -20, 20, 20/aspect, -20/aspect, 1, 2000 ); 
	
	camera.position.x = 200;
	camera.position.y = 240;
	camera.position.z = 200;
	
	camera.lookAt(new THREE.Vector3(0, 0, 0));	
	scene.add(camera);
	
	// Создаем renderer
	renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true});
	renderer.setSize(canvas.width, canvas.height);

	// Элемент управления дающий возможность осматривать модели со всех сторон.
	orbitControl = new THREE.OrbitControls(camera, canvas);	

/*
	//////// Истинные оси координат /////
	var axes = new THREE.AxesHelper(5);
	axes.position.set(19, 19, -5);
	scene.add(axes);
*/
	create_scene();
	
	// Большая кнопка Measurement
	btn_measurment.disabled = false;
	btn_measurment.addEventListener("click", spin_measurement);
	
	// Кнопка Reset для режима S-G
	btn_reset.disabled = false;
	btn_reset.addEventListener("click", reset_params_SG);
	if (psi == true)
	{
		scene.remove(meshText_D);
	}
	
	// Кнопка Reset 2 для режима сферы Блоха
	btn_reset_2.disabled = false;
	btn_reset_2.addEventListener("click", reset_params_BS);
	if (psi == true)
	{
		scene.remove(meshText_D);
	}	
	
	btn_reset_2.style.display = "none";
	
	AddLabels();
	AddButtons();
	
	btn_rotX_plus.addEventListener("click", X_plus);
	btn_rotX_min.addEventListener("click", X_minus);
	btn_rotY_plus.addEventListener("click", Y_plus);
	btn_rotY_min.addEventListener("click", Y_minus);
	btn_rotZ_plus.addEventListener("click", Z_plus);
	btn_rotZ_min.addEventListener("click", Z_minus);
	
	btn_rotX_plus.disabled = true;
	btn_rotX_min.disabled = true;
	btn_rotY_plus.disabled = true;
	btn_rotY_min.disabled = true;
	btn_rotZ_plus.disabled = true;
	btn_rotZ_min.disabled = true;
	
	btn_rotX_plus.style.display = "none";
	btn_rotX_min.style.display = "none";
	btn_rotY_plus.style.display = "none";
	btn_rotY_min.style.display = "none";
	btn_rotZ_plus.style.display = "none";
	btn_rotZ_min.style.display = "none";
	
	
	btn_rotN_plus.addEventListener("click", N_plus);
	btn_rotN_min.addEventListener("click", N_minus);
	
	btn_rotN_plus.disabled = true;
	btn_rotN_min.disabled = true;		
	btn_rotN_plus.style.display = "none";
	btn_rotN_min.style.display = "none";

	bt = document.getElementById('btn_X');
	bt.style.background='#eeeeee';
	bt = document.getElementById('btn_Y');
	bt.style.background='#eeeeee';
	bt = document.getElementById('btn_Z');
	bt.style.background='#eeeeee';
	bt = document.getElementById('btn_H');
	bt.style.background='#eeeeee';	
	
	btn_X.addEventListener("click", X_Pauli);
	btn_Y.addEventListener("click", Y_Pauli);
	btn_Z.addEventListener("click", Z_Pauli);
	btn_H.addEventListener("click", Hadamard);
	
	btn_X.disabled = true;
	btn_Y.disabled = true;
	btn_Z.disabled = true;
	btn_H.disabled = true;
	
	btn_X.style.display="none";
	btn_Y.style.display="none";
	btn_Z.style.display="none";
	btn_H.style.display="none";

	btn_Deg10.style.display="none";
	btn_Deg5.style.display="none";
	btn_Deg2.style.display="none";
	btn_Deg10.style.display="none";
	btn_clear_rotation.style.display="none";
	
	btn_Deg2.addEventListener("click", Deg2);
	btn_Deg5.addEventListener("click", Deg5);
	btn_Deg10.addEventListener("click", Deg10);
	
	btn_clear_rotation.addEventListener("click", clear_rotation);
	
	// текст "Stern–Gerlach experiment"
	text_sg.style.color = "#0000ff";
	text_sg.style.background='#eeffee'; 
	text_sg.style.font = '30px "Arial"';
	text_sg.style.display = "block";
	
	// initiate(); // загрузка png-файлов
	
	// Отображение на экран.
	render();
}	

function create_scene()
{	
	// Sphere Stern-Gerlach Experiment
	var rs = 12; // Sphere radius
	var sphereGeometry = new THREE.SphereGeometry(rs, 36, 18);
	var sphereMaterial = new THREE.MeshPhongMaterial({color: 0xaabbff, opacity: 0.75, transparent: true });
	sphereMaterial.side = THREE.FrontSide;
	sphereMaterial.shading = THREE.FlatShading;
	sphere = new THREE.Mesh(sphereGeometry, sphereMaterial); // главная сфера программы

	// position the sphere S-G
	sphere.position.x = 0;
	sphere.position.y = 0;
	sphere.position.z = 0;
	
	scene.add(sphere);
	
	// Electron
	var re = 1;		// радиус электрона
	var electronGeometry = new THREE.SphereGeometry(re, 32, 12);
	var electronMaterial = new THREE.MeshPhongMaterial({color: 0x22ff22, opacity: 0.7, transparent: false });
	electronMaterial.side = THREE.FrontSide;
	electronMaterial.shading = THREE.FlatShading;
	electron = new THREE.Mesh(electronGeometry, electronMaterial);

	// position the sphere
	electron.position.x = 0;
	electron.position.y = 0;
	electron.position.z = 0;

	scene.add(electron);
	
	// Три окружности на сфере (sphere)
	const curve = new THREE.EllipseCurve(
		0,  0,            // ax, aY
		rs, rs,           // xRadius, yRadius
		0,  2 * Math.PI,  // aStartAngle, aEndAngle
		false,            // aClockwise
		0                 // aRotation
	);

	const points_ellipse = curve.getPoints( 50 );
	const geometry_ellipse = new THREE.BufferGeometry().setFromPoints( points_ellipse );
	const material_ellipse = new THREE.LineBasicMaterial( { color : 0x0000ff } );
	
	const ellipse_1 = new THREE.Line( geometry_ellipse, material_ellipse );
	const ellipse_2 = new THREE.Line( geometry_ellipse, material_ellipse );
	const ellipse_3 = new THREE.Line( geometry_ellipse, material_ellipse );
	
	ellipse_1.position.x = 0;
	ellipse_1.position.y = 0;
	ellipse_1.position.z = 0;
	ellipse_1.rotation.x = Math.PI/2;
	
	ellipse_2.position.x = 0;
	ellipse_2.position.y = 0;
	ellipse_2.position.z = 0;
	ellipse_2.rotation.y = Math.PI/2;
	
	ellipse_3.position.x = 0;
	ellipse_3.position.y = 0;
	ellipse_3.position.z = 0;
	ellipse_3.rotation.z = Math.PI/2;
	
	scene.add(ellipse_1);
	scene.add(ellipse_2);
	scene.add(ellipse_3);
	
	//////////////////////////////////////////////////////////////////////////////
	// Complex plane
	complexText = new THREE.Object3D();
	complexText.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0xaaffaa, // 0x44bb44
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	complexText.children[0].visible = true; // делаем видимой
	
	generateGeometry( complexText, "Complex Plane" );
	complexText.scale.set(0.9, 0.3, 0.1);	
	/*
	var x =  -0.8 * rs;
	var y = 0; 
	var z = 1.1 * rs;
	*/
	var x = -1.2 * rs;
	var y = 0; 
	var z = -1.2 * rs;
	complexText.position.set(x, y, z);	
	complexText.rotation.x = -Math.PI / 2;
	complexText.rotation.z = Math.PI / 4;
	
	////////////////////////////////////////////////////////////////////////////////
	
	// Axes X, Y, Z, X_BS, Y_BS
	const axis_length = 15;
	var points = [];
	
	const material_axis_X = new THREE.LineBasicMaterial( { color: 0x000000 } );
	const material_axis_Y_BS = new THREE.LineBasicMaterial( { color: 0x000000 } );
	const material_axis_Z = new THREE.LineBasicMaterial( { color: 0x000000 } );
	
	// Axis X
	points = [];
	points.push( new THREE.Vector3(0, 0,  axis_length ) );
	points.push( new THREE.Vector3(0, 0, - rs - 0.8 ) );
	const geometry_axis_X = new THREE.BufferGeometry().setFromPoints( points );
	axis_X = new THREE.Line( geometry_axis_X, material_axis_X  );
	scene.add(axis_X);
	
	// Axis X BS
	points = [];
	points.push( new THREE.Vector3(0, 0,  5*axis_length ) );
	points.push( new THREE.Vector3(0, 0, - 5*axis_length) );
	const geometry_axis_X_BS = new THREE.BufferGeometry().setFromPoints( points );
	axis_X_BS = new THREE.Line( geometry_axis_X_BS, material_axis_X  );
	//scene.add(axis_X_BS);
	
	// Axis Y
	points = [];
	points.push( new THREE.Vector3( axis_length, 0, 0 ) );
	points.push( new THREE.Vector3(- rs - 0.8, 0, 0 ) );
	const geometry_axis_Y_BS = new THREE.BufferGeometry().setFromPoints( points );
	axis_Y_BS = new THREE.Line( geometry_axis_Y_BS, material_axis_Y_BS  );
	scene.add(axis_Y_BS);
	
	// Axis Y BS
	points = [];
	points.push( new THREE.Vector3( 5 * axis_length, 0, 0 ) );
	points.push( new THREE.Vector3(- 5 * axis_length, 0, 0 ) );
	const geometry_axis_Y_BS1 = new THREE.BufferGeometry().setFromPoints( points );
	axis_Y_BS1 = new THREE.Line( geometry_axis_Y_BS1, material_axis_Y_BS  );
	//scene.add(axis_Y_BS1);
	
	// Axis Z
	points = [];
	points.push( new THREE.Vector3(0,  axis_length, 0 ) );
	points.push( new THREE.Vector3(0, - rs - 0.8, 0 ) );
	const geometry_axis_Z = new THREE.BufferGeometry().setFromPoints( points );
	const axis_Z = new THREE.Line( geometry_axis_Z, material_axis_Z  );
	scene.add(axis_Z);
	
	// Axis N
	const material_axis_N = new THREE.LineBasicMaterial( { color: 0x770077 } );
	points = [];
	var gamma = 45*DEGREE;
	var omega = 20*DEGREE;

	var nx = Math.sin(gamma) * Math.cos(omega);
	var ny = Math.sin(gamma) * Math.sin(omega);
	var nz = Math.cos(gamma);

	points.push( new THREE.Vector3( -1.5*rs*ny, -1.5*rs*nz, -1.5*rs*nx ) );
	points.push( new THREE.Vector3(1.5*rs*ny, 1.5*rs*nz, 1.5*rs*nx ) );
	const geometry_axis_N = new THREE.BufferGeometry().setFromPoints( points );
	axis_N = new THREE.Line( geometry_axis_N, material_axis_N  );
	//scene.add(axis_N);
	
	// Cones - стрелки на осях X, Y, Z
	const geometry_cone = new THREE.ConeGeometry( 0.2, 1, 8 );
	const material_cone = new THREE.MeshBasicMaterial( {color: 0x000000} );
	const cone_X = new THREE.Mesh( geometry_cone, material_cone );
	const cone_Y = new THREE.Mesh( geometry_cone, material_cone );
	const cone_Z = new THREE.Mesh( geometry_cone, material_cone );
	
	cone_X.position.set(0, 0, axis_length);
	cone_X.rotation.x = Math.PI / 2;	
	scene.add(cone_X);
	
	cone_Y.position.set(axis_length, 0, 0);
	cone_Y.rotation.x = Math.PI / 2;
	cone_Y.rotation.z = Math.PI * 3 / 2;
	scene.add(cone_Y );
	
	cone_Z.position.set(0, axis_length, 0);
	scene.add(cone_Z);
	
	// Наименование осей координат
	// X
	const meshText_X = new THREE.Object3D();
	meshText_X.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_X.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_X, "X" );
	meshText_X.scale.set(0.12, 0.12, 0.12);	
	var x = 0;
	var y = 0; 
	var z = axis_length + 1.2;
	meshText_X.position.set(x, y, z);
	
	// Y
	const meshText_Y = new THREE.Object3D();
	meshText_Y.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_Y.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_Y, "Y" );
	meshText_Y.scale.set(0.12, 0.12, 0.12);	
	var x = axis_length + 1.2;
	var y = 0; 
	var z = 0;
	meshText_Y.position.set(x, y, z);
	
	// Z
	const meshText_Z = new THREE.Object3D();
	meshText_Z.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_Z.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_Z, "Z" );
	meshText_Z.scale.set(0.12, 0.12, 0.12);	
	var x = 0;
	var y = axis_length + 1.2;
	var z = 0;
	meshText_Z.position.set(x, y, z);
	
	scene.add(meshText_X); 
	scene.add(meshText_Y); 
	scene.add(meshText_Z);
	
	// +X
	meshText_X_plus = new THREE.Object3D();
	meshText_X_plus.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_X_plus.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_X_plus, "+X" );
	meshText_X_plus.scale.set(0.2, 0.2, 0.1);	
	var x = 0;
	var y = 0; 
	var z = 80; //2*axis_length + 1.2;
	meshText_X_plus.position.set(x, y, z);
	// scene.add(meshText_X_plus); 
	
	// +Y
	meshText_Y_plus = new THREE.Object3D();
	meshText_Y_plus.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_Y_plus.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_Y_plus, "+Y" );
	meshText_Y_plus.scale.set(0.2, 0.2, 0.1);	
	var x = 80; //2*axis_length + 1.2;
	var y = 0; 
	var z = 0;
	meshText_Y_plus.position.set(x, y, z);
	// scene.add(meshText_Y_plus); 
	
	///////////////////////////////////////////////////////////////////////////////
	
	// -X
	meshText_X_minus = new THREE.Object3D();
	meshText_X_minus.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_X_minus.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_X_minus, "-X" );
	meshText_X_minus.scale.set(0.2, 0.2, 0.1);	
	var x = 0;
	var y = 0; 
	var z = - 80; //2*axis_length + 1.2;
	meshText_X_minus.position.set(x, y, z);
	// scene.add(meshText_X_minus); 
	
	// -Y
	meshText_Y_minus = new THREE.Object3D();
	meshText_Y_minus.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_Y_minus.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_Y_minus, "-Y" );
	meshText_Y_minus.scale.set(0.2, 0.2, 0.1);	
	var x = - 80; //2*axis_length + 1.2;
	var y = 0; 
	var z = 0;
	meshText_Y_minus.position.set(x, y, z);
	// scene.add(meshText_Y_minus); 
	
	// Обозначения точек пересечения осей координат с главной сферой
	
	//        !!! Для сферы Блоха
	// "|0>"
	meshText_0 = new THREE.Object3D();
	meshText_0.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: color_psi, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_0.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_0, "|0>" );
	meshText_0.scale.set(0.25, 0.25, 0.05);	
	var x = 0.2;
	var y = rs + 0.9;
	var z = -0.5;
	meshText_0.position.set(x, y, z);
	//scene.add(meshText_0);
	
	// "|1>"
	meshText_1 = new THREE.Object3D();
	meshText_1.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: color_psi, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_1.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_1, "|1>" );
	meshText_1.scale.set(0.25, 0.25, 0.05);	
	var x = 0;
	var y = - rs - 1.2;
	var z = 0;
	meshText_1.position.set(x, y, z);
	
	// "+i"
	meshText_plus_i = new THREE.Object3D();
	meshText_plus_i.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: color_psi, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_plus_i.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_plus_i, "+i" );
	meshText_plus_i.scale.set(0.15, 0.15, 0.05);	
	var x = rs + 1.0;
	var y = 0.70;
	var z = 0;
	meshText_plus_i.position.set(x, y, z);
	
	// "-i"
	meshText_minus_i = new THREE.Object3D();
	meshText_minus_i.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: color_psi, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_minus_i.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_minus_i, "-i" );
	meshText_minus_i.scale.set(0.15, 0.15, 0.05);	
	var x = - rs - 1.0;
	var y = 0.70;
	var z = 0;
	meshText_minus_i.position.set(x, y, z);
	
	// "+1"
	meshText_plus_1y = new THREE.Object3D();
	meshText_plus_1y.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: color_psi, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_plus_1y.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_plus_1y, "+1" );
	meshText_plus_1y.scale.set(0.15, 0.15, 0.05);	
	var x = rs + 1.0;
	var y = 0.70;
	var z = 0;
	meshText_plus_1y.position.set(x, y, z);
	
	// "-1"
	meshText_minus_1y = new THREE.Object3D();
	meshText_minus_1y.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: color_psi, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_minus_1y.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_minus_1y, "-1" );
	meshText_minus_1y.scale.set(0.15, 0.15, 0.05);	
	var x = - rs - 1.0;
	var y = 0.70;
	var z = 0;
	meshText_minus_1y.position.set(x, y, z);
	
	///////////////////////////////////////////////
	
	//     !!! Для S-G
	// "+1" по оси X
	meshText_plus_1x = new THREE.Object3D();
	meshText_plus_1x.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: color_psi, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_plus_1x.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_plus_1x, "+1" );
	meshText_plus_1x.scale.set(0.15, 0.15, 0.05);	
	var x = -0.7;
	var y = 0.70
	var z = rs + 1.0
	meshText_plus_1x.position.set(x, y, z);
	
	// "-1" по оси X
	meshText_minus_1x = new THREE.Object3D();
	meshText_minus_1x.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: color_psi, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_minus_1x.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_minus_1x, "-1" );
	meshText_minus_1x.scale.set(0.15, 0.15, 0.05);	
	var x = 0;
	var y = 0.70
	var z = - rs - 1.0;
	meshText_minus_1x.position.set(x, y, z);

	// "-1" по оси Z
	meshText_minus_1z = new THREE.Object3D();
	meshText_minus_1z.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: color_psi, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_minus_1z.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_minus_1z, "-1" );
	meshText_minus_1z.scale.set(0.15, 0.15, 0.05);	
	var x = 0;
	var y = - rs - 1.2;
	var z = 0;
	meshText_minus_1z.position.set(x, y, z);
	
	scene.add(meshText_plus_1x);
	scene.add(meshText_minus_1x);
	scene.add(meshText_minus_1y);
	scene.add(meshText_plus_1y);
	scene.add(meshText_minus_1z);
	
	//  Стрелка задающее направление прибора S-G (device_arrow)
	const device_arrow = new THREE.Shape();
	
	var diam1 = 0.15;
	var diam2 = 0.7;
	var length_2 = rs;
	var length_1 = rs - 2;

	device_arrow.moveTo( 0, diam1 );
	device_arrow.lineTo( length_1, diam1 );
	device_arrow.lineTo( length_1, diam2 );
	device_arrow.lineTo( length_2, 0 );
	device_arrow.lineTo( length_1, -diam2 );
	device_arrow.lineTo( length_1, -diam1 );
	device_arrow.lineTo( 0, -diam1 );
	device_arrow.lineTo( 0, diam1 );

	var extrudeSettings = {
	  depth: 0.2,
	  bevelEnabled: false
	};	
	
	const geometry_device_arrow = new THREE.ExtrudeGeometry( device_arrow, extrudeSettings );
	const material_device_arrow = new THREE.MeshBasicMaterial( { color: 0xaa00aa } );
	mesh_device_arrow = new THREE.Mesh( geometry_device_arrow, material_device_arrow ) ;
	mesh_device_arrow.position.set(0, 0, 0);	
	mesh_device_arrow.rotation.y = azimuth + Math.PI/2;
	mesh_device_arrow.rotation.z = polar + Math.PI/2;	
	scene.add( mesh_device_arrow );
	
	///////////////////////////////////////////////////////////////////////
	// Отображаем символ device "D" на 3D-холсте
	///////////////////////////////////////////////////////////////////////
	meshText_D = new THREE.Object3D();
	meshText_D.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0xaa00aa, 
										 sside: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_D.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_D, "D" );
	meshText_D.scale.set(0.2, 0.2, 0.2);	
	var r2 = 13.0;
	var x = r2 * Math.sin(polar) * Math.sin(azimuth) - 0.5;
	var y = r2 * Math.cos(polar);
	var z = r2 * Math.sin(polar) * Math.cos(azimuth); 
	//meshText_D.rotation.z = -Math.PI/2;
	meshText_D.position.set(x, y, z);	
	if (psi == false)
	{
		scene.add(meshText_D);
	}
	
	// Стрелка задающее направление вектора Блоха (spin_arrow)
	const spin_arrow = new THREE.Shape();

	diam1 = 0.05;
	diam2 = 0.3;
	length_1 = rs - 1;
	length_2 = rs;
	length_3 = rs - 3;

	spin_arrow.moveTo( 0, diam1 );
	spin_arrow.lineTo( length_3, diam1 );
	spin_arrow.lineTo( length_3, diam2 );
	spin_arrow.lineTo( length_2, 0 );
	spin_arrow.lineTo( length_3, -diam2 );
	spin_arrow.lineTo( length_3, -diam1 );
	spin_arrow.lineTo( 0, -diam1 );
	spin_arrow.lineTo( 0, diam1 );	

	const geometry_spin_arrow = new THREE.ExtrudeGeometry( spin_arrow, extrudeSettings );
	const material_spin_arrow = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
	mesh_spin_arrow = new THREE.Mesh( geometry_spin_arrow, material_spin_arrow ) ;
	mesh_spin_arrow.position.set(0, 0, 0);
	
	mesh_spin_arrow.rotation.y = azimuth_electron + Math.PI/2;
	mesh_spin_arrow.rotation.z = polar_electron + Math.PI/2;	
	
	scene.add( mesh_spin_arrow );
	
	//******************************************************************************************
	
	// Отображаем символ spin "A" на 3D-холсте
	meshText_A = new THREE.Object3D();
	meshText_A.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0xff0000, 
										 sside: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_A.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_A, "A" );
	meshText_A.scale.set(0.2, 0.2, 0.2);	
	var r1 = 13.0;
	var x = r1 * Math.sin(polar_electron) * Math.sin(azimuth_electron) + 0.5;
	var y = r1 * Math.cos(polar_electron);
	var z = r1 * Math.sin(polar_electron) * Math.cos(azimuth_electron); 
	//meshText_A.rotation.z = -Math.PI/2;
	meshText_A.position.set(x, y, z);	
	scene.add(meshText_A);
	
	//******************************************************************************************
	
	// Отображаем символ spin "B" на 3D-холсте
	meshText_B = new THREE.Object3D();
	meshText_B.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0xff0000, 
										 sside: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_B.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_B, "B" );
	meshText_B.scale.set(0.2, 0.2, 0.2);	
	var r1 = 13.0;
	var x = r1 * Math.sin(polar_electron) * Math.sin(azimuth_electron) + 0.5;
	var y = r1 * Math.cos(polar_electron);
	var z = r1 * Math.sin(polar_electron) * Math.cos(azimuth_electron); 
	//meshText_B.rotation.z = -Math.PI/2;
	meshText_B.position.set(x, y, z);	
	//scene.add(meshText_B);
	
	//******************************************************************************************
	
	// Куб используемый для отображения процесса измерения
	const geometry_cube_measurement = new THREE.BoxGeometry( 25.5, 3, 3 );
	const material_cube_measurement = new THREE.MeshPhongMaterial( {color: 0xffff00, opacity: 0.6, transparent: false} );	
	cube_measurement = new THREE.Mesh( geometry_cube_measurement, material_cube_measurement );
	cube_measurement.position.set( 0, 0, 0);
	
	cube_measurement.rotation.y = azimuth + Math.PI/2;
	cube_measurement.rotation.z = polar + Math.PI/2;
	
	// Сферы - маленькие точки пересечения осей со сферой S-G 
	var spGeometry = new THREE.SphereGeometry(0.2, 6, 6);
	var spGeometry_BS = new THREE.SphereGeometry(0.4, 6, 6);
	var spMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
	var spMaterial_BS = new THREE.MeshBasicMaterial({color: 0xff0000});
	
	var up = new THREE.Mesh(spGeometry, spMaterial);
	down_SG = new THREE.Mesh(spGeometry, spMaterial);
	down_BS = new THREE.Mesh(spGeometry_BS, spMaterial_BS);
	var left = new THREE.Mesh(spGeometry, spMaterial);
	var right = new THREE.Mesh(spGeometry, spMaterial);
	var back = new THREE.Mesh(spGeometry, spMaterial);
	var forward = new THREE.Mesh(spGeometry, spMaterial);	
	
	up.position.set(    0,   rs,  0);
	down_SG.position.set(  0,   -rs, 0);
	down_BS.position.set(  0,   -rs, 0);
	left.position.set(  -rs, 0,   0);	
	right.position.set( rs,  0,   0);
	back.position.set(  0,   0,   -rs); 
	forward.position.set(0,  0,   rs);
	
	scene.add(up);
	scene.add(down_SG);
	scene.add(left);
	scene.add(right);
	scene.add(back);
	scene.add(forward);
	
	// plane_OXY
	const geometry_plane = new THREE.PlaneGeometry( 150, 150 );
	// const material_plane = new THREE.MeshPhongMaterial( {color: 0x44bb44, side: THREE.DoubleSide, opacity: 0.2, transparent: true } );
	const material_plane = new THREE.MeshPhongMaterial( {color: 0xfefffe, side: THREE.DoubleSide, opacity: 0.2, transparent: true } );
	plane_OXY = new THREE.Mesh( geometry_plane, material_plane );
	
	plane_OXY.position.x = 0;
	plane_OXY.position.y = 0;
	plane_OXY.position.z = 0;
	
	plane_OXY.rotation.x = Math.PI/2;
	
	// свет
	
/*
//	const light_1 = new THREE.AmbientLight( 0x707070 ); // soft white light (мягкий белый свет)

	const light_1 = new THREE.DirectionalLight( 0xffffff, 0.8, 1000 );
	light_1.position.set( 0, 1, 1 ); // default; light shining from top
								   // (по умолчанию; свет светит сверху)
	scene.add( light_1 );
								   

	const light_2 = new THREE.DirectionalLight( 0xffffff, 0.8, 1000 );
	light_2.position.set( 1, 0, 0 ); // default; light shining from top
								   // (по умолчанию; свет светит сверху)								   
	scene.add( light_2 );
*/	
	const light_1 = new THREE.PointLight( 0xffffff, 0.8, 0 );
	light_1.position.set( 100, 200, 100 );
	scene.add( light_1 );

	const light_2 = new THREE.PointLight( 0xffffff, 0.8, 0 );
	light_2.position.set( - 100, - 200, - 100 );
	scene.add( light_2 );
	
	/////////////////////////////////////////////////////////////////////
	draw_angles();
	if (psi == false)
	{
		print_spin_1(); // отображаем значение спина в области 3D-прибора Ш-Г
	}
	
	if (psi == true)
	{
		print_spin_2(); // отображаем значение спина в правой нижней области
	}
}

function reset_params_SG() 
{
	polar_electron = 0;
	azimuth_electron = 0;
	polar = 0;
	azimuth = 0;

	mesh_spin_arrow.rotation.z = polar_electron + Math.PI/2;
	mesh_spin_arrow.rotation.y = azimuth_electron + Math.PI/2;

	mesh_device_arrow.rotation.z = polar + Math.PI/2;
	mesh_device_arrow.rotation.y = azimuth + Math.PI/2;

	cube_measurement.rotation.y = azimuth + Math.PI/2;
	cube_measurement.rotation.z = polar + Math.PI/2;

	var elem = document.getElementById('hud_2');
	ctx_hud_2.clearRect(0, 0, elem.width, elem.height);
	draw_angles();
	
	controller.azimuth_electron = azimuth_electron;
	controller.polar_electron = polar_electron;

	controller.azimuth = azimuth;
	controller.polar = polar;
	gui.updateDisplay();

	recalc();
/*	
	scene.remove(meshText_B);
	var r1 = 13.0;
	var x = r1 * Math.sin(polar_electron) * Math.sin(azimuth_electron) + 0.5;
	var y = r1 * Math.cos(polar_electron);
	var z = r1 * Math.sin(polar_electron) * Math.cos(azimuth_electron); 
	//meshText_B.rotation.z = -Math.PI/2;
	meshText_B.position.set(x, y, z);	
	scene.add(meshText_B);
*/

	scene.remove(meshText_A);
	var r1 = 13.0;
	var x = r1 * Math.sin(polar_electron) * Math.sin(azimuth_electron) + 0.5;
	var y = r1 * Math.cos(polar_electron);
	var z = r1 * Math.sin(polar_electron) * Math.cos(azimuth_electron); 
	//meshText_A.rotation.z = -Math.PI/2;
	meshText_A.position.set(x, y, z);	
	scene.add(meshText_A);

	scene.remove(meshText_D);
	var r1 = 13.0;
	var x = r1 * Math.sin(polar) * Math.sin(azimuth) - 0.5;
	var y = r1 * Math.cos(polar);
	var z = r1 * Math.sin(polar) * Math.cos(azimuth); 
	//meshText_D.rotation.z = -Math.PI/2;
	meshText_D.position.set(x, y, z);
	scene.add(meshText_D);

	clear_rotation();
	
	polar_background();
	az_background();
	
	spin_polar_background();
	spin_az_background();
}

function reset_params_BS() 
{
	polar_electron = 0;
	azimuth_electron = 0;
	polar = 0;
	azimuth = 0;

	mesh_spin_arrow.rotation.z = polar_electron + Math.PI/2;
	mesh_spin_arrow.rotation.y = azimuth_electron + Math.PI/2;

	mesh_device_arrow.rotation.z = polar + Math.PI/2;
	mesh_device_arrow.rotation.y = azimuth + Math.PI/2;

	cube_measurement.rotation.y = azimuth + Math.PI/2;
	cube_measurement.rotation.z = polar + Math.PI/2;

	var elem = document.getElementById('hud_2');
	ctx_hud_2.clearRect(0, 0, elem.width, elem.height);
	draw_angles();

	controller.azimuth_electron = azimuth_electron;
	controller.polar_electron = polar_electron;

	controller.azimuth = azimuth;
	controller.polar = polar;
	gui.updateDisplay();

	recalc();

	scene.remove(meshText_B);
	var r1 = 13.0;
	var x = r1 * Math.sin(polar_electron) * Math.sin(azimuth_electron) + 0.5;
	var y = r1 * Math.cos(polar_electron);
	var z = r1 * Math.sin(polar_electron) * Math.cos(azimuth_electron); 
	//meshText_B.rotation.z = -Math.PI/2;
	meshText_B.position.set(x, y, z);	
	scene.add(meshText_B);

	scene.remove(meshText_D);
	var r1 = 13.0;
	var x = r1 * Math.sin(polar) * Math.sin(azimuth) - 0.5;
	var y = r1 * Math.cos(polar);
	var z = r1 * Math.sin(polar) * Math.cos(azimuth); 
	//meshText_D.rotation.z = -Math.PI/2;
	meshText_D.position.set(x, y, z);	

	clear_rotation();
	
	polar_background();
	az_background();
	
	spin_polar_background();
	spin_az_background();
}

function recalc()
{
	mesh_spin_arrow.rotation.z = polar_electron + Math.PI/2;
	mesh_spin_arrow.rotation.y = azimuth_electron + Math.PI/2;
	
	mesh_device_arrow.rotation.z = polar + Math.PI/2;
	mesh_device_arrow.rotation.y = azimuth + Math.PI/2;
	
	cube_measurement.rotation.y = azimuth + Math.PI/2;
	cube_measurement.rotation.z = polar + Math.PI/2;

	var elem = document.getElementById('hud_2');
	ctx_hud_2.clearRect(0, 0, elem.width, elem.height);
	draw_angles();
	
	scene.remove(meshText_B);
	var r1 = 13.0;
	var x = r1 * Math.sin(polar_electron) * Math.sin(azimuth_electron) + 0.5;
	var y = r1 * Math.cos(polar_electron);
	var z = r1 * Math.sin(polar_electron) * Math.cos(azimuth_electron); 
	//meshText_B.rotation.z = -Math.PI/2;
	meshText_B.position.set(x, y, z);
	meshText_A.position.set(x, y, z);
	if (psi == false)
	{
		scene.add(meshText_A);
	}
	else
	{
		scene.add(meshText_B);
	}
	
	scene.remove(meshText_D);
	var r1 = 13.0;
	var x = r1 * Math.sin(polar) * Math.sin(azimuth) - 0.5;
	var y = r1 * Math.cos(polar);
	var z = r1 * Math.sin(polar) * Math.cos(azimuth); 
	//meshText_D.rotation.z = -Math.PI/2;
	meshText_D.position.set(x, y, z);
	if (psi == false)
	{
		scene.add(meshText_D);
	}

	if (psi == false)
	{
		print_spin_1(); // отображаем значение спина в области 3D-прибора Ш-Г
	}
	
	if (psi == true)
	{
		print_spin_2(); // отображаем значение спина в правой нижней области
	}

	if (psi == true)
	{
		// квантовые вращения на сфере Блоха
		rotation_all_points();
	}
}

//////////////////////////////////////////////////////////////
// 3D-Text
//////////////////////////////////////////////////////////////
var loaderText = new THREE.FontLoader(); // загрузчик шрифтов

// характеристики создаваемого 3D текста
function create_text(txt)
{
	var t =
	{
		text : txt,          // текст номера, который небходимо отобразить
		size : 6,            // размер текста (высота символа)
		height : 1,          // толщина текста
		curveSegments : 12,  // количество точек (сегментов) 
              // кривой при рисовании буквы, отвечающие за качество изображения
		//     font : "gentilis",   // название шрифта
		bevelEnabled : false // включение фаски (при true)
	};	
	return t;
}
	
// Создание текста для оцифровки вершин огранки.			
function generateGeometry(meshText, text)
{
	var data = create_text(text);
	loaderText.load
	( 
		//'../libs/helvetiker_regular.typeface.js', // шрифт
		//'../libs/optimer_regular.typeface.js',
		//'../libs/bitstream_vera_sans_mono_roman.typeface.js',
		'../libs/gentilis_regular.typeface.js',
		function ( font ) 
		{
			var geometryText = new THREE.TextGeometry
			( 
				data.text, 
				{
					font: font,
					size: data.size,
					height: data.height,
					curveSegments: data.curveSegments,
					bevelEnabled: data.bevelEnabled
				} 
			);
			geometryText.center();
			meshText.children[ 0 ].geometry.dispose(); 
			meshText.children[ 0 ].geometry = geometryText;			
		}
	);
}

//////////////////////////////////////////
// 2D-Text
//////////////////////////////////////////
function print_spin_measurment()
{	
	// Отображение "Spin measurement" во время измерения
	ctx_hud_1.font = 'italic bold 20px Georgia,serif';
	ctx_hud_1.fillStyle = 'rgba(50, 22, 0, 1)';
	ctx_hud_1.fillText("Spin measurement", 5, 22);
}

// Диаграмма
function add_chart(num, h) 
{
	var elem = document.getElementById('hud_2');
	var w = elem.width/2;
	//var h = 336;

	// рисуем окружность
	ctx_hud_2.fillStyle = "#00ff00";//"#ddd";
	ctx_hud_2.strokeStyle = "#ddd";
	ctx_hud_2.beginPath();
	ctx_hud_2.arc(w, h, 60, 0,Math.PI*2,true);
	ctx_hud_2.closePath();
	ctx_hud_2.fill();

	// рисуем сектор окружности num%
	ctx_hud_2.fillStyle = "#5555ff";//"#ffb549";
	ctx_hud_2.beginPath();
	ctx_hud_2.moveTo(w, h);

	//координаты старта определяем так чтоб закрашенная область всегда была снизу
	var start = (Math.PI/180)*90 - ((Math.PI/180) * (100 - num) * 360/100)/2; 
	ctx_hud_2.arc(w, h, 60, start, start + (Math.PI/180)*(100 - num)*360/100, false);
	ctx_hud_2.closePath();
	ctx_hud_2.fill();

	// закрашиваем внутреннюю окружность меньшего радиуса
	ctx_hud_2.fillStyle = "#F8F8F8";
	ctx_hud_2.beginPath();
	ctx_hud_2.arc(w, h, 50, 0, Math.PI*2, true);
	ctx_hud_2.closePath();
	ctx_hud_2.fill();

	// пишем текст
	ctx_hud_2.fillStyle = "#00aa00";
	ctx_hud_2.font = '18px "Times New Roman"';
	var x = w - 40;
	var y = h - 15;
	var num1 = roundNumber(num, 1);
	var num2 = roundNumber(100 - num, 1);
	
	var s1 = "(+1)  " + num1;
	ctx_hud_2.fillText(s1 + "%", x, y);
	
	y = y + 30;
	ctx_hud_2.fillStyle = "#0000ff";
	
	var s2 = "(-1)  " + num2;
	ctx_hud_2.fillText(s2 + "%", x, y);
}
	
function roundNumber(num, places) 
{
	return ( Math.round(num * Math.pow(10, places)) / Math.pow(10, places) );
}	
	
function getRandomInt(max) 
{
  return Math.floor(Math.random() * max);
}

function render() 
{
	orbitControl.enabled = true;
	renderer.render(scene, camera);		
	requestAnimationFrame(render);
}

function spin_measurement() 
{ 
	// рисуем куб измерений
	var probab = "〈σ〉 = ";   // |di〉 =       |u〉 =      |d〉 =

	btn_measurment.disabled = true;
	scene.add(cube_measurement); // рисуем куб измерений
	print_spin_measurment();	

	setTimeout(mesurement, 600);
}	

function mesurement() 
{
	var elem = document.getElementById('canvas_draw');
	ctx_hud_1.clearRect(0, 0, elem.width, elem.height);
	
	if (psi == false)
	{
		print_spin_1(); // отображаем значение спина в области 3D-прибора Ш-Г
	}
	
	if (psi == true)
	{
		print_spin_2(); // отображаем значение спина в правой нижней области
	}
	
	elem = document.getElementById('canvas_draw');
	ctx_hud_2.clearRect(0, 0, elem.width, elem.height);
	
	var spin_teta = polar_electron;
	var spin_fi = azimuth_electron;
	var spin_x = Math.sin(spin_teta) * Math.cos(spin_fi);
	var spin_y = Math.sin(spin_teta) * Math.sin(spin_fi);
	var spin_z = Math.cos(spin_teta);	
	var spin_r = Math.sqrt(Math.pow(spin_x, 2) + Math.pow(spin_y, 2) + Math.pow(spin_z, 2));
	console.log("spin r = ", spin_r);
	
	var device_teta = polar;
	var device_fi = azimuth;
	var device_x = Math.sin(device_teta) * Math.cos(device_fi);
	var device_y = Math.sin(device_teta) * Math.sin(device_fi);
	var device_z = Math.cos(device_teta);
	var device_r = Math.sqrt(Math.pow(device_x, 2) + Math.pow(device_y, 2) + Math.pow(device_z, 2));
	console.log("device r = ", device_r);
	
	// Cosinus угла между осью прибора и направлением спина 
	var cos_alpha = spin_x * device_x + spin_y * device_y + spin_z * device_z;
	// Угол между осью прибора и направлением спина 
	var alpha = Math.acos(cos_alpha);
	console.log("alpha = ", alpha);

//	var text3 = "cos(α/2)" + "²)";
//	var text3 = "cos²(α/2) + sin²(½α) = 1";
	
	prb = 0;
	prb = (Math.cos(alpha/2) * Math.cos(alpha/2)) * 100;
	prb1 = (Math.cos(alpha/2) * Math.cos(alpha/2));
	

	ctx_hud_2.fillStyle = "#eeeeee";    // color of fill
	ctx_hud_2.fillRect(20, 232, 250, 167); // create rectangle 
	
	var num1 = roundNumber(prb1, 4);
	var num2 = roundNumber(1 - prb1, 4);
	
	var text3 = "P(1) =  cos²(α/2) = " + num1;
	var text4 = "P(-1) = sin²(α/2) = " + num2;
	
	ctx_hud_2.font = '14px "Times New Roman"';
	
	ctx_hud_2.fillStyle = "#008800";
	ctx_hud_2.fillText(text3, 90, 247);	
	
	ctx_hud_2.fillStyle = "#0000ff";
	ctx_hud_2.fillText(text4, 90, 267);	
	
	// Сразу выводим диаграмму
	add_chart(prb, 336);
	
	// Углы, которые мы ЗАДАЛИ, выводим на canvas сразу
	draw_angles();
	
	//////////////////////////////////////////////////////////////////
	scene.remove(cube_measurement);
	btn_measurment.disabled = false;
	
	// Изменяем направление стрелки спина
	controller.azimuth_electron = azimuth / DEGREE;
	controller.polar_electron = polar / DEGREE;
	
	var random_number = getRandomInt(101);
	
	if (random_number < prb)
	{
		polar_electron = polar;
		azimuth_electron = azimuth;
	
		mesh_spin_arrow.rotation.z = polar + Math.PI/2;
		mesh_spin_arrow.rotation.y = azimuth + Math.PI/2;		
	}	
	else
	{
		polar_electron = Math.PI - polar;
		azimuth_electron = azimuth + Math.PI;
		if (azimuth_electron > 2 * Math.PI)
		{
			azimuth_electron = azimuth_electron - 2 * Math.PI;
		}
		
		mesh_spin_arrow.rotation.y = azimuth_electron + Math.PI/2;
		mesh_spin_arrow.rotation.z = polar_electron + Math.PI/2;	
	}	
		
	controller.azimuth_electron = azimuth_electron / DEGREE;
	controller.polar_electron = polar_electron / DEGREE;

	gui.updateDisplay();
	
	scene.remove(meshText_A);
	var r1 = 13.0;
	var x = r1 * Math.sin(polar_electron) * Math.sin(azimuth_electron) + 0.5;
	var y = r1 * Math.cos(polar_electron);
	var z = r1 * Math.sin(polar_electron) * Math.cos(azimuth_electron); 
	//meshText_B.rotation.z = -Math.PI/2;
	meshText_A.position.set(x, y, z);	
	scene.add(meshText_A);

	scene.remove(meshText_D);
	var r1 = 13.0;
	var x = r1 * Math.sin(polar) * Math.sin(azimuth) - 0.5;
	var y = r1 * Math.cos(polar);
	var z = r1 * Math.sin(polar) * Math.cos(azimuth); 
	//meshText_D.rotation.z = -Math.PI/2;
	meshText_D.position.set(x, y, z);	
	scene.add(meshText_D);

	
	if (psi == false)
	{
		print_spin_1(); // отображаем значение спина в области 3D-прибора Ш-Г
	}
	
	if (psi == true)
	{
		print_spin_2(); // отображаем значение спина в правой нижней области
	}
}

function print_spin_1() // отображаем значение спина в области 3D-прибора Ш-Г
{
	// отображаем значение спина в области 3D-прибора Ш-Г
	var elem = document.getElementById('canvas_draw');
	ctx_hud_1.clearRect(0, 0, elem.width, elem.height);
	
	if (psi == false)
	{
		ctx_hud_1.drawImage(img2, 530, 0);
	}
	
	var fi = roundNumber(azimuth_electron/DEGREE, 0) + "°) · |1〉";
	
	var cos_teta = Math.cos(polar_electron/2);
	var sin_teta = Math.sin(polar_electron/2);
	var b = Math.sin(polar_electron/2) * Math.cos(azimuth_electron);
	var c = Math.sin(polar_electron/2) * Math.sin(azimuth_electron);
	
	var text_cos_teta = roundNumber(cos_teta, 3);
	var text_sin_teta = roundNumber(sin_teta, 3);
	text_b = roundNumber(b, 3);
	text_c = roundNumber(c, 3);	
	
	ctx_hud_1.font = '20px "Ariel';
	ctx_hud_1.fillStyle = "#000";
	
	var rez = "|ψ〉  =  " + 
				"(" + text_cos_teta + ") · |0〉 " + " + " +
			" (" + text_sin_teta + ") ";
	var rez = rez + "· exp(i·" + fi;
	
	if (psi == true)
	{
		ctx_hud_1.fillText(rez, 200, 510);
	}
	
	// ctx_hud_1.fillText(rez, 200, 510);
	
	var text_cos = "=  " + roundNumber(cos_alpha, 3);
	ctx_hud_1.font = '15px "Arial"';
	ctx_hud_1.fillStyle = "#000";
	ctx_hud_1.fillText(text_cos, 625, 24);
}

function print_spin_2() // отображаем значение спина в правой нижней области
{ 
/*
	if (psi == false)
	{
		var elem = document.getElementById("quant_params");
		ctx_hud_3.clearRect(0, 0, elem.width, elem.height);
		return;
	}
*/
	//   〈σ〉 
	
	var elem = document.getElementById("quant_params");
	ctx_hud_3.clearRect(0, 45, elem.width, elem.height - 45);
	
	ctx_hud_3.fillStyle = "#000";
	
	var text_fi = roundNumber(azimuth_electron/DEGREE, 0) + "°)";
	
	var cos_teta = Math.cos(polar_electron/2);
	var sin_teta = Math.sin(polar_electron/2);
	
	var text_cos_teta = roundNumber(cos_teta, 3);
	var text_sin_teta = roundNumber(sin_teta, 3);
	
	ctx_hud_3.font = '15px "Arial"';
	//ctx_hud_3.fillStyle = "#000";
	ctx_hud_3.fillStyle = "#000000";
	
	var rez1 = "|ψ〉 = " + "(" + text_cos_teta + ") " + " + " + " (" + text_sin_teta + ") ";
	var rez = rez1 + "·exp(i·" + text_fi;
	
	var rez = "|ψ〉 = " + 
				"(" + text_cos_teta + ")·|0〉 " + " + " +
			" (" + text_sin_teta + ") ";
			
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
	
	fi = roundNumber(azimuth_electron_DEGREE, 0) + "°) · |1〉";	
			
	var rez = rez + "·exp(i·" + fi;
	if (psi == false)
	{
		ctx_hud_3.fillStyle = "#ccbbcc";
	}
	else
	{
		ctx_hud_3.fillStyle = "#000000";
	}
	// ctx_hud_3.fillStyle = "#000000";
	ctx_hud_3.fillText(rez, 40, 59);	
	
	var a = Math.sin(polar_electron/2) * Math.cos(azimuth_electron);
	var b = Math.sin(polar_electron/2) * Math.sin(azimuth_electron);
	text_a = roundNumber(a, 3);
	text_b = roundNumber(b, 3);	
	
	var rez;
	var rez1, rez2;
	
	if ( (cos_teta > -0.0000001) && (cos_teta < 0.0000001) )
	{
		rez1 = "|ψ〉 = " + "(0)·" + "|0〉";
	}
	else 
	{
		rez1 = "|ψ〉 = " + "(" + roundNumber(cos_teta, 3) + ")·" + "|0〉 ";
	}
	
	////////////////////////////////////////////////////////////////////
	
	if ( (Math.abs(a) < 0.00001) && (Math.abs(b) < 0.00001) )
	{
		rez2 = " + (0)·" + "|1〉";
	}
	else if ( (Math.abs(a) < 0.00001) && (Math.abs(b) > 0.00001) )
	{
		rez2 = " + " + "i·(" + roundNumber(b, 3) + ")" + "·" + "|1〉";
	}
	else if ( (Math.abs(a) > 0.00001) && (Math.abs(b) < 0.00001) )
	{
		rez2 = " + " + "(" + roundNumber(a, 3) + ")" + "·" + "|1〉";
	}
	else if ( (Math.abs(a) > 0.00001) && (Math.abs(b) > 0.00001) )
	{
	rez2 = " + [ (" + roundNumber(a, 3) + ") + " + "i·(" + roundNumber(b, 3) + ")]" + "·" + "|1〉";
	}
	
	rez = rez1 + rez2;
	if (psi == false)
	{
		ctx_hud_3.fillStyle = "#ccbbcc";
	}
	else
	{
		ctx_hud_3.fillStyle = "#000000";
	}
	ctx_hud_3.fillText(rez, 40, 89);

	fillStyle = "#000000";
	
	ctx_hud_3.lineWidth = 1;
	ctx_hud_3.strokeStyle = '#777700';
	ctx_hud_3.beginPath();
	ctx_hud_3.rect(35, 3, 320, 35);
	ctx_hud_3.stroke();
	
	initiate(); // загрузка png-файлов
}

function initiate()
{
	// загрузка png-файлов
	img1 = document.createElement('img');
	img1.setAttribute('src', 'psi.png');
	img1.addEventListener("load", function()
	{
		if (psi == true)
		{
			ctx_hud_3.drawImage(img1, 40, 4);
		}
	});

	img2 = document.createElement('img');
	img2.setAttribute('src', 'ds.png');
	img2.addEventListener("load", function()
	{
		if (psi == false)
		{
			ctx_hud_1.drawImage(img2, 530, 0);
		}
	});
}

// Выбираем Stern-Gerlach или Blosh sphere
function handleChange(src) 
{
	if (src.value == "stern_gerlach")
	{
		psi = false; // Stern-Gerlach
		trigger();
	}
	else
	{
		psi = true;  // Bloch sphere
		trigger();
	}
}

function trigger() // переключение между S-G и Bloch sphere
{
	if (psi == false)
	{
		// psi = false  Stern-Gerlach
		
		f2.open();
		
		scene.add( mesh_device_arrow );
		scene.add(meshText_D);
		scene.remove( plane_OXY );	
		recalc();
		document.getElementById('btn_measurment').disabled = false;
		
		btn_measurment.style.display = "block";
		btn_reset_2.style.display = "none";
		btn_reset.style.display = "block";
		
		btn_rotX_plus.disabled = true;
		btn_rotX_min.disabled = true;
		btn_rotY_plus.disabled = true;
		btn_rotY_min.disabled = true;
		btn_rotZ_plus.disabled = true;
		btn_rotZ_min.disabled = true;	
		
		btn_rotX_plus.style.display = "none";
		btn_rotX_min.style.display = "none";
		btn_rotY_plus.style.display = "none";
		btn_rotY_min.style.display = "none";
		btn_rotZ_plus.style.display = "none";
		btn_rotZ_min.style.display = "none";
		
		btn_rotN_plus.disabled = true;
		btn_rotN_min.disabled = true;		
		btn_rotN_plus.style.display = "none";
		btn_rotN_min.style.display = "none";		

		var bt = document.getElementById('btn_rotX_plus');
		bt.style.background = '#eeeeee';
		bt = document.getElementById('btn_rotX_min');
		bt.style.background = '#eeeeee';
		
		bt = document.getElementById('btn_rotY_plus');
		bt.style.background = '#eeeeee';
		bt = document.getElementById('btn_rotY_min');
		bt.style.background = '#eeeeee';
		
		bt = document.getElementById('btn_rotZ_plus');
		bt.style.background = '#eeeeee';
		bt = document.getElementById('btn_rotZ_min');
		bt.style.background = '#eeeeee';
		
		bt = document.getElementById('btn_X');
		bt.style.background='#eeeeee';
		bt = document.getElementById('btn_Y');
		bt.style.background='#eeeeee';
		bt = document.getElementById('btn_Z');
		bt.style.background='#eeeeee';
		bt = document.getElementById('btn_H');
		bt.style.background='#eeeeee';
		
		btn_X.disabled = true;
		btn_Y.disabled = true;
		btn_Z.disabled = true;
		btn_H.disabled = true;
		
		btn_X.style.display="none";
		btn_Y.style.display="none";
		btn_Z.style.display="none";
		btn_H.style.display="none";
		
		btn_Deg10.style.display="none";
		btn_Deg5.style.display="none";
		btn_Deg2.style.display="none";
		btn_Deg10.style.display="none";
		btn_clear_rotation.style.display="none";
		
		text_sg.style.color = "#0000ff";
		text_sg.style.background='#eeffee'; 
		text_sg.style.display="block";
		
		clear_rotation();

		scene.remove(meshText_0);
		scene.remove(meshText_1);
		scene.add(meshText_minus_1z);
		
		scene.remove(meshText_plus_i);
		scene.add(meshText_plus_1y);

		scene.remove(meshText_minus_i);
		scene.add(meshText_minus_1y);
		
		scene.remove(axis_X_BS);
		scene.remove(axis_Y_BS1);
		
		scene.add(meshText_B);
		scene.add(axis_X);
		scene.add(axis_Y_BS);
		
		scene.remove(down_BS);
		scene.add(down_SG);
		
		scene.remove(complexText);
		
		scene.remove(meshText_X_plus);
		scene.remove(meshText_X_minus);
		scene.remove(meshText_Y_plus);
		scene.remove(meshText_Y_minus);
		
		polar_background();
		az_background();
		
		spin_polar_background();
		spin_az_background();
		
		lbl_device_polar.id.defaultValue = "Device θ";
		lbl_device_az.id.defaultValue = "Device φ";
		
		var elem = document.getElementById("quant_params");
		ctx_hud_3.clearRect(0, 0, elem.width, elem.height);
		
		scene.remove(meshText_B);
		
		scene.remove(spinor_line);
		scene.remove(spinor_line_2);
	}
	else
	{
		delta_rot = DEGREE*10;
		
		// psi = true  Bloch sphere
		azimuth = 0;
		polar = 0;
		recalc();
		scene.add( plane_OXY );
		scene.remove( mesh_device_arrow );
		scene.remove(meshText_D);
		document.getElementById('btn_measurment').disabled = true;
		controller.azimuth = 0;
		controller.polar = 0;
		gui.updateDisplay();
		
		btn_measurment.style.display = "none";
		btn_reset.style.display = "none";
		btn_reset_2.style.display = "block";
		
		btn_rotX_plus.disabled = false;
		btn_rotX_min.disabled = false;
		btn_rotY_plus.disabled = false;
		btn_rotY_min.disabled = false;
		btn_rotZ_plus.disabled = false;
		btn_rotZ_min.disabled = false;
		
		btn_rotX_plus.style.display = "block";
		btn_rotX_min.style.display = "block";
		btn_rotY_plus.style.display = "block";
		btn_rotY_min.style.display = "block";
		btn_rotZ_plus.style.display = "block";
		btn_rotZ_min.style.display = "block";
		
		btn_rotN_plus.disabled = false;
		btn_rotN_min.disabled = false;		
		btn_rotN_plus.style.display = "block";
		btn_rotN_min.style.display = "block";	
	
		bt = document.getElementById('btn_X');
		bt.style.background='#22aaaa';
		bt = document.getElementById('btn_Y');
		bt.style.background='#22aaaa';
		bt = document.getElementById('btn_Z');
		bt.style.background='#22aaaa';
		bt = document.getElementById('btn_H');
		bt.style.background='#22aaaa';
		
		btn_X.disabled = false;
		btn_Y.disabled = false;
		btn_Z.disabled = false;
		btn_H.disabled = false;
		
		btn_X.style.display="block";
		btn_Y.style.display="block";
		btn_Z.style.display="block";
		btn_H.style.display="block";
		
		btn_Deg10.style.display="block";
		btn_Deg5.style.display="block";
		btn_Deg2.style.display="block";
		btn_Deg10.style.display="block";
		btn_clear_rotation.style.display="block";
		
		text_sg.style.display="none";
		
		var bt = document.getElementById('btn_Deg10');
		bt.style.background = '#44dd44';
		
		bt = document.getElementById('btn_Deg5');
		bt.style.background = '#bbbbbb';
		
		bt = document.getElementById('btn_Deg2');
		bt.style.background = '#bbbbbb';
	
		scene.add(meshText_0);
		
		scene.remove(meshText_minus_1z);
		scene.add(meshText_1);
		
		scene.remove(meshText_plus_1y);
		scene.add(meshText_plus_i);
		
		scene.remove(meshText_minus_1y);
		scene.add(meshText_minus_i);
		
		//scene.remove(meshText_B);
		
		scene.remove(axis_X);
		scene.remove(axis_Y_BS);
		
		scene.add(axis_Y_BS1);
		scene.add(axis_X_BS);
		
		scene.remove(down_SG);
		scene.add(down_BS);
		
		scene.add(complexText);
		
		scene.add(meshText_X_plus);
		scene.add(meshText_X_minus);
		scene.add(meshText_Y_plus);
		scene.add(meshText_Y_minus);
		
		scene.remove(axis_N);
		
		polar_background();
		az_background();
		
		spin_polar_background();
		spin_az_background();
		
		lbl_device_polar.id.defaultValue = "Axis θ";
		lbl_device_az.id.defaultValue = "Axis φ";
		
		scene.remove(meshText_A);
		
		var tttt = 777;
	}
}

function draw_angles() 
{
	var elem = document.getElementById('hud_2');
//	ctx_hud_2.clearRect(0, 0, elem.width, elem.height);
	if (psi == false)
	{
		var text_polar_electron = roundNumber(polar_electron/DEGREE, 0) + "°";
		text_polar_electron = "Electron θ = " + text_polar_electron; 
		
		var text_azimuth_electron = roundNumber(azimuth_electron/DEGREE, 0) + "°";
		text_azimuth_electron = "Electron φ = " + text_azimuth_electron;
		
		var text_polar = roundNumber(polar/DEGREE, 0) + "°";
		text_polar = "Device θ = " + text_polar;
		
		var text_azimuth = roundNumber(azimuth/DEGREE, 0) + "°";
		text_azimuth = "Device φ = " + text_azimuth;
		
		ctx_hud_2.font = '16px "Times New Roman"';
		
		ctx_hud_2.fillStyle = "#550055";	
		ctx_hud_2.fillText("Input Angles", 90, 90);
		
		ctx_hud_2.fillStyle = "#0000ff";
		ctx_hud_2.fillText(text_polar_electron, 10, 115);
		ctx_hud_2.fillText(text_azimuth_electron, 10, 135);
		
		ctx_hud_2.fillStyle = "#0000ff";
		ctx_hud_2.fillText(text_polar, 140, 115);
		ctx_hud_2.fillText(text_azimuth, 140, 135);	
		
		
		//var probab = "〈σ〉 = ";   // |di〉 =       |u〉 =      |d〉 =

		var spin_teta = polar_electron;
		var spin_fi = azimuth_electron;
		var spin_x = Math.sin(spin_teta) * Math.cos(spin_fi);
		var spin_y = Math.sin(spin_teta) * Math.sin(spin_fi);
		var spin_z = Math.cos(spin_teta);	
		var spin_r = Math.sqrt(Math.pow(spin_x, 2) + Math.pow(spin_y, 2) + Math.pow(spin_z, 2));
		console.log("spin r = ", spin_r);
		
		var device_teta = polar;
		var device_fi = azimuth;
		var device_x = Math.sin(device_teta) * Math.cos(device_fi);
		var device_y = Math.sin(device_teta) * Math.sin(device_fi);
		var device_z = Math.cos(device_teta);
		var device_r = Math.sqrt(Math.pow(device_x, 2) + Math.pow(device_y, 2) + Math.pow(device_z, 2));
		console.log("device r = ", device_r);
		
		// Cosinus угла между осью прибора и направлением спина 
		cos_alpha = spin_x * device_x + spin_y * device_y + spin_z * device_z;
		// Угол между осью прибора и направлением спина 
		var alpha = Math.acos(cos_alpha);
		console.log("alpha = ", alpha);
		
		// Выводим значение угла между осью прибора и направлением спина
		ctx_hud_2.font = '16px "Times New Roman"';
		ctx_hud_2.fillStyle = "#550055";	
		ctx_hud_2.fillText("Input Angles", 90, 90);

		var text1 = "Angle between spin and device";  // α = 
		ctx_hud_2.fillText(text1, 45, 165);	
		
		text1 = "α = " + roundNumber(alpha/DEGREE, 0) + "°";
		ctx_hud_2.font = '16px "Times New Roman"';
		ctx_hud_2.fillStyle = "#0000ff"; 
		ctx_hud_2.fillText(text1, 120, 183);
		
		// Выводим значение косинуса угла между осью прибора и направлением спина
		var text2 = "Сos angle between spin and device";
		ctx_hud_2.font = '16px "Times New Roman"';
		ctx_hud_2.fillStyle = "#550055";
		ctx_hud_2.fillText(text2, 25, 201);	
		
		text2 = "〈σ〉 = " + "cos(α) = " + "(+1)cos²(α/2) + (-1)sin²(α/2) = "  + roundNumber(cos_alpha, 3);
		ctx_hud_2.font = '14px "Times New Roman"';
		ctx_hud_2.fillStyle = "#0000ff";
		ctx_hud_2.fillText(text2, 5, 221);
	}
	else
	{
		var text_polar_electron = roundNumber(polar_electron/DEGREE, 0) + "°";
		text_polar_electron = "Electron θ = " + text_polar_electron; 
		
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
		
		var text_azimuth_electron = roundNumber(azimuth_electron_DEGREE, 0) + "°";
		//////////////////////
		
		// var text_azimuth_electron = roundNumber(azimuth_electron/DEGREE, 0) + "°";
		text_azimuth_electron = "Electron φ = " + text_azimuth_electron;
		
		var text_polar = roundNumber(polar/DEGREE, 0) + "°";
		text_polar = "Axis rotation θ = " + text_polar;
		
		var text_azimuth = roundNumber(azimuth/DEGREE, 0) + "°";
		
		text_azimuth = "Axis rotation φ = " + text_azimuth;
		
		ctx_hud_2.font = '16px "Times New Roman"';
		
		ctx_hud_2.fillStyle = "#550055";	
		ctx_hud_2.fillText("Input Angles", 90, 90);
		
		ctx_hud_2.fillStyle = "#0000ff";
		ctx_hud_2.fillText(text_polar_electron, 10, 115);
		ctx_hud_2.fillText(text_azimuth_electron, 10, 135);
		
		ctx_hud_2.fillStyle = "#0000ff";
		ctx_hud_2.fillText(text_polar, 140, 115);
		ctx_hud_2.fillText(text_azimuth, 140, 135);	

		//////////////////////////////////////////////////////

		var spin_teta = polar_electron;
		var spin_fi = azimuth_electron;
		var spin_x = Math.sin(spin_teta) * Math.cos(spin_fi);
		var spin_y = Math.sin(spin_teta) * Math.sin(spin_fi);
		var spin_z = Math.cos(spin_teta);	
		var spin_r = Math.sqrt(Math.pow(spin_x, 2) + Math.pow(spin_y, 2) + Math.pow(spin_z, 2));
		console.log("spin r = ", spin_r);
		
		var device_teta = polar;
		var device_fi = azimuth;
		// var device_x = Math.sin(device_teta) * Math.cos(device_fi);
		// var device_y = Math.sin(device_teta) * Math.sin(device_fi);
		// var device_z = Math.cos(device_teta);
		// var device_r = Math.sqrt(Math.pow(device_x, 2) + Math.pow(device_y, 2) + Math.pow(device_z, 2));
		// console.log("device r = ", device_r);
		
		var device_x = 0;
		var device_y = 0;
		var device_z = 1;
		
		// Cosinus угла между осью прибора и направлением спина 
		var cos_alpha_BS = spin_x * device_x + spin_y * device_y + spin_z * device_z;
		// Угол между осью прибора и направлением спина 
		var alpha = Math.acos(cos_alpha_BS);
		console.log("alpha = ", alpha);

		var prb_BS = 0;
		prb_BS = (Math.cos(alpha/2) * Math.cos(alpha/2)) * 100;
		var prb1_BS = (Math.cos(alpha/2) * Math.cos(alpha/2));
		
		var num1 = roundNumber(prb1_BS, 4);
		var num2 = roundNumber(1 - prb1_BS, 4);
		
		// var text3 = "P(1) =  cos²(α/2) = " + num1;
		// var text4 = "P(-1) = sin²(α/2) = " + num2;
		
		var text3 = "P(+1) = " + num1;
		var text4 = "P(-1) = " + num2;
		
		ctx_hud_2.font = '14px "Times New Roman"';
		
		ctx_hud_2.fillStyle = "#008800";
		ctx_hud_2.fillText(text3, 110, 170);	
		
		ctx_hud_2.fillStyle = "#0000ff";
		ctx_hud_2.fillText(text4, 110, 190);	
		
		// Сразу выводим диаграмму
		add_chart(prb_BS, 260);

		///////////////////////////////////////////////////////

		ctx_hud_2.font = 'italic 24px "Times New Roman"';
		ctx_hud_2.fillStyle = "#0000ff";
		ctx_hud_2.fillText("Bloch - Riemann sphere", 25, 355);
		ctx_hud_2.fillText(" and quantum rotations", 25, 390);
	}
}

addEventListener("load", initiate);

window.onload = init;
