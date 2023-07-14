// text.js

var meshText_plus_i, meshText_minus_i, 
	meshText_plus_1_z, meshText_minus_1_z,
	meshText_plus_1_y, meshText_minus_1_y,
	meshText_plus_1_x, meshText_minus_1_x,
	meshText_N, meshText_S;
	
var text_plus_up, text_minus_up,
	text_plus_down, text_minus_down,
	text_plus_right, text_minus_right,
	text_plus_left, text_minus_left,
	text_plus_forward, text_minus_forward,
	text_plus_back, text_minus_back;
	
function spinor_text()
{
	// Сферы
	// sp_num1 & sp_num2
	var spGeometry = new THREE.SphereGeometry(0.15, 8, 8);
	var spMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
	spMaterial.side = THREE.FrontSide;
	spMaterial.shading = THREE.FlatShading;

	
	var sp_num1 = new THREE.Mesh(spGeometry, spMaterial);
	var sp_num2 = new THREE.Mesh(spGeometry, spMaterial);
	var sp_num3 = new THREE.Mesh(spGeometry, spMaterial);
	var sp_num4 = new THREE.Mesh(spGeometry, spMaterial);
	var sp_num5 = new THREE.Mesh(spGeometry, spMaterial);
	var sp_num6 = new THREE.Mesh(spGeometry, spMaterial);	
	var sp_num7 = new THREE.Mesh(spGeometry, spMaterial);
	var sp_num8 = new THREE.Mesh(spGeometry, spMaterial);
	
	sp_num1.position.set( rs,  0,   0); //  1>
	sp_num2.position.set(-rs,  0,   0); // -1>
	sp_num3.position.set( 0,  rs,   0); //  0>
	sp_num4.position.set( 0, -rs,   0); // -0>	
	sp_num5.position.set( 0.707 * rs,  0.707 * rs, 0); // +>
	sp_num6.position.set(-0.707 * rs, -0.707 * rs, 0); // ->
	sp_num7.position.set( 0.707 * rs, -0.707 * rs, 0); //  ->
	sp_num8.position.set(-0.707 * rs,  0.707 * rs, 0); // -->

	var sp_num9 =  new THREE.Mesh(spGeometry, spMaterial);
	var sp_num10 = new THREE.Mesh(spGeometry, spMaterial);
	var sp_num11 =  new THREE.Mesh(spGeometry, spMaterial);
	var sp_num12 = new THREE.Mesh(spGeometry, spMaterial);
	var sp_num13 =  new THREE.Mesh(spGeometry, spMaterial);
	var sp_num14 = new THREE.Mesh(spGeometry, spMaterial);
	sp_num9.position.set( 0,  0.707 * rs,  0.707 * rs); //  1>
	sp_num10.position.set(0, -0.707 * rs, -0.707 * rs); // -1>
	sp_num11.position.set(0, -0.707 * rs,  0.707 * rs); //  1>
	sp_num12.position.set(0, 0.707 * rs,  -0.707 * rs); // -1>
	sp_num13.position.set(0,  0,  rs); //  1>
	sp_num14.position.set(0,  0,  -rs); // -1>
	
	scene.add(sp_num1);
	scene.add(sp_num2);
	scene.add(sp_num3);
	scene.add(sp_num4);
	scene.add(sp_num5);
	scene.add(sp_num6);
	scene.add(sp_num7);
	scene.add(sp_num8);
	scene.add(sp_num9);
	scene.add(sp_num10);
	scene.add(sp_num11);
	scene.add(sp_num12);
	scene.add(sp_num13);
	scene.add(sp_num14);
}


