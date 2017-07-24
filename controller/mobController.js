APP.mobController = function($scope){

	$scope.mobs = {
		spawned: [],
		notSpawned: [],
		dead: [],
	}
	
	$scope.spawnMob = function(){
		var sl = $scope.mobs.notSpawned;
		for (var i = 0; i < sl.length; i++){
			if ($scope.gameDistance > sl[i].distance){
				var newObject = jQuery.extend(true, {}, $scope.mobData[sl[i].eid - 1]);
				newObject.y = Math.floor(Math.random() * ($scope.screenHeight - ($scope.screenHeight / 10)));
				newObject.x = $(window).width();
				$scope.mobs.spawned.push(newObject);
				sl.splice(i, 1);
			}
		}
	}

	$scope.createSpawnList = function(){
		var cl = $scope.currentLevel;
		for (var i = 0; i < cl.level.length; i++){
			var so = cl.level[i];
			for(var j = 0; j < so.amount; j++){
				var spawnDistance = Math.floor(Math.random() * (so.endDistance - so.startDistance)) + so.startDistance;
				var obj = {
					eid: so.eid,
					distance: spawnDistance,
				}
				$scope.mobs.notSpawned.push(obj);
			}
		}
	}

	$scope.updateMobs = function(){
		var b = $scope.mobs.spawned;
		var p = $scope.player;
		$scope.targetPlayer();
		for (var i = 0; i < b.length; i++){
			var m = b[i];
			if (m.x < - 3 * m.box.y){
				b.splice(i, 1);
			} 
			m.x -= m.xspeed;
			if (m.target == $scope.player){
				if(m.y > p.y + 10)	m.y -= m.yspeed;
				else if(m.y < p.y - 10)	m.y += m.yspeed;
			}
			if(m.zig != null){
				if(!m.zig.zigDown && !m.zig.zigUp){
					m.zig.zigDestY = m.y - Math.floor(Math.random() * m.zig.zigFactor) + m.zig.zigFactor / 4;
					m.zig.zigDown = false;
					m.zig.zigUp = true;
				}
				else if(m.zig.zigDown){
					m.y += m.yspeed;
					if(m.y > m.zig.zigDestY){
						m.zig.zigDestY = m.y - Math.floor(Math.random() * m.zig.zigFactor) + m.zig.zigFactor / 4;
						m.zig.zigDown = false;
						m.zig.zigUp = true;
					}
				}
				else if(m.zig.zigUp){
					m.y -= m.yspeed;
					if(m.y < m.zig.zigDestY){
						m.zig.zigDestY = m.y + Math.floor(Math.random() * m.zig.zigFactor) + m.zig.zigFactor / 4;
						m.zig.zigDown = true;
						m.zig.zigUp = false;
					}
				}
			}
		}
		$scope.cleanDead();
	}

	$scope.cleanDead = function(){
		var b = $scope.mobs.dead;
		for (var i = 0; i < b.length; i++){
			var m = b[i];
			m.deadTimer -= 1;
			if(m.deadTimer <= 0){
				b.splice(i, 1);
			}
		}
	}

	$scope.targetPlayer = function(){
		// BULLET - MOB COLLISION
		var p = $scope.player;
		var m = $scope.mobs.spawned;
		for (var i = 0; i < m.length; i++){
			if(m[i].x > p.x && m[i].targetRange > 0 && (m[i].x - p.x < m[i].targetRange)){
				m[i].target = $scope.player;
			}
		}
	}
}