function symbol_text()	
{
	// Текст
	
	// +1 axes y
	meshText_plus_1_y = new THREE.Object3D();
	meshText_plus_1_y.add(
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_plus_1_y.children[0].visible = true; // делаем видимой

	generateGeometry( meshText_plus_1_y, "+1" );
	meshText_plus_1_y.scale.set(0.15, 0.15, 0.15);	
	meshText_plus_1_y.position.set(rs + 0.7, 0.5, 0);
//	scene.add(meshText_plus_1_y);	 
	
	// -1 axes y
	meshText_minus_1_y = new THREE.Object3D();
	meshText_minus_1_y.add(
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_minus_1_y.children[0].visible = true; // делаем видимой

	generateGeometry( meshText_minus_1_y, "-1" ); // 〈  ‹ ›        > < ➝
	meshText_minus_1_y.scale.set(0.15, 0.15, 0.15);	
	meshText_minus_1_y.position.set(- rs - 0.7, 0.5, 0);
//	scene.add(meshText_minus_1_y);
	
	// ********************************************************************

	// +i
	meshText_plus_i = new THREE.Object3D();
	meshText_plus_i.add(
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_plus_i.children[0].visible = true; // делаем видимой

	generateGeometry( meshText_plus_i, "+i" );
	meshText_plus_i.scale.set(0.15, 0.15, 0.15);	
	meshText_plus_i.position.set(rs + 0.7, 0.5, 0);
//	scene.add(meshText_plus_i);	 
	
	// -i
	meshText_minus_i = new THREE.Object3D();
	meshText_minus_i.add(
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_minus_i.children[0].visible = true; // делаем видимой

	generateGeometry( meshText_minus_i, "-i" ); // 〈  ‹ ›        > < ➝
	meshText_minus_i.scale.set(0.15, 0.15, 0.15);	
	meshText_minus_i.position.set(- rs - 0.7, 0.5, 0);
//	scene.add(meshText_minus_i);
	
	// +1 axes z
	meshText_plus_1_z = new THREE.Object3D();
	meshText_plus_1_z.add(
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_plus_1_z.children[0].visible = true; // делаем видимой

	generateGeometry( meshText_plus_1_z, "+1" ); // 〈  ‹ ›        > < ➝
	meshText_plus_1_z.scale.set(0.15, 0.15, 0.15);	
	meshText_plus_1_z.position.set(0.8, rs + 0.5, 0.5);
//	scene.add(meshText_plus_1_z); 
	
	// -1 axes z
	meshText_minus_1_z = new THREE.Object3D();
	meshText_minus_1_z.add(
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_minus_1_z.children[0].visible = true; // делаем видимой

	generateGeometry( meshText_minus_1_z, "-1" ); // 〈  ‹ ›        > < ➝
	meshText_minus_1_z.scale.set(0.15, 0.15, 0.15);	
	meshText_minus_1_z.position.set(0, -rs - 0.5, 0.5);
//	scene.add(meshText_minus_1_z);

	// +1 axes x
	meshText_plus_1_x = new THREE.Object3D();
	meshText_plus_1_x.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_plus_1_x.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_plus_1_x, "+1" );
	meshText_plus_1_x.scale.set(0.15, 0.15, 0.15);	
	meshText_plus_1_x.position.set(0.8, 0.5, rs + 0.5);
//	scene.add(meshText_plus_1_x);
	
	// -1 axes x
	meshText_minus_1_x = new THREE.Object3D();
	meshText_minus_1_x.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_minus_1_x.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_minus_1_x, "-1" );
	meshText_minus_1_x.scale.set(0.15, 0.15, 0.15);	
	meshText_minus_1_x.position.set(0.8, 0.5, -rs - 0.5);
//	scene.add(meshText_minus_1_x);
	
	//*************************************************************
	var r1 = 15.0;
	
	meshText_N = new THREE.Object3D();
	meshText_N.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x0000f0, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_N.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_N, "I0>" );
	meshText_N.scale.set(0.13, 0.17, 0.05);	
	var x = 0 - 0.9;
	var y = r1 - 0.2; 
	var z = 0;
	meshText_N.position.set(x, y, z);
//	scene.add(meshText_N);


	meshText_S = new THREE.Object3D();
	meshText_S.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x0000f0, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_S.children[0].visible = true; // делаем видимой
	
	generateGeometry( meshText_S, "I1>" );
	meshText_S.scale.set(0.13, 0.17, 0.13);	
	var x = 0 - 1.1;
	var y = - r1 + 0.25; 
	var z = 0;
	meshText_S.position.set(x, y, z);
//	scene.add(meshText_S);
	
	//*************************************************************
	//*************************************************************
/*	
	// +i
	const meshText_plus_i = new THREE.Object3D();
	meshText_plus_i.add(
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_plus_i.children[0].visible = true; // делаем видимой

	generateGeometry( meshText_plus_i, "+ i" );
	meshText_plus_i.scale.set(0.15, 0.15, 0.15);	
	meshText_plus_i.position.set(rs + 0.6, 0.5, 0);
	scene.add(meshText_plus_i);	 
	
	// -i
	const meshText_minus_i = new THREE.Object3D();
	meshText_minus_i.add(
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	meshText_minus_i.children[0].visible = true; // делаем видимой

	generateGeometry( meshText_minus_i, "- i" ); // 〈  ‹ ›        > < ➝
	meshText_minus_i.scale.set(0.15, 0.15, 0.15);	
	meshText_minus_i.position.set(- rs - 0.7, 0.5, 0);
	scene.add(meshText_minus_i);
*/	
	// |u>
	text_plus_up = new THREE.Object3D();
	text_plus_up.add(
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	text_plus_up.children[0].visible = true; // делаем видимой

	generateGeometry( text_plus_up, "|up>" ); // 〈  ‹ ›        > < ➝
	text_plus_up.scale.set(0.2, 0.12, 0.03);	
	text_plus_up.position.set(0.8, rs + 0.8, 0.5);
//	scene.add(text_plus_up); 
	
	// -|u>
	text_minus_up = new THREE.Object3D();
	text_minus_up.add(
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	text_minus_up.children[0].visible = true; // делаем видимой

	generateGeometry( text_minus_up, "-|up>" ); // 〈  ‹ ›        > < ➝
	text_minus_up.scale.set(0.2, 0.12, 0.03);	
	text_minus_up.position.set(0, -rs - 0.8, 0.5);
//	scene.add(text_minus_up);

	// |d>
	text_plus_down = new THREE.Object3D();
	text_plus_down.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	text_plus_down.children[0].visible = true; // делаем видимой
	
	generateGeometry( text_plus_down, "|dn>" );
	text_plus_down.scale.set(0.2, 0.12, 0.03);	
	text_plus_down.position.set(0.8, 0.7, rs + 0.7);
//	scene.add(text_plus_down);
	
	// -|d>
	text_minus_down = new THREE.Object3D();
	text_minus_down.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000000, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	text_minus_down.children[0].visible = true; // делаем видимой
	
	generateGeometry( text_minus_down, "-|dn>" );
	text_minus_down.scale.set(0.2, 0.12, 0.03);	
	text_minus_down.position.set(0.8, 0.7, -rs - 0.7);
//	scene.add(text_minus_down);
	
	// *************************************************************
	
	// |r> 
	text_plus_right = new THREE.Object3D();
	text_plus_right.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000077, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	text_plus_right.children[0].visible = true; // делаем видимой
	
	generateGeometry( text_plus_right, "|right>" );
	text_plus_right.scale.set(0.2, 0.15, 0.03);	
	text_plus_right.position.set(0, 0.707 * rs * 1.1,  0.707 * rs * 1.1);
//	scene.add(text_plus_right);
	
	// -|r> 
	text_minus_right = new THREE.Object3D();
	text_minus_right.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000077, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	text_minus_right.children[0].visible = true; // делаем видимой
	
	generateGeometry( text_minus_right, "-|right>" );
	text_minus_right.scale.set(0.2, 0.15, 0.03);	
	text_minus_right.position.set(0, - 0.707 * rs * 1.1,  - 0.707 * rs * 1.1);
//	scene.add(text_minus_right);

	// |lt>
	text_plus_left = new THREE.Object3D();
	text_plus_left.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000077, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	text_plus_left.children[0].visible = true; // делаем видимой
	
	generateGeometry( text_plus_left, "|left>" );
	text_plus_left.scale.set(0.2, 0.15, 0.03);	
	text_plus_left.position.set(0, -0.707 * rs * 1.1,  0.707 * rs * 1.1);
//	scene.add(text_plus_left);	
	
	// -|lt>
	text_minus_left = new THREE.Object3D();
	text_minus_left.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x000077, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	text_minus_left.children[0].visible = true; // делаем видимой
	
	generateGeometry( text_minus_left, "-|left>" );
	text_minus_left.scale.set(0.2, 0.15, 0.03);	
	text_minus_left.position.set(0, 0.707 * rs * 1.1,  - 0.707 * rs * 1.1);
//	scene.add(text_minus_left);	

	// **********************************************************************

	// |f>
	text_plus_forward = new THREE.Object3D();
	text_plus_forward.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x0000aa, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	text_plus_forward.children[0].visible = true; // делаем видимой
	
	generateGeometry( text_plus_forward, "|frwd>" );
	text_plus_forward.scale.set(0.2, 0.15, 0.03);	
	text_plus_forward.rotation.y = Math.PI/2;
	text_plus_forward.position.set(0.707 * rs, 0.707 * rs * 1.1, 0);
//	scene.add(text_plus_forward);	
	
	// -|f>
	text_minus_forward = new THREE.Object3D();
	text_minus_forward.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x0000aa, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	text_minus_forward.children[0].visible = true; // делаем видимой
	
	generateGeometry( text_minus_forward, "-|frwd>" );
	text_minus_forward.scale.set(0.2, 0.15, 0.03);	
	text_minus_forward.rotation.y = -Math.PI/2;
	text_minus_forward.position.set( - 0.707 * rs, - 0.707 * rs * 1.1, 0);
//	scene.add(text_minus_forward);
	
	// ****************************************************************
	
	// |b>
	text_plus_back = new THREE.Object3D();
	text_plus_back.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x0000aa, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	text_plus_back.children[0].visible = true; // делаем видимой
	
	generateGeometry( text_plus_back, "|back>" );
	text_plus_back.scale.set(0.2, 0.15, 0.03);	
	text_plus_back.rotation.y = Math.PI/2;
	text_plus_back.position.set(0.707 * rs, - 0.707 * rs * 1.1, 0);
//	scene.add(text_plus_back);

	// -|b>
	text_minus_back = new THREE.Object3D();
	text_minus_back.add(
		// присоединяем к объекту meshText
		// модель "номера грани" с закрашенными гранями и делаем ее видимой
		new THREE.Mesh(
			new THREE.Geometry(),
			new THREE.MeshBasicMaterial({color: 0x0000aa, 
										 side: THREE.DoubleSide, 
										 shading: THREE.FlatShading})));
	text_minus_back.children[0].visible = true; // делаем видимой
	
	generateGeometry( text_minus_back, "-|back>" );
	text_minus_back.scale.set(0.2, 0.15, 0.03);	
	text_minus_back.rotation.y = -Math.PI/2;
	text_minus_back.position.set(-0.707 * rs, 0.707 * rs * 1.1, 0);
//	scene.add(text_minus_back);
}

function add_symbol_text_1()
{	
	scene.remove(text_plus_up); 
	scene.remove(text_minus_up);
	scene.remove(text_plus_down);
	scene.remove(text_minus_down);
	scene.remove(text_plus_right);
	scene.remove(text_minus_right);
	scene.remove(text_plus_left);
	scene.remove(text_minus_left);
	scene.remove(text_plus_forward);
	scene.remove(text_minus_forward);
	scene.remove(text_plus_back); 
	scene.remove(text_minus_back);	
	
	scene.add(meshText_plus_1_z);
	scene.add(meshText_minus_1_z);
	scene.add(meshText_plus_1_x); 
	scene.add(meshText_minus_1_x);
//	scene.add(meshText_N);
//	scene.add(meshText_S);
	
	scene.remove(meshText_plus_i);
	scene.remove(meshText_minus_i); 
	scene.add(meshText_plus_1_y);
	scene.add(meshText_minus_1_y); 
}

function add_symbol_text_2()
{
	scene.remove(meshText_plus_1_z);
	scene.remove(meshText_minus_1_z);
	scene.remove(meshText_plus_1_x); 
	scene.remove(meshText_minus_1_x);
//	scene.remove(meshText_N);
//	scene.remove(meshText_S);		
	
	scene.add(text_plus_up); 
	scene.add(text_minus_up);
	scene.add(text_plus_down);
	scene.add(text_minus_down);
	scene.add(text_plus_right);
	scene.add(text_minus_right);
	scene.add(text_plus_left);
	scene.add(text_minus_left);
	scene.add(text_plus_forward);
	scene.add(text_minus_forward);
	scene.add(text_plus_back); 
	scene.add(text_minus_back);
	
	scene.remove(meshText_plus_1_y);
	scene.remove(meshText_minus_1_y); 
	scene.add(meshText_plus_i);
	scene.add(meshText_minus_i); 
}

function handleChange(src) 
{
	if (src.value == "up_down_180")
	{
		add_symbol_text_1();
	}
	else
	{
		add_symbol_text_2();
	}
